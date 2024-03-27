import prisma from "../../shered/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import genarateTokent from "../../../helpers/genarateToken";
import { UserStatus } from "@prisma/client";
import config from "../../config";
import AppError from "../../shered/AppError";
import httpStatus from "http-status";
import nodeMailerEmail from "./sendNodeMail";

const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  const matchPass = await bcrypt.compare(payload.password, user.password);
  if (!matchPass) {
    throw new Error("your credential is not correct !!");
  }
  // token
  const tokenPayload = { email: user.email, role: user.role };
  const accessToken = genarateTokent(
    tokenPayload,
    config.token_secrect as string,
    config.token_exprie as string
  );
  const refeshToken = genarateTokent(
    tokenPayload,
    config.refesh_secret as string,
    config.refesh_exprie as string
  );

  return {
    token: accessToken,
    refeshToken,
    needPasswordChange: user.needPasswrodChange,
  };
};

const refeshToken = async (token: string) => {
  let decoded;
  try {
    decoded = jwt.verify(token, config.refesh_secret as string) as JwtPayload;
  } catch (error) {
    throw new Error("Your are not authorised !!");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      status: UserStatus.ACTIVE,
      email: decoded?.email,
    },
  });
  if (!user) {
    throw new Error("Your are not authorised !!");
  }
  const tokenPayload = { email: user.email, role: user.role };
  const accessToken = genarateTokent(
    tokenPayload,
    config.token_secrect as string,
    config.token_exprie as string
  );
  return {
    accessToken,
    needPasswordChange: user.needPasswrodChange,
  };
};

const changePassword = async (payload: any, user: any) => {
  const activeUser = await prisma.user.findUniqueOrThrow({
    where: {
      status: UserStatus.ACTIVE,
      email: user.email,
    },
  });
  const comparePassword = await bcrypt.compare(
    payload.oldPassword,
    activeUser.password
  );
  if (!comparePassword) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "your old passwrod is not correct"
    );
  }
  const hasPassword = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: activeUser.email,
    },
    data: {
      password: hasPassword,
      needPasswrodChange: false,
    },
  });

  return {
    message: "password change successfully",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  const resetToken = genarateTokent(
    { email: user.email, role: user.role },
    config.reset_pass_token_secrect as string,
    config.reset_pass_token_exprie_in as string
  );

  const resetLink = `${config.lolaclhost_link}/reset-pass?userId=${user.id}&token=${resetToken}`;
  console.log(resetLink);
  await nodeMailerEmail(
    user.email,
    `
    <div>
      <P>Dear ${user.email}</P>
      <p>Your password reset Link below </p>
      <a href=${resetLink}>Rest Password</a>
    </div>
    `
  );
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const compareToken = jwt.verify(
    token,
    config.reset_pass_token_secrect as string
  );

  const hassPasswod = await bcrypt.hash(payload.password, 12);
  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password: hassPasswod,
    },
  });
  return {
    message: "password reset successfully !!",
  };
};

export const authService = {
  login,
  refeshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
