import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import config from "../config";
import jwt from "jsonwebtoken";
import AppError from "../shered/AppError";
import httpStatus from "http-status";
import { error } from "console";

const authGurd = (...role: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      let decoded;
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(401, "yor are not authorise");
      }
      try {
        decoded = jwt.verify(
          token,
          config.token_secrect as string
        ) as JwtPayload;
      } catch (error) {
        throw new AppError(401, "yor are not authorise");
      }
      req.user = decoded;
      if (role.length > 0 && !role.includes(decoded?.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "yor are not authorise");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authGurd;
