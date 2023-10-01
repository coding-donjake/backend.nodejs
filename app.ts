import * as dotenv from "dotenv";
import express from "express";
import UserRouter from "./routers/user-router";
import UserInformationRouter from "./routers/user-information-router";
import AdminRouter from "./routers/admin-router";

class App {
  static instance: App;
  private express = express();

  private adminRoute: string = "/admin";
  private userRoute: string = "/user";
  private userInformationRoute: string = "/user-information";

  private adminRouter: AdminRouter;
  private userRouter: UserRouter;
  private userInformationRouter: UserInformationRouter;

  private constructor() {
    this.express.use(express.json());

    this.adminRouter = new AdminRouter();
    this.express.use(this.adminRoute, this.adminRouter.router);

    this.userRouter = new UserRouter();
    this.express.use(this.userRoute, this.userRouter.router);

    this.userInformationRouter = new UserInformationRouter();
    this.express.use(
      this.userInformationRoute,
      this.userInformationRouter.router
    );

    this.express.listen(process.env.PORT);
    console.log(`Running in port ${process.env.PORT}.`);
  }

  static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
      console.log("New app instance has been created.");
    }
    return App.instance;
  }
}

dotenv.config();
const app = App.getInstance();

export default app;
