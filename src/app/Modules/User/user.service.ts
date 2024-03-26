import {  UserRoll } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../shered/prisma";


const createAdmin = async (payload: any) => {
  const hasPass = await bcrypt.hash(payload.password, 12);
  const userData = {
    email: payload.admin.email as string,
    name: payload.admin.name as string,
    password: hasPass,
    role: UserRoll.ADMIN,
  };

  const result = await prisma.$transaction(async (transaction) => {
    const createUser = await transaction.user.create({
      data: userData,
    });
    const createAdmin = await transaction.admin.create({
      data: payload.admin,
    });
    return createAdmin;
  });
  return result;
};

export const userService = {
  createAdmin,
};
