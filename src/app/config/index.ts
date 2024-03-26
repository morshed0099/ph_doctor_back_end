import { config } from "dotenv";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd() + ".env") });

export default {
  token_secrect: process.env.TOKEN_SECRECT,
  refesh_secret: process.env.REFESH_SECRECT,
  token_exprie: process.env.TOKEN_EXPRIE,
  refesh_exprie: process.env.REFESH_EXPRIE,
};
