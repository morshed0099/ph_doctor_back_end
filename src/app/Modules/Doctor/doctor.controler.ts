import { Request, Response } from "express";
import catchAsync from "../../middileware/catchAsync";
import httpStatus from "http-status";
import { doctorServie } from "./doctor.service";
import pick from "../../shered/pick";

const getDoctor = catchAsync(async (req: Request, res: Response) => {
  const filter = await pick(req.query, ["name", "email", "search"]);
  const options = await pick(req.query, ["page", "limit", "sortBy", "orderBy"]);
  const result = await doctorServie.getDoctor(filter, options);
  res.status(httpStatus.OK).json({
    success: true,
    message: "doctor all data retive successfully !!",
    meta: result.meta,
    data: result.data,
  });
});

const doctorById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await doctorServie.getDoctorById(id);
  res.status(httpStatus.OK).json({
    success: true,
    message: "doctor retive successfully !!",
    data: result,
  });
});

export const doctorControler = {
  getDoctor,
  doctorById,
};
