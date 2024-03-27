import httpStatus from "http-status";
import catchAsync from "../../middileware/catchAsync";
import responseSend from "../../shered/sendResponse";
import { authService } from "./auth.service";
import { Request, Response } from "express";

const login = catchAsync(async (req, res) => {
  const credential = req.body;
  const result = await authService.login(credential);
  const { refeshToken } = result;
  res.cookie("refeshToken", refeshToken, {
    secure: false,
    httpOnly: true,
  });
  responseSend(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "login successfully ",
    data: {
      token: result.token,
      needPasswordChange: result.needPasswordChange,
    },
  });
});

const refeshToken = catchAsync(async (req, res) => {
  const { refeshToken } = req.cookies;
  const result = await authService.refeshToken(refeshToken);
  responseSend(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "token created successfull",
    data: result,
  });
});

const changePasswrod = catchAsync(
  async (req: Request & { user?: any }, res) => {
    const result = await authService.changePassword(req.body, req.user);
    responseSend(res, {
      statusCode: httpStatus.OK,
      message: "password change successfully",
      data: result,
      success: true,
    });
  }
);

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const email = req.body;
  const result = await authService.forgotPassword(email);
  responseSend(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "forget password set successfully",
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization as string;
  const result = await authService.resetPassword(token, req.body);
  responseSend(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "password reset successfully",
    data: null,
  });
});

export const authControler = {
  login,
  refeshToken,
  changePasswrod,
  forgotPassword,
  resetPassword,
};
