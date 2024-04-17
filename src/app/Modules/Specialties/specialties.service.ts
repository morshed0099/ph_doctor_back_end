import { Request } from "express";
import prisma from "../../shered/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
import { TClodnary } from "../../../interface/cloudinaryFile";

const createSpecialties = async (req: Request) => {
  const file = req?.file;
  if (file) {
    const uploadCloudinary = (await fileUploader.uploadTocloudinary(
      file
    )) as TClodnary;
    req.body.icon = uploadCloudinary?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });
  return result;
};

const getSpecialties = async () => {
  const result = await prisma.specialties.findMany({});
  return result;
};

const deleteSpecialties = async (id: string) => {
  await prisma.specialties.delete({
    where: {
      id: id,
    },
  });
};

export const specialtiesService = {
  createSpecialties,
  getSpecialties,
  deleteSpecialties,
};
