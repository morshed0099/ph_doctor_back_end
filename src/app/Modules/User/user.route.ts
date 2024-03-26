import { NextFunction, Request, Response, Router } from "express";
import { userControler } from "./user.controler";
import { UserRoll } from "@prisma/client";
import authGurd from "../../middileware/auth";

const router = Router();

router.post(
  "/",
  authGurd(UserRoll.ADMIN, UserRoll.SUPER_ADMIN),
  userControler.createAdmin
);

export const userRouter = router;
