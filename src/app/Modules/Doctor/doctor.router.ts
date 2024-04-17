import { Router } from "express";
import { doctorControler } from "./doctor.controler";

const router = Router();

router.get("/", doctorControler.getDoctor);
router.get("/:id", doctorControler.doctorById);

export const doctorRouter = router;
