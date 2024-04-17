import { NextFunction, Request, Response, Router } from "express";
import { specialtiesControler } from "./specialties.controler";
import authGurd from "../../middileware/auth";
import { UserRoll } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import { specialitesValidation } from "./specialties.validation";

const router = Router();
router.get("/", specialtiesControler.getAllSpecialtiels);

router.post(
  "/create-specialties",
  authGurd(UserRoll.DOCTOR, UserRoll.ADMIN, UserRoll.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = specialitesValidation.createSpecialtiesValidation.parse(
      JSON.parse(req.body.data)
    );
    return specialtiesControler.createSpecialties(req, res, next);
  }
);

router.delete("/:id", specialtiesControler.deleteSpecialties);

export const specialtiesRouter = router;
