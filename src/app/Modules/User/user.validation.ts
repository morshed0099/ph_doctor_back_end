import { Gender } from "@prisma/client";
import { string, z } from "zod";

const createUserValidation = z.object({
  password: z.string({ required_error: "password is requierd" }),
  admin: z.object({
    name: z.string({ required_error: "name is requied" }),
    email: z.string({ required_error: "email is requied" }),
    contactNumber: string({ required_error: "contactNumber is requierd" }),
  }),
});

const createDoctorVlidationSchema = z.object({
  name: z.string({ required_error: "doctor name is required" }),
  email: z.string({ required_error: "doctor email is required" }),
  profilePhoto: z.string().optional(),
  address: z.string(),
  registrationNumber: z.string({
    required_error: "registration number is required",
  }),
  experience: z.number({ required_error: "experience is required" }),
  gender: z.enum([Gender.FEMALE, Gender.MALE]),
  appoinmentFee: z.number({ required_error: "appoinmentFee is required" }),
  currentWorkingPlace: z.string({ required_error: "working place is missing" }),
  qualification: z.string({ required_error: "qualification is required" }),
  designation: z.string({ required_error: "designation is required" }),
});

export const validationUser = {
  createUserValidation,
  createDoctorVlidationSchema,
};
