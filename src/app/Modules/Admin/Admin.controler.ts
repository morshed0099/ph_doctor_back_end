import { NextFunction, Request, RequestHandler, Response } from "express";
import { adminService } from "./Admin.service";
import pick from "../../shered/pick";
import responseSend from "../../shered/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../middileware/catchAsync";

const retiveAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filter = await pick(req.query, ["email", "name", "search"]);
    const option = await pick(req.query, [
      "page",
      "limit",
      "sortBy",
      "sortOrder",
    ]);
    console.log(option);
    const result = await adminService.admicRetive(filter, option);
    responseSend(res, {
      success: true,
      message: "admin retive successfully ",
      statusCode: httpStatus.OK,
      data: result.data,
      meta: result.meta,
    });
  }
);

const getAdminById: RequestHandler = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const result = await adminService.getAdminById(id);
  responseSend(res, {
    success: true,
    message: "all admin data retive",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const updateData: RequestHandler = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  const result = await adminService.updateData(id, data);
  responseSend(res, {
    success: true,
    message: "admin  data updated successfully !!",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const deleterAdmin: RequestHandler = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  const result = await adminService.deleteData(id);
  responseSend(res, {
    success: true,
    message: "admin  data deleted successfully !!",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const softDeleteDb: RequestHandler = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  const result = await adminService.softDeleteDb(id);
  responseSend(res, {
    success: true,
    message: "admin  data deleted successfully !!",
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const adminControler = {
  retiveAdmin,
  getAdminById,
  updateData,
  deleterAdmin,
  softDeleteDb,
};
