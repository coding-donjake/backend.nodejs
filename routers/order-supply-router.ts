import { Request, Response } from "express";
import { Router } from "express";
import PrismaService from "../services/prisma-service";
import AuthenticationService from "../services/authentication-service";

class OrderSupplyRouter {
  public router: Router;
  private authService: AuthenticationService =
    AuthenticationService.getInstance();
  private prismaService: PrismaService = PrismaService.getInstance();

  private createRoute: string = "/create";
  private updateRoute: string = "/update";

  constructor() {
    this.router = Router();
    this.setCreateRoute();
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
            `Creating order supply using the following data: ${JSON.stringify(
              req.body
            )}`
          );
          const orderSupply =
            await this.prismaService.prisma.orderSupply.create({
              data: req.body.data,
            });
          console.log(
            `User information created: ${JSON.stringify(orderSupply)}`
          );
          await this.prismaService.prisma.orderSupplyLog.create({
            data: {
              type: "create",
              orderSupplyId: orderSupply.id,
              operatorId: req.body.decodedToken.id,
              content: orderSupply,
            },
          });
          res.status(200).json({ id: orderSupply.id });
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
            `Updating order supply ${
              req.body.id
            } using the following data: ${JSON.stringify(req.body.data)}`
          );
          let result = await this.prismaService.prisma.orderSupply.update({
            where: { id: req.body.id },
            data: req.body.data,
          });
          if (!result) return res.status(400).send();
          console.log(`User ${req.body.id} updated.`);
          req.body.data.id = req.body.id;
          await this.prismaService.prisma.orderSupplyLog.create({
            data: {
              type: "update",
              orderSupplyId: req.body.id,
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

export default OrderSupplyRouter;
