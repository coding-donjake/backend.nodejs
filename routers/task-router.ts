import { Request, Response } from "express";
import { Router } from "express";
import PrismaService from "../services/prisma-service";
import AuthenticationService from "../services/authentication-service";

class TaskRouter {
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
    datetimeDeadline: true,
    name: true,
    status: true,
    TaskLog: {
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
    TaskAssignee: {
      where: {
        status: "ok",
      },
      select: {
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
            `Creating task using the following data: ${JSON.stringify(
              req.body.data
            )}`
          );
          const task = await this.prismaService.prisma.task.create({
            data: req.body.data,
          });
          console.log(`Task created: ${JSON.stringify(task)}`);
          await this.prismaService.prisma.taskLog.create({
            data: {
              type: "create",
              taskId: task.id,
              operatorId: req.body.decodedToken.id,
              content: task,
            },
          });
          res.status(200).json({ id: task.id });
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
          let result = await this.prismaService.prisma.task.findMany({
            where: {
              OR: [
                { status: "active" },
                { status: "completed" },
                { status: "onhold" },
              ],
            },
            select: this.selectTemplate,
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} tasks sent to user ${req.body.decodedToken.id}.`
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
          let result = await this.prismaService.prisma.task.findMany({
            where: {
              AND: [
                {
                  OR: [
                    { status: "active" },
                    { status: "completed" },
                    { status: "onhold" },
                  ],
                },
                {
                  OR: [
                    {
                      datetimeDeadline: {
                        gte: req.body.datetimeDeadline.start,
                        lte: req.body.datetimeDeadline.end,
                      },
                    },
                    {
                      name: req.body.key,
                    },
                  ],
                },
              ],
            },
            select: this.selectTemplate,
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} tasks sent to user ${req.body.decodedToken.id}.`
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
          let result = await this.prismaService.prisma.task.findFirst({
            where: {
              id: req.body.id,
            },
            select: this.selectTemplate,
          });
          if (!result) return res.status(400).send();
          console.log(
            `task record has been sent to user ${req.body.decodedToken.id}.`
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
            `Updating task ${
              req.body.id
            } using the following data: ${JSON.stringify(req.body.data)}`
          );
          let result = await this.prismaService.prisma.task.update({
            where: { id: req.body.id },
            data: req.body.data,
          });
          if (!result) return res.status(400).send();
          console.log(`Task ${req.body.id} updated.`);
          req.body.data.id = req.body.id;
          await this.prismaService.prisma.taskLog.create({
            data: {
              type: "update",
              taskId: req.body.id,
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

export default TaskRouter;
