import { Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../middileware/catchAsync";
import httpStatus from "http-status";
import pick from "../../shered/pick";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createAdmin(req);
  res.status(201).json({
    success: true,
    message: "admin created successfully !",
    data: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createDoctor(req);
  res.status(201).json({
    success: true,
    message: "doctor created successfully !",
    data: result,
  });
});
const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.ceatePatient(req);
  res.status(201).json({
    success: true,
    message: "patient created successfully !",
    data: result,
  });
});

const getAllUserFromDb = catchAsync(async (req: Request, res: Response) => {
  const filter = await pick(req.query, ["email", "role", "status", "search"]);
  const option = await pick(req.query, ["page", "skip", "sortOrder", "sortBy"]);
  const result = await userService.getAlluserFromDb(filter, option);
  res.status(httpStatus.OK).json({
    success: true,
    message: "all user retive successfully !!",
    data: result.data,
    meta: result.meta,
  });
});

export const userControler = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUserFromDb,
};
