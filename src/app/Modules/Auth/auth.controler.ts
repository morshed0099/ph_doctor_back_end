import httpStatus from "http-status";
import catchAsync from "../../middileware/catchAsync";
import responseSend from "../../shered/sendResponse";
import { authService } from "./auth.service";

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

export const authControler = {
  login,
  refeshToken,
};
