import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";

const notFound = (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: `${req.originalUrl} API NOT FOUND !!`,
  });
};

export default notFound;
