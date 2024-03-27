import { config } from "dotenv";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd() + ".env") });

export default {
  token_secrect: process.env.TOKEN_SECRECT,
  refesh_secret: process.env.REFESH_SECRECT,
  token_exprie: process.env.TOKEN_EXPRIE,
  refesh_exprie: process.env.REFESH_EXPRIE,
  lolaclhost_link: process.env.LOCALHOT_LINK,
  reset_pass_token_secrect: process.env.RESET_PASS_TOKEN_SECRET,
  reset_pass_token_exprie_in: process.env.RESET_PASS_TOKEN_EXPRIE_IN,
  gmail: process.env.GMAIL,
  gmail_secret:process.env.GMAIL_SECRET
};
