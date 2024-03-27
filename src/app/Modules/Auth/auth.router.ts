import { Router } from "express";
import { authControler } from "./auth.controler";
import authGurd from "../../middileware/auth";
import { UserRoll } from "@prisma/client";

const router = Router();

router.post("/login", authControler.login);
router.post("/refesh-token", authControler.refeshToken);
router.post(
  "/change-password",
  authGurd(
    UserRoll.ADMIN,
    UserRoll.DOCTOR,
    UserRoll.PATIENT,
    UserRoll.SUPER_ADMIN
  ),
  authControler.changePasswrod
);
router.post("/forgot-pass", authControler.forgotPassword);
router.post("/reset-pass", authControler.resetPassword);
export const authRouter = router;
