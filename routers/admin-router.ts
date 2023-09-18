import { Request, Response } from "express";
import { Router } from "express";
import PrismaService from "../services/prisma-service";
import AuthenticationService from "../services/authentication-service";

class AdminRouter {
  public router: Router;
  private authService: AuthenticationService =
    AuthenticationService.getInstance();
  private prismaService: PrismaService = PrismaService.getInstance();

  private createRoute: string = "/create";
  private getRoute: string = "/get";
  private loginRoute: string = "/login";
  private searchRoute: string = "/search";
  private selectRoute: string = "/select";
  private updateRoute: string = "/update";

  constructor() {
    this.router = Router();
    this.setCreateRoute();
    this.setGetRoute();
    this.setLoginRoute();
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
            `Creating admin using the following data: ${JSON.stringify(
              req.body.data
            )}`
          );
          const admin = await this.prismaService.prisma.admin.create({
            data: req.body.data,
          });
          console.log(`Admin created: ${JSON.stringify(admin)}`);
          await this.prismaService.prisma.adminLog.create({
            data: {
              type: "create",
              adminId: admin.id,
              operatorId: req.body.decodedToken.id,
              content: admin,
            },
          });
          res.status(200).json({ id: admin.id });
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
          let result = await this.prismaService.prisma.admin.findMany({
            where: {
              OR: [{ status: "ok" }],
            },
            select: {
              id: true,
              role: true,
              status: true,
              AdminLog: {
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
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} admins sent to user ${req.body.decodedToken.id}.`
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

  private setLoginRoute = async () => {
    this.router.post(this.loginRoute, async (req: Request, res: Response) => {
      try {
        console.log(`Login as admin attempt using ${req.body.data.username}`);
        const { username, password } = req.body.data;
        const user = await this.authService.authenticateAdmin(
          username,
          password
        );
        if (!user) {
          console.log(`User ${username} login failed.`);
          res.status(401).send();
          return;
        }
        console.log(`User ${username} successfully logged in.`);
        res.status(200).json({
          accessToken: this.authService.generateAccessToken(
            user,
            process.env.TOKEN_DURATION!
          ),
          refreshToken: this.authService.generateRefreshToken(user),
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          status: "server error",
          msg: error,
        });
      }
    });
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
          let result = await this.prismaService.prisma.admin.findMany({
            where: {
              OR: [{ status: "ok" }],
            },
            select: {
              id: true,
              role: true,
              status: true,
              AdminLog: {
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
              User: {
                select: {
                  id: true,
                  username: true,
                  status: true,
                  UserInformation: {
                    where: {
                      OR: [
                        { lastname: req.body.key },
                        { firstname: req.body.key },
                        { middlename: req.body.key },
                      ],
                    },
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
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} admins sent to user ${req.body.decodedToken.id}.`
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
          let result = await this.prismaService.prisma.admin.findMany({
            where: {
              id: req.body.id,
            },
            select: {
              id: true,
              role: true,
              status: true,
              AdminLog: {
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
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} admins sent to user ${req.body.decodedToken.id}.`
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
            `Updating admin ${
              req.body.id
            } using the following data: ${JSON.stringify(req.body.data)}`
          );
          let result = await this.prismaService.prisma.admin.update({
            where: { id: req.body.id },
            data: req.body.data,
          });
          if (!result) return res.status(400).send();
          console.log(`Admin ${req.body.id} updated.`);
          req.body.data.id = req.body.id;
          await this.prismaService.prisma.adminLog.create({
            data: {
              type: "update",
              adminId: req.body.id,
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

export default AdminRouter;
