import { Router } from "express";
import { adminRouter } from "../Modules/Admin/Admin.router";
import {userRouter } from "../Modules/User/user.route";
import { authRouter } from "../Modules/Auth/auth.router";

const router = Router();

const moduleRoute = [
  {
    path: "/admin",
    route: adminRouter,
  },
  {
    path: "/users",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
];

moduleRoute.forEach((ele) => router.use(ele.path, ele.route));

export default router;
