import { Prisma, UserRoll, UserStatus } from "@prisma/client";
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
  const searchAbleFeilds = ["email", "name"];
  const searchArray: Prisma.UserWhereInput[] = [];
  if (search) {
    console.log(search);
    searchArray.push({
      OR: searchAbleFeilds.map((fl) => ({
        [fl]: {
          contains: payload.search,
          mode: "insensitive",
        },
      })),
    });
  }
  if (Object.keys(restData).length > 0) {
    searchArray.push({
      AND: Object.keys(restData).map((key) => ({
        [key]: {
          equals: restData[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.UserWhereInput = { AND: searchArray };

  console.dir(whereCondition, { depth: Infinity });
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
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      needPasswrodChange: true,
      updatedAt: true,
      role: true,
      admin: true,
      patient: true,
      doctor: true,
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

const updateStatus = async (id: string, data: { status: string }) => {
  const isExitsUser = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const update = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: data.status as UserStatus,
    },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return update;
};

const getProfile = async (user: any) => {
  const email = user?.email;
  const matchUser = await prisma.user.findUniqueOrThrow({
    where: {
      email: email,
    },
  });
  let profile;
  if (matchUser.role === UserRoll.SUPER_ADMIN) {
    profile = await prisma.admin.findUnique({
      where: {
        email: matchUser.email,
      },
    });
  } else if (matchUser.role === UserRoll.ADMIN) {
    profile = await prisma.admin.findUnique({
      where: {
        email: matchUser.email,
      },
    });
  } else if (matchUser.role === UserRoll.DOCTOR) {
    profile = await prisma.doctor.findUnique({
      where: {
        email: matchUser.email,
      },
    });
  } else if (matchUser.role === UserRoll.PATIENT) {
    profile = await prisma.patient.findUnique({
      where: {
        email: matchUser.email,
      },
    });
  }
  return profile;
};

const updateMyProfifle = async (user: any, data: any) => {
  const file = data.file;

  if (file) {
    const uploadeCloudinary = (await fileUploader.uploadTocloudinary(
      file
    )) as TClodnary;
    data.body.profilePhoto = uploadeCloudinary?.secure_url;
  }

  const userExits = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  let updateProfile;
  if (userExits.role === UserRoll.SUPER_ADMIN || UserRoll.ADMIN) {
    updateProfile = await prisma.admin.update({
      where: {
        email: userExits.email,
      },
      data: data.body,
    });
  } else if (userExits.role === UserRoll.DOCTOR) {
    updateProfile = await prisma.doctor.update({
      where: {
        email: userExits.email,
      },
      data: data.body,
    });
  } else if (userExits.role === UserRoll.PATIENT) {
    updateProfile = await prisma.patient.update({
      where: {
        email: userExits.email,
      },
      data: data.body,
    });
  }
  return updateProfile;
};

export const userService = {
  createAdmin,
  createDoctor,
  ceatePatient,
  getAlluserFromDb,
  updateStatus,
  getProfile,
  updateMyProfifle,
};
