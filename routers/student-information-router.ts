import { Request, Response } from "express";
import { Router } from "express";
import PrismaService from "../services/prisma-service";
import AuthenticationService from "../services/authentication-service";

class StudentInformationRouter {
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
      [this.authService.verifyToken, this.authService.verifyUser],
      async (req: Request, res: Response) => {
        try {
          console.log(
            `Creating student information using the following data: ${JSON.stringify(
              req.body
            )}`
          );
          const studentInformation =
            await this.prismaService.prisma.studentInformation.create({
              data: req.body.data,
            });
          console.log(
            `Student information created: ${JSON.stringify(studentInformation)}`
          );
          await this.prismaService.prisma.studentInformationLog.create({
            data: {
              type: "create",
              studentInformationId: studentInformation.id,
              operatorId: req.body.decodedToken.id,
              content: studentInformation,
            },
          });
          res.status(200).json({ id: studentInformation.id });
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
            `Updating student information ${
              req.body.id
            } using the following data: ${JSON.stringify(req.body.data)}`
          );
          let result =
            await this.prismaService.prisma.studentInformation.update({
              where: { id: req.body.id },
              data: req.body.data,
            });
          if (!result) return res.status(400).send();
          console.log(`Student ${req.body.id} updated.`);
          req.body.data.id = req.body.id;
          await this.prismaService.prisma.studentInformationLog.create({
            data: {
              type: "update",
              studentInformationId: req.body.id,
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

export default StudentInformationRouter;
