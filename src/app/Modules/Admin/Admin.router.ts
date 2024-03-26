import { NextFunction, Request, Response, Router } from "express";
import { adminControler } from "./Admin.controler";
import { AnyZodObject, z } from "zod";
import validateRequest from "../../middileware/validation";
import { adminValidationSchemas } from "./admin.validation";

const router = Router();




router.get("/", adminControler.retiveAdmin);
router.get("/:id", adminControler.getAdminById);
router.patch(
  "/:id",
  validateRequest(adminValidationSchemas.update),
  adminControler.updateData
);
router.delete("/:id", adminControler.deleterAdmin);
router.delete("/soft/:id", adminControler.softDeleteDb);

export const adminRouter = router;
