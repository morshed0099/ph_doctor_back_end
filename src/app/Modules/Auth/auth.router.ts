import { Router } from "express";
import { authControler } from "./auth.controler";

const router = Router();

router.post("/login", authControler.login);
router.post("/refesh-token", authControler.refeshToken);

export const authRouter = router;
