import { Request, Response } from "express";
import { Router } from "express";
import PrismaService from "../services/prisma-service";
import AuthenticationService from "../services/authentication-service";

class BorrowingRouter {
  public router: Router;
  private authService: AuthenticationService =
    AuthenticationService.getInstance();
  private prismaService: PrismaService = PrismaService.getInstance();

  private activeRoute: string = "/active";
  private createRoute: string = "/create";
  private getRoute: string = "/get";
  private pendingRoute: string = "/pending";
  private searchRoute: string = "/search";
  private selectRoute: string = "/select";
  private updateRoute: string = "/update";
  private userActiveRoute: string = "/user-active";
  private userPendingRoute: string = "/user-pending";

  private selectTemplate: object = {
    id: true,
    datetimeBorrowed: true,
    datetimeReturned: true,
    remarksBorrowed: true,
    remarksReturned: true,
    duration: true,
    status: true,
    BorrowingLog: {
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
    Asset: {
      select: {
        id: true,
        name: true,
        brand: true,
        type: true,
        serialCode: true,
        status: true,
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
    this.setActiveRoute();
    this.setCreateRoute();
    this.setGetRoute();
    this.setPendingRoute();
    this.setSearchRoute();
    this.setSelectRoute();
    this.setUpdateRoute();
    this.setUserActiveRoute();
    this.setUserPendingRoute();
  }

  private setActiveRoute = async () => {
    this.router.post(
      this.activeRoute,
      [this.authService.verifyToken, this.authService.verifyUser],
      async (req: Request, res: Response) => {
        try {
          let result = await this.prismaService.prisma.borrowing.findMany({
            where: {
              OR: [{ status: "active" }, { User: { id: req.body.key } }],
            },
            orderBy: [
              {
                datetimeBorrowed: "asc",
              },
            ],
            select: this.selectTemplate,
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} borrowing sent to user ${req.body.decodedToken.id}.`
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

  private setCreateRoute = async () => {
    this.router.post(
      this.createRoute,
      [this.authService.verifyToken, this.authService.verifyUser],
      async (req: Request, res: Response) => {
        try {
          req.body.data.userId = req.body.decodedToken.id;
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
    this.router.post(
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
              OR: [
                { status: "pending" },
                { status: "active" },
                { status: "completed" },
                { status: "declined" },
              ],
            },
            orderBy: [
              {
                datetimeBorrowed: "asc",
              },
            ],
            select: this.selectTemplate,
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} borrowing sent to user ${req.body.decodedToken.id}.`
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

  private setPendingRoute = async () => {
    this.router.post(
      this.pendingRoute,
      [this.authService.verifyToken, this.authService.verifyUser],
      async (req: Request, res: Response) => {
        try {
          let result = await this.prismaService.prisma.borrowing.findMany({
            where: {
              OR: [{ status: "pending" }, { User: { id: req.body.key } }],
            },
            orderBy: [
              {
                datetimeBorrowed: "asc",
              },
            ],
            select: this.selectTemplate,
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} borrowing sent to user ${req.body.decodedToken.id}.`
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
          let result = await this.prismaService.prisma.borrowing.findMany({
            where: {
              AND: [
                {
                  OR: [
                    { status: "pending" },
                    { status: "active" },
                    { status: "completed" },
                    { status: "declined" },
                  ],
                },
                {
                  OR: [
                    {
                      datetimeBorrowed: {
                        gte: req.body.datetimeBorrowed.start,
                        lte: req.body.datetimeBorrowed.end,
                      },
                    },
                    {
                      datetimeReturned: {
                        gte: req.body.datetimeReturned.start,
                        lte: req.body.datetimeReturned.end,
                      },
                    },
                  ],
                },
              ],
            },
            orderBy: [
              {
                datetimeBorrowed: "asc",
              },
            ],
            select: this.selectTemplate,
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} borrowing sent to user ${req.body.decodedToken.id}.`
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
          let result = await this.prismaService.prisma.borrowing.findFirst({
            where: {
              id: req.body.id,
            },
            select: this.selectTemplate,
          });
          if (!result) return res.status(400).send();
          console.log(
            `borrowing record has been sent to user ${req.body.decodedToken.id}.`
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

  private setUserActiveRoute = async () => {
    this.router.post(
      this.userActiveRoute,
      [this.authService.verifyToken, this.authService.verifyUser],
      async (req: Request, res: Response) => {
        try {
          let result = await this.prismaService.prisma.borrowing.findMany({
            where: {
              AND: [{ status: "active" }, { userId: req.body.decodedToken.id }],
            },
            orderBy: [
              {
                datetimeBorrowed: "asc",
              },
            ],
            select: this.selectTemplate,
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} borrowing sent to user ${req.body.decodedToken.id}.`
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

  private setUserPendingRoute = async () => {
    this.router.post(
      this.userPendingRoute,
      [this.authService.verifyToken, this.authService.verifyUser],
      async (req: Request, res: Response) => {
        try {
          let result = await this.prismaService.prisma.borrowing.findMany({
            where: {
              AND: [
                { status: "pending" },
                { userId: req.body.decodedToken.id },
              ],
            },
            orderBy: [
              {
                datetimeBorrowed: "asc",
              },
            ],
            select: this.selectTemplate,
          });
          if (!result) return res.status(400).send();
          console.log(
            `${result.length} borrowing sent to user ${req.body.decodedToken.id}.`
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
}

export default BorrowingRouter;
