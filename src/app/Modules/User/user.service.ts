import { UserRoll } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../shered/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
import { TClodnary } from "../../../interface/cloudinaryFile";

const createAdmin = async (req: any) => {
  const file = req.file;

  if (file) {
    const uploadCloudinary = (await fileUploader.uploadTocloudinary(
      file
    )) as TClodnary;
    req.body.admin.profilePhoto = uploadCloudinary?.secure_url;
  }

  const hasPass = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.admin.email as string,
    name: req.body.admin.name as string,
    password: hasPass,
    role: UserRoll.ADMIN,
  };

  const result = await prisma.$transaction(async (transaction) => {
    const createUser = await transaction.user.create({
      data: userData,
    });
    const createAdmin = await transaction.admin.create({
      data: req.body.admin,
    });
    return createAdmin;
  });
  return result;
};
const createDoctor = async (req: any) => {
  const file = req.file;

  if (file) {
    const uploadCloudinary = (await fileUploader.uploadTocloudinary(
      file
    )) as TClodnary;
    req.body.doctor.profilePhoto = uploadCloudinary?.secure_url;
  }

  const hasPass = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.doctor.email as string,
    name: req.body.doctor.name as string,
    password: hasPass,
    role: UserRoll.DOCTOR,
  };

  const result = await prisma.$transaction(async (transaction) => {
    await transaction.user.create({
      data: userData,
    });
    const createDoctor = await transaction.doctor.create({
      data: req.body.doctor,
    });
    return createDoctor;
  });
  return result;
};

export const userService = {
  createAdmin,
  createDoctor,
};
