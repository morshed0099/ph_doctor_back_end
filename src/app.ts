import express, { Application, Request, Response } from "express";
import cors from "cors";
import { userRouter } from "./app/Modules/User/user.route";
import { adminRouter } from "./app/Modules/Admin/Admin.router";
import router from "./app/router";
import globalError from "./app/middileware/globalError";
import notFound from "./app/middileware/notFound";
import cookieParser from "cookie-parser";

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    message: "server is running",
  });
});

app.use("/api/v1/", router);
app.use(globalError);
app.use(notFound);

export default app;
