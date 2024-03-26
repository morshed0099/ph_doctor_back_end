import prisma from "../../shered/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import genarateTokent from "../../../helpers/genarateToken";
import { UserStatus } from "@prisma/client";
import config from "../../config";

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

export const authService = {
  login,
  refeshToken,
};
