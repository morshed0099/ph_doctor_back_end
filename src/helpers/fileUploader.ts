import multer from "multer";
import path, { resolve } from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { Tfile } from "../interface/cloudinaryFile";

cloudinary.config({
  cloud_name: "dzje1beyq",
  api_key: "797821769345419",
  api_secret: "oggESOhH0sUTwiNznHXMORd556I",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
const uploadTocloudinary = (file: Tfile) => {
  console.log(file);
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      { public_id: file.originalname },
      (error, result) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const fileUploader = {
  upload,
  uploadTocloudinary,
};
