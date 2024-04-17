import { z } from "zod";

const createSpecialtiesValidation = z.object({
  title: z.string({ required_error: "specialties tilte is required !!" }),
});

export const specialitesValidation = {
  createSpecialtiesValidation,
};
