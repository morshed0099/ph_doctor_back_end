import { Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../middileware/catchAsync";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createAdmin(req);
  res.status(201).json({
    success: true,
    message: "admin created successfully !",
    meta: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createDoctor(req);
  res.status(201).json({
    success: true,
    message: "admin created successfully !",
    meta: result,
  });
});

export const userControler = {
  createAdmin,
  createDoctor
};
