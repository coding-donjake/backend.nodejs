import { Request, Response } from "express";
import { Router } from "express";
import AuthenticationService from "../services/authentication-service";
import PrismaService from "../services/prisma-service";

class EventRouter {
  public router: Router;
  private authService: AuthenticationService =
    AuthenticationService.getInstance();
  private prismaService: PrismaService = PrismaService.getInstance();

  private createRoute: string = "/create";
  private getRoute: string = "/get";
  private searchRoute: string = "/search";
  private selectRoute: string = "/select";
  private updateRoute: string = "/update";

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
            `Creating event using the following data: ${JSON.stringify(
              req.body.data
            )}`
          );
          const event = await this.prismaService.prisma.event.create({
            data: req.body.data,
          });
          console.log(`Event created: ${JSON.stringify(event)}`);
          await this.prismaService.prisma.eventLog.create({
            data: {
              type: "create",
              eventId: event.id,
              operatorId: req.body.decodedToken.id,
              content: event,
            },
          });
          res.status(200).json({ id: event.id });
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
          let result = await this.prismaService.prisma.event.findMany({
            where: {
              OR: [
                { status: "active" },
                { status: "cancelled" },
                { status: "completed" },
                { status: "unpaid" },
              ],
            },
            select: {
              id: true,
              datetimeStart: true,
              datetimeEnd: true,
              type: true,
              name: true,
              address: true,
              status: true,
              EventLog: {
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
              Customer: {
                select: {
                  id: true,
                  address: true,
                  phone: true,
                  email: true,
                  status: true,
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
                },
              },
              EventSupply: {
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
            },
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} events send to user ${req.body.decodedToken.id}.`
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
          let result = await this.prismaService.prisma.event.findMany({
            where: {
              AND: [
                {
                  OR: [
                    { status: "active" },
                    { status: "cancelled" },
                    { status: "completed" },
                    { status: "unpaid" },
                  ],
                },
                {
                  OR: [
                    {
                      datetimeStart: {
                        gte: req.body.datetimeStart.start,
                        lte: req.body.datetimeStart.end,
                      },
                    },
                    {
                      datetimeEnd: {
                        gte: req.body.datetimeEnd.start,
                        lte: req.body.datetimeEnd.end,
                      },
                    },
                  ],
                },
              ],
            },
            select: {
              id: true,
              datetimeStart: true,
              datetimeEnd: true,
              type: true,
              name: true,
              address: true,
              status: true,
              EventLog: {
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
              Customer: {
                select: {
                  id: true,
                  address: true,
                  phone: true,
                  email: true,
                  status: true,
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
                },
              },
              EventSupply: {
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
            },
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} events send to user ${req.body.decodedToken.id}.`
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
          let result = await this.prismaService.prisma.event.findMany({
            where: {
              id: req.body.id,
            },
            select: {
              id: true,
              datetimeStart: true,
              datetimeEnd: true,
              type: true,
              name: true,
              address: true,
              status: true,
              EventLog: {
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
              Customer: {
                select: {
                  id: true,
                  address: true,
                  phone: true,
                  email: true,
                  status: true,
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
                },
              },
              EventSupply: {
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
            },
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} events send to user ${req.body.decodedToken.id}.`
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
            `Updating event ${
              req.body.id
            } using the following data: ${JSON.stringify(req.body.data)}`
          );
          let result = await this.prismaService.prisma.event.update({
            where: { id: req.body.id },
            data: req.body.data,
          });
          if (!result) return res.status(400).send();
          console.log(`Event ${req.body.id} updated.`);
          req.body.data.id = req.body.id;
          await this.prismaService.prisma.eventLog.create({
            data: {
              type: "update",
              eventId: req.body.id,
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

export default EventRouter;