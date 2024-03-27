import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || "something went wrong",
    error: err,
  });
};

export default globalError;
