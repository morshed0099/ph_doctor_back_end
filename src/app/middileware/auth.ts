import { NextFunction,Request,Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import config from "../config";
import jwt from 'jsonwebtoken';

const authGurd = (...role: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    let decoded;
    if (!token) {
      throw new Error("you are not authorized");
    }
    try {
      decoded = jwt.verify(token, config.token_secrect as string) as JwtPayload;
    } catch (error) {
      next(error);
    }
    if (role.length > 0 && !role.includes(decoded?.role)) {
      throw new Error("you are not authorize");
    }
    next();
  };
};

export default authGurd;
