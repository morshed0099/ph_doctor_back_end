import { Admin, Prisma, UserStatus } from "@prisma/client";
import { helpers } from "../../../helpers/paginationClaculte";
import prisma from "../../shered/prisma";

const admicRetive = async (payload: any, option: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    helpers.calculatePaginationOption(option);
  const { search, ...restData } = payload;
  const serchArray: Prisma.AdminWhereInput[] = [];
  const adminSearchAbleFeilds = ["name", "email"];
  if (search) {
    serchArray.push({
      OR: adminSearchAbleFeilds.map((fl) => ({
        [fl]: {
          contains: payload.search,
          mode: "insensitive",
        },
      })),
    });
  }
  serchArray.push({
    AND: {
      isDeleted: false,
    },
  });
  if (Object.keys(restData).length > 0) {
    serchArray.push({
      AND: Object.keys(restData).map((key) => ({
        [key]: {
          equals: restData[key],
        },
      })),
    });
  }

  const whareCondition: Prisma.AdminWhereInput = { AND: serchArray };
  const result = await prisma.admin.findMany({
    where: whareCondition,    
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
  const totalPage = await prisma.admin.count({
    where: whareCondition,
  });
  return {
    meta: {
      page,
      limit,
      total: totalPage,
    },
    data: result,
  };
};

const getAdminById = async (id: string) => {
  await prisma.admin.findFirstOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateData = async (id: string, data: Partial<Admin>) => {
  await prisma.admin.findFirstOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: data,
  });
  return result;
};

const deleteData = async (id: string) => {
  await prisma.admin.findFirstOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (clinet) => {
    const deteleAdmin = await clinet.admin.delete({
      where: {
        id,
      },
    });
    const deleteUser = await clinet.user.delete({
      where: {
        email: deteleAdmin.email,
      },
    });

    return deteleAdmin;
  });

  return result;
};

const softDeleteDb = async (id: string) => {
  await prisma.admin.findFirstOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async (client) => {
    const deteleAdmin = await client.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    const userBlocked = await client.user.update({
      where: {
        email: deteleAdmin.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return deteleAdmin;
  });
  return result;
};
export const adminService = {
  admicRetive,
  getAdminById,
  updateData,
  deleteData,
  softDeleteDb,
};
