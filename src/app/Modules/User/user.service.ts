import { Prisma, UserRoll } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../shered/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
import { TClodnary } from "../../../interface/cloudinaryFile";
import { Request } from "express";
import { helpers } from "../../../helpers/paginationClaculte";

const createAdmin = async (req: Request) => {
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
const createDoctor = async (req: Request) => {
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
const ceatePatient = async (req: Request) => {
  const file = req.file;
  console.log(req.file);

  if (file) {
    const uploadCloudinary = (await fileUploader.uploadTocloudinary(
      file
    )) as TClodnary;
    req.body.patient.profilePhoto = uploadCloudinary?.secure_url;
  }

  const hasPass = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.patient.email as string,
    name: req.body.patient.name as string,
    password: hasPass,
    role: UserRoll.PATIENT,
  };

  const result = await prisma.$transaction(async (transaction) => {
    await transaction.user.create({
      data: userData,
    });
    const createPatient = await transaction.patient.create({
      data: req.body.patient,
    });
    return createPatient;
  });
  return result;
};

const getAlluserFromDb = async (payload: any, option: any) => {
  const { search, ...restData } = payload;
  const { limit, page, skip, sortBy, sortOrder } =
    helpers.calculatePaginationOption(option);
  const searchAbleFeilds = ["email", "role", "status", "search"];
  const searchArray: Prisma.UserWhereInput[] = [];
  if (search) {
    searchArray.push({
      OR: searchAbleFeilds.map((fl) => ({
        [fl]: {
          constains: payload.search,
          mode: "insencetive",
        },
      })),
    });
  }
  if (Object.keys(restData).length > 0) {
    searchArray.push({
      AND: Object.keys(restData).map((key) => ({
        [key]: restData[key],
      })),
    });
  }

  const whereCondition: Prisma.UserWhereInput = { AND: searchArray };
  const result = await prisma.user.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  const totalPage = await prisma.user.count({
    where: whereCondition,
  });
  return {
    meta: {
      page,
      total: totalPage,
      limit,
    },
    data: result,
  };
};

export const userService = {
  createAdmin,
  createDoctor,
  ceatePatient,
  getAlluserFromDb,
};
