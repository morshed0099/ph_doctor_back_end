import { Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../middileware/catchAsync";
import httpStatus from "http-status";
import pick from "../../shered/pick";
import prisma from "../../shered/prisma";

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
  console.log(filter);
  const option = await pick(req.query, ["page", "skip", "sortOrder", "sortBy"]);
  const result = await userService.getAlluserFromDb(filter, option);
  res.status(httpStatus.OK).json({
    success: true,
    message: "user retive successfully !!",
    data: result.data,
    meta: result.meta,
  });
});

const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const status = req.body;
  const result = await userService.updateStatus(id, status);
  res.status(httpStatus.OK).json({
    success: true,
    message: "user status updated successfully !!!",
    data: result,
  });
});

const getProfile = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await userService.getProfile(user);
    res.status(httpStatus.OK).json({
      success: true,
      message: "user profile retive successfully !!",
      data: user,
    });
  }
);

const updateMyProfile = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req?.user;
    const data = req;
    const result = await userService.updateMyProfifle(user, data);

    res.status(httpStatus.OK).json({
      success: true,
      message: "profile updated successfully!!",
      data: result,
    });
  }
);

export const userControler = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUserFromDb,
  updateStatus,
  getProfile,
  updateMyProfile,
};
