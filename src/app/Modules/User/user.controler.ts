import { Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../middileware/catchAsync";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const adminInfo = req.body;
  const result = await userService.createAdmin(adminInfo);
  res.status(201).json({
    success: true,
    message: "admin created successfully !",
    meta: result,
  });
});

export const userControler = {
  createAdmin,
};
