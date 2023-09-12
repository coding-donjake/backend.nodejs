import { Request, Response } from "express";
import { Router } from "express";
import AuthenticationService from "../services/authentication-service";
import PrismaService from "../services/prisma-service";

class BorrowingRouter {
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
            `Creating borrowing using the following data: ${JSON.stringify(
              req.body.data
            )}`
          );
          const borrowing = await this.prismaService.prisma.borrowing.create({
            data: req.body.data,
          });
          console.log(`Borrowing created: ${JSON.stringify(borrowing)}`);
          await this.prismaService.prisma.borrowingLog.create({
            data: {
              type: "create",
              borrowingId: borrowing.id,
              operatorId: req.body.decodedToken.id,
              content: borrowing,
            },
          });
          res.status(200).json({ id: borrowing.id });
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
    this.router.get(
      this.getRoute,
      [
        this.authService.verifyToken,
        this.authService.verifyUser,
        this.authService.verifyAdmin,
      ],
      async (req: Request, res: Response) => {
        try {
          let result = await this.prismaService.prisma.borrowing.findMany({
            where: {
              OR: [{ status: "pending" }, { status: "borrowed" }],
            },
            select: {
              id: true,
              datetimeBorrowed: true,
              datetimeReturned: true,
              remarksBorrowed: true,
              remarksReturned: true,
              status: true,
              BorrowingLog: {
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
              Asset: {
                select: {
                  id: true,
                  name: true,
                  brand: true,
                  type: true,
                  status: true,
                },
              },
              User: {
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
                      userId: true,
                    },
                  },
                },
              },
            },
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} users send to user ${req.body.decodedToken.id}.`
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
    this.router.get(
      this.searchRoute,
      [
        this.authService.verifyToken,
        this.authService.verifyUser,
        this.authService.verifyAdmin,
      ],
      async (req: Request, res: Response) => {
        try {
          let result = await this.prismaService.prisma.borrowing.findMany({
            where: {
              AND: [
                { OR: [{ status: "pending" }, { status: "borrowed" }] },
                {
                  datetimeBorrowed: {
                    gte: req.body.start,
                    lte: req.body.end,
                  },
                },
              ],
            },
            select: {
              id: true,
              datetimeBorrowed: true,
              datetimeReturned: true,
              remarksBorrowed: true,
              remarksReturned: true,
              status: true,
              BorrowingLog: {
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
              Asset: {
                select: {
                  id: true,
                  name: true,
                  brand: true,
                  type: true,
                  status: true,
                },
              },
              User: {
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
                      userId: true,
                    },
                  },
                },
              },
            },
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} users send to user ${req.body.decodedToken.id}.`
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
    this.router.get(
      this.getRoute,
      [
        this.authService.verifyToken,
        this.authService.verifyUser,
        this.authService.verifyAdmin,
      ],
      async (req: Request, res: Response) => {
        try {
          let result = await this.prismaService.prisma.borrowing.findMany({
            where: {
              id: req.body.id,
            },
            select: {
              id: true,
              datetimeBorrowed: true,
              datetimeReturned: true,
              remarksBorrowed: true,
              remarksReturned: true,
              status: true,
              BorrowingLog: {
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
              Asset: {
                select: {
                  id: true,
                  name: true,
                  brand: true,
                  type: true,
                  status: true,
                },
              },
              User: {
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
                      userId: true,
                    },
                  },
                },
              },
            },
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} users send to user ${req.body.decodedToken.id}.`
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
            `Updating borrowing ${
              req.body.id
            } using the following data: ${JSON.stringify(req.body.data)}`
          );
          let result = await this.prismaService.prisma.borrowing.update({
            where: { id: req.body.id },
            data: req.body.data,
          });
          if (!result) return res.status(400).send();
          console.log(`Borrowing ${req.body.id} updated.`);
          req.body.data.id = req.body.id;
          await this.prismaService.prisma.borrowingLog.create({
            data: {
              type: "update",
              borrowingId: req.body.id,
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

export default BorrowingRouter;
