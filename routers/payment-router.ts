import { Request, Response } from "express";
import { Router } from "express";
import PrismaService from "../services/prisma-service";
import AuthenticationService from "../services/authentication-service";

class PaymentRouter {
  public router: Router;
  private authService: AuthenticationService =
    AuthenticationService.getInstance();
  private prismaService: PrismaService = PrismaService.getInstance();

  private createRoute: string = "/create";
  private getRoute: string = "/get";
  private searchRoute: string = "/search";
  private selectRoute: string = "/select";
  private updateRoute: string = "/update";
  private updateStockRoute: string = "/update-stock";

  private select: object = {
    id: true,
    ndatetimePaymentme: true,
    amount: true,
    status: true,
    PaymentLog: {
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
  };

  private orderBy: object = {
    datetimePayment: "asc",
  };

  constructor() {
    this.router = Router();
    this.setCreateRoute();
    this.setGetRoute();
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
            `Creating payment using the following data: ${JSON.stringify(
              req.body.data
            )}`
          );
          const payment = await this.prismaService.prisma.payment.create({
            data: req.body.data,
          });
          console.log(`Payment created: ${JSON.stringify(payment)}`);
          await this.prismaService.prisma.paymentLog.create({
            data: {
              type: "create",
              paymentId: payment.id,
              operatorId: req.body.decodedToken.id,
              content: payment,
            },
          });
          const event = await this.prismaService.prisma.event.update({
            where: {
              id: req.body.data.eventId,
            },
            data: {
              balance: {
                decrement: req.body.data.amount,
              },
            },
          });
          res.status(200).json({ id: payment.id });
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
          let result = await this.prismaService.prisma.payment.findMany({
            where: {
              status: "ok",
            },
            orderBy: this.orderBy,
            select: this.select,
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} payments sent to user ${req.body.decodedToken.id}.`
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
          let result = await this.prismaService.prisma.payment.findMany({
            where: {
              AND: [{ status: "ok" }],
            },
            orderBy: this.orderBy,
            select: this.select,
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} payments sent to user ${req.body.decodedToken.id}.`
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
          let result = await this.prismaService.prisma.payment.findFirst({
            where: {
              id: req.body.id,
            },
            select: this.select,
          });
          if (!result) return res.status(400).send();
          console.log(
            `payment record has been sent to user ${req.body.decodedToken.id}.`
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
            `Updating payment ${
              req.body.id
            } using the following data: ${JSON.stringify(req.body.data)}`
          );
          let result = await this.prismaService.prisma.payment.update({
            where: { id: req.body.id },
            data: req.body.data,
          });
          if (!result) return res.status(400).send();
          console.log(`Payment ${req.body.id} updated.`);
          req.body.data.id = req.body.id;
          await this.prismaService.prisma.paymentLog.create({
            data: {
              type: "update",
              paymentId: req.body.id,
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

export default PaymentRouter;
