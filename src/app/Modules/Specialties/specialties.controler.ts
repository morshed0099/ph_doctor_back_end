import { Request, Response } from "express";
import catchAsync from "../../middileware/catchAsync";
import httpStatus from "http-status";
import { specialtiesService } from "./specialties.service";

const createSpecialties = catchAsync(async (req: Request, res: Response) => {
  const data = req;
  const result = await specialtiesService.createSpecialties(data);
  res.status(httpStatus.OK).json({
    success: true,
    message: "doctor specialties crated successfully !!",
    data: result,
  });
});

const getAllSpecialtiels = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtiesService.getSpecialties();
  res.status(httpStatus.OK).json({
    success: true,
    message: "all specialties data retive successfully !!",
    data: result,
  });
});

const deleteSpecialties = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await specialtiesService.deleteSpecialties(id);
  res.status(httpStatus.OK).json({
    success: true,
    message: "specialties deleted successfully !!!",
    data: null,
  });
});

export const specialtiesControler = {
  createSpecialties,
  getAllSpecialtiels,
  deleteSpecialties,
};
