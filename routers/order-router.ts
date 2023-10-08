import { Request, Response } from "express";
import { Router } from "express";
import AuthenticationService from "../services/authentication-service";
import PrismaService from "../services/prisma-service";

class OrderRouter {
  public router: Router;
  private authService: AuthenticationService =
    AuthenticationService.getInstance();
  private prismaService: PrismaService = PrismaService.getInstance();

  private createRoute: string = "/create";
  private getRoute: string = "/get";
  private getActiveRoute: string = "/get-active";
  private searchRoute: string = "/search";
  private selectRoute: string = "/select";
  private updateRoute: string = "/update";

  private select: object = {
    id: true,
    datetimeOrdered: true,
    datetimeExpected: true,
    datetimeArrived: true,
    status: true,
    OrderLog: {
      orderBy: {
        datetime: "desc",
      },
      select: {
        id: true,
        datetime: true,
        type: true,
        content: true,
        Operator: {
          select: {
            id: true,
            username: true,
            UserInformation: {
              select: {
                id: true,
                lastname: true,
                firstname: true,
                middlename: true,
                suffix: true,
                gender: true,
                birthdate: true,
              },
            },
          },
        },
      },
    },
    Supplier: {
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        email: true,
        status: true,
      },
    },
    OrderSupply: {
      where: {
        status: "ok",
      },
      select: {
        id: true,
        quantity: true,
        status: true,
        Supply: {
          select: {
            id: true,
            name: true,
            brand: true,
            type: true,
            stock: true,
            status: true,
          },
        },
      },
    },
  };

  constructor() {
    this.router = Router();
    this.setCreateRoute();
    this.setGetRoute();
    this.setGetActiveRoute();
    this.setSearchRoute();
    this.setSelectRoute();
    this.setUpdateRoute();
  }

  private setCreateRoute = async () => {
    this.router.post(
      this.createRoute,
      [this.authService.verifyToken, this.authService.verifyUser],
      async (req: Request, res: Response) => {
        try {
          console.log(
            `Creating order using the following data: ${JSON.stringify(
              req.body.data
            )}`
          );
          const order = await this.prismaService.prisma.order.create({
            data: req.body.data,
          });
          console.log(`Order created: ${JSON.stringify(order)}`);
          await this.prismaService.prisma.orderLog.create({
            data: {
              type: "create",
              orderId: order.id,
              operatorId: req.body.decodedToken.id,
              content: order,
            },
          });
          res.status(200).json({ id: order.id });
        } catch (error) {
          console.error(error);
          res.status(500).json({
            status: "server error",
            msg: error,
          });
        }
      }
    );
  };

  private setGetRoute = async () => {
    this.router.post(
      this.getRoute,
      [this.authService.verifyToken, this.authService.verifyUser],
      async (req: Request, res: Response) => {
        try {
          let result = await this.prismaService.prisma.order.findMany({
            where: {
              OR: [
                { status: "active" },
                { status: "arrived" },
                { status: "cancelled" },
              ],
            },
            orderBy: [{ datetimeOrdered: "asc" }],
            select: this.select,
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} orders sent to user ${req.body.decodedToken.id}.`
          );
          res.status(200).json({ data: result });
        } catch (error) {
          console.error(error);
          res.status(500).json({
            status: "server error",
            msg: error,
          });
        }
      }
    );
  };

  private setGetActiveRoute = async () => {
    this.router.post(
      this.getActiveRoute,
      [this.authService.verifyToken, this.authService.verifyUser],
      async (req: Request, res: Response) => {
        try {
          let result = await this.prismaService.prisma.order.findMany({
            where: {
              OR: [{ status: "active" }],
            },
            orderBy: [{ datetimeOrdered: "asc" }],
            select: this.select,
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} orders sent to user ${req.body.decodedToken.id}.`
          );
          res.status(200).json({ data: result });
        } catch (error) {
          console.error(error);
          res.status(500).json({
            status: "server error",
            msg: error,
          });
        }
      }
    );
  };

  private setSearchRoute = async () => {
    this.router.post(
      this.searchRoute,
      [this.authService.verifyToken, this.authService.verifyUser],
      async (req: Request, res: Response) => {
        try {
          let result = await this.prismaService.prisma.order.findMany({
            where: {
              AND: [
                {
                  OR: [
                    { status: "active" },
                    { status: "arrived" },
                    { status: "cancelled" },
                  ],
                },
                {
                  OR: [
                    {
                      datetimeOrdered: {
                        gte: req.body.datetimeOrdered.start,
                        lte: req.body.datetimeOrdered.end,
                      },
                    },
                    {
                      datetimeExpected: {
                        gte: req.body.datetimeExpected.start,
                        lte: req.body.datetimeExpected.end,
                      },
                    },
                    {
                      datetimeArrived: {
                        gte: req.body.datetimeArrived.start,
                        lte: req.body.datetimeArrived.end,
                      },
                    },
                  ],
                },
              ],
            },
            select: this.select,
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} orders sent to user ${req.body.decodedToken.id}.`
          );
          res.status(200).json({ data: result });
        } catch (error) {
          console.error(error);
          res.status(500).json({
            status: "server error",
            msg: error,
          });
        }
      }
    );
  };

  private setSelectRoute = async () => {
    this.router.post(
      this.selectRoute,
      [this.authService.verifyToken, this.authService.verifyUser],
      async (req: Request, res: Response) => {
        try {
          let result = await this.prismaService.prisma.order.findFirst({
            where: {
              id: req.body.id,
            },
            select: this.select,
          });
          if (!result) return res.status(400).send();
          console.log(
            `order record has been sent to user ${req.body.decodedToken.id}.`
          );
          res.status(200).json({ data: result });
        } catch (error) {
          console.error(error);
          res.status(500).json({
            status: "server error",
            msg: error,
          });
        }
      }
    );
  };

  private setUpdateRoute = async () => {
    this.router.post(
      this.updateRoute,
      [this.authService.verifyToken, this.authService.verifyUser],
      async (req: Request, res: Response) => {
        try {
          console.log(
            `Updating order ${
              req.body.id
            } using the following data: ${JSON.stringify(req.body.data)}`
          );
          let result = await this.prismaService.prisma.order.update({
            where: { id: req.body.id },
            data: req.body.data,
          });
          if (!result) return res.status(400).send();
          console.log(`Order ${req.body.id} updated.`);
          req.body.data.id = req.body.id;
          await this.prismaService.prisma.orderLog.create({
            data: {
              type: "update",
              orderId: req.body.id,
              operatorId: req.body.decodedToken.id,
              content: req.body.data,
            },
          });
          res.status(200).send();
        } catch (error) {
          console.error(error);
          res.status(500).json({
            status: "server error",
            msg: error,
          });
        }
      }
    );
  };
}

export default OrderRouter;
