import jwt from "jsonwebtoken";

const genarateTokent = (
  payload: {email:string,role:string},
  secret: string,
  expiresIn:string
) => {    
 return jwt.sign(payload,secret,{expiresIn})
};

export default genarateTokent;
