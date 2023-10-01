import { Request, Response } from "express";
import { Router } from "express";
import PrismaService from "../services/prisma-service";
import AuthenticationService from "../services/authentication-service";

class ApplicationRouter {
  public router: Router;
  private authService: AuthenticationService =
    AuthenticationService.getInstance();
  private prismaService: PrismaService = PrismaService.getInstance();

  private createRoute: string = "/create";
  private getRoute: string = "/get";
  private searchRoute: string = "/search";
  private selectRoute: string = "/select";
  private updateRoute: string = "/update";

  private select: object = {
    id: true,
    datetimeApplied: true,
    datetimeAccepted: true,
    datetimeDeclined: true,
    pitch: true,
    status: true,
    ApplicationLog: {
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
    Resume: {
      id: true,
      fileName: true,
      storageName: true,
      status: true,
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
        StudentInformation: {
          select: {
            id: true,
            schoolId: true,
            course: true,
            year: true,
            section: true,
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
            `Creating application using the following data: ${JSON.stringify(
              req.body.data
            )}`
          );
          const application =
            await this.prismaService.prisma.application.create({
              data: req.body.data,
            });
          console.log(`Application created: ${JSON.stringify(application)}`);
          await this.prismaService.prisma.applicationLog.create({
            data: {
              type: "create",
              applicationId: application.id,
              operatorId: req.body.decodedToken.id,
              content: application,
            },
          });
          res.status(200).json({ id: application.id });
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
          let result = await this.prismaService.prisma.application.findMany({
            where: {
              OR: [{ status: "ok" }],
            },
            select: this.select,
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} applications sent to user ${req.body.decodedToken.id}.`
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
          let result = await this.prismaService.prisma.application.findMany({
            where: {
              AND: [
                {
                  OR: [
                    { status: "ok" },
                    { status: "accepted" },
                    { status: "declined" },
                    { status: "cancelled" },
                  ],
                },
                {
                  OR: [
                    {
                      datetimeApplied: {
                        gte: req.body.datetimeApplied.start,
                        lte: req.body.datetimeApplied.end,
                      },
                    },
                    {
                      datetimeAccepted: {
                        gte: req.body.datetimeAccepted.start,
                        lte: req.body.datetimeAccepted.end,
                      },
                    },
                    {
                      datetimeDeclined: {
                        gte: req.body.datetimeDeclined.start,
                        lte: req.body.datetimeDeclined.end,
                      },
                    },
                    {
                      User: {
                        username: req.body.key,
                      },
                    },
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
            select: this.select,
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} applications sent to user ${req.body.decodedToken.id}.`
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
          let result = await this.prismaService.prisma.application.findFirst({
            where: {
              id: req.body.id,
            },
            select: this.select,
          });
          if (!result) return res.status(400).send();
          console.log(
            `application record has been sent to user ${req.body.decodedToken.id}.`
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
            `Updating application ${
              req.body.id
            } using the following data: ${JSON.stringify(req.body.data)}`
          );
          let result = await this.prismaService.prisma.application.update({
            where: { id: req.body.id },
            data: req.body.data,
          });
          if (!result) return res.status(400).send();
          console.log(`Application ${req.body.id} updated.`);
          req.body.data.id = req.body.id;
          await this.prismaService.prisma.applicationLog.create({
            data: {
              type: "update",
              applicationId: req.body.id,
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

export default ApplicationRouter;
