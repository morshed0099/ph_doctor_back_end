-- AddForeignKey
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_specialtiesId_fkey" FOREIGN KEY ("specialtiesId") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
