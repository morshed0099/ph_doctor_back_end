import { Prisma } from "@prisma/client";
import prisma from "../../shered/prisma";
import { helpers } from "../../../helpers/paginationClaculte";
import { equal } from "assert";

const getDoctor = async (payload: any, options: any) => {
  const { search, ...restData } = payload;

  const { limit, page, skip, sortBy, sortOrder } =
    helpers.calculatePaginationOption(options);

  const searchAbleFelids = ["email", "name"];
  const querayFeildsArray: Prisma.DoctorWhereInput[] = [];

  if (search) {
    querayFeildsArray.push({
      OR: searchAbleFelids.map((fl) => ({
        [fl]: {
          contains: payload.search,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(restData).length > 0) {
    querayFeildsArray.push({
      AND: Object.keys(restData).map((key) => ({
        [key]: {
          equals: restData[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.DoctorWhereInput = { AND: querayFeildsArray };
  const result = await prisma.doctor.findMany({
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

  const total = await prisma.doctor.count();

  return {
    meta: {
      page,
      total,
      limit,
    },
    data: result,
  };
};

const getDoctorById = async (id: string) => {
  const result = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });
  return result;
};
export const doctorServie = {
  getDoctor,
  getDoctorById,
};
