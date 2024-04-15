import { NextFunction, Request, Response, Router } from "express";
import { userControler } from "./user.controler";
import { UserRoll } from "@prisma/client";
import authGurd from "../../middileware/auth";
import { fileUploader } from "../../../helpers/fileUploader";
import { validationUser } from "./user.validation";

const router = Router();

router.post(
  "/create-admin",
  authGurd(UserRoll.ADMIN, UserRoll.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = validationUser.createUserValidation.parse(
      JSON.parse(req.body.data)
    );
    return userControler.createAdmin(req, res, next);
  }
);
router.post(
  "/create-doctor",
  authGurd(UserRoll.ADMIN, UserRoll.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = validationUser.createDoctorVlidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return userControler.createDoctor(req, res, next);
  }
);
router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = validationUser.createPatientValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return userControler.createPatient(req, res, next);
  }
);

export const userRouter = router;
