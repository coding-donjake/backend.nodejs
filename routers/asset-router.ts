import { Request, Response } from "express";
import { Router } from "express";
import PrismaService from "../services/prisma-service";
import AuthenticationService from "../services/authentication-service";

class AssetRouter {
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
            `Creating asset using the following data: ${JSON.stringify(
              req.body.data
            )}`
          );
          const asset = await this.prismaService.prisma.asset.create({
            data: req.body.data,
          });
          console.log(`Asset created: ${JSON.stringify(asset)}`);
          await this.prismaService.prisma.assetLog.create({
            data: {
              type: "create",
              assetId: asset.id,
              operatorId: req.body.decodedToken.id,
              content: asset,
            },
          });
          res.status(200).json({ id: asset.id });
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
          let result = await this.prismaService.prisma.asset.findMany({
            where: {
              OR: [{ status: "good" }, { status: "broken" }],
            },
            select: {
              id: true,
              name: true,
              brand: true,
              type: true,
              status: true,
              AssetLog: {
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
            },
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} assets send to user ${req.body.decodedToken.id}.`
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
          let result = await this.prismaService.prisma.asset.findMany({
            where: {
              AND: [
                { OR: [{ status: "good" }, { status: "broken" }] },
                {
                  OR: [
                    { name: req.body.key },
                    { brand: req.body.key },
                    { type: req.body.key },
                  ],
                },
              ],
            },
            select: {
              id: true,
              name: true,
              brand: true,
              type: true,
              status: true,
              AssetLog: {
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
            },
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} assets send to user ${req.body.decodedToken.id}.`
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
          let result = await this.prismaService.prisma.asset.findMany({
            where: {
              id: req.body.id,
            },
            select: {
              id: true,
              name: true,
              brand: true,
              type: true,
              status: true,
              AssetLog: {
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
            },
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} assets send to user ${req.body.decodedToken.id}.`
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
            `Updating asset ${
              req.body.id
            } using the following data: ${JSON.stringify(req.body.data)}`
          );
          let result = await this.prismaService.prisma.asset.update({
            where: { id: req.body.id },
            data: req.body.data,
          });
          if (!result) return res.status(400).send();
          console.log(`Asset ${req.body.id} updated.`);
          req.body.data.id = req.body.id;
          await this.prismaService.prisma.assetLog.create({
            data: {
              type: "update",
              assetId: req.body.id,
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

export default AssetRouter;
