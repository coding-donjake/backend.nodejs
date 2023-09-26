import { Request, Response } from "express";
import { Router } from "express";
import AuthenticationService from "../services/authentication-service";
import PrismaService from "../services/prisma-service";

class CustomerRouter {
  public router: Router;
  private authService: AuthenticationService =
    AuthenticationService.getInstance();
  private prismaService: PrismaService = PrismaService.getInstance();

  private createRoute: string = "/create";
  private getRoute: string = "/get";
  private searchRoute: string = "/search";
  private selectRoute: string = "/select";
  private updateRoute: string = "/update";

  private selectTemplate: object = {
    id: true,
    address: true,
    phone: true,
    email: true,
    status: true,
    CustomerLog: {
      orderBy: {
        datetime: "desc",
      },
      select: {
        datetime: true,
        type: true,
        content: true,
        Operator: {
          select: {
            username: true,
            UserInformation: {
              select: {
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
    User: {
      select: {
        id: true,
        username: true,
        status: true,
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
      [
        this.authService.verifyToken,
        this.authService.verifyUser,
        this.authService.verifyAdmin,
      ],
      async (req: Request, res: Response) => {
        try {
          console.log(
            `Creating customer using the following data: ${JSON.stringify(
              req.body.data
            )}`
          );
          const customer = await this.prismaService.prisma.customer.create({
            data: req.body.data,
          });
          console.log(`Customer created: ${JSON.stringify(customer)}`);
          await this.prismaService.prisma.customerLog.create({
            data: {
              type: "create",
              customerId: customer.id,
              operatorId: req.body.decodedToken.id,
              content: customer,
            },
          });
          res.status(200).json({ id: customer.id });
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
      [
        this.authService.verifyToken,
        this.authService.verifyUser,
        this.authService.verifyAdmin,
      ],
      async (req: Request, res: Response) => {
        try {
          let result = await this.prismaService.prisma.customer.findMany({
            where: {
              OR: [{ status: "ok" }, { status: "flagged" }],
            },
            select: this.selectTemplate,
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} customers sent to user ${req.body.decodedToken.id}.`
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
      [
        this.authService.verifyToken,
        this.authService.verifyUser,
        this.authService.verifyAdmin,
      ],
      async (req: Request, res: Response) => {
        try {
          let result = await this.prismaService.prisma.customer.findMany({
            where: {
              AND: [
                {
                  OR: [{ status: "ok" }, { status: "flagged" }],
                },
                {
                  OR: [
                    {
                      User: {
                        UserInformation: {
                          lastname: req.body.key,
                        },
                      },
                    },
                    {
                      User: {
                        UserInformation: {
                          firstname: req.body.key,
                        },
                      },
                    },
                    {
                      User: {
                        UserInformation: {
                          middlename: req.body.key,
                        },
                      },
                    },
                  ],
                },
              ],
            },
            select: this.selectTemplate,
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} customers sent to user ${req.body.decodedToken.id}.`
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
      [
        this.authService.verifyToken,
        this.authService.verifyUser,
        this.authService.verifyAdmin,
      ],
      async (req: Request, res: Response) => {
        try {
          let result = await this.prismaService.prisma.customer.findFirst({
            where: {
              id: req.body.id,
            },
            select: this.selectTemplate,
          });
          if (!result) return res.status(400).send();
          console.log(
            `customer record has been sent to user ${req.body.decodedToken.id}.`
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
      [
        this.authService.verifyToken,
        this.authService.verifyUser,
        this.authService.verifyAdmin,
      ],
      async (req: Request, res: Response) => {
        try {
          console.log(
            `Updating customer ${
              req.body.id
            } using the following data: ${JSON.stringify(req.body.data)}`
          );
          let result = await this.prismaService.prisma.customer.update({
            where: { id: req.body.id },
            data: req.body.data,
          });
          if (!result) return res.status(400).send();
          console.log(`Borrowing ${req.body.id} updated.`);
          await this.prismaService.prisma.customerLog.create({
            data: {
              type: "update",
              customerId: req.body.id,
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

export default CustomerRouter;
