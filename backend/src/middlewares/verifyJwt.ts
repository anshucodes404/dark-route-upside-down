import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("first")
    let token = req.cookies?.accessToken

    if (!token) {
      console.log("Token not found")
      return res.redirect("/signup")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string ) as JwtPayload;

	if(!decodedToken){
	  console.log("Token verification failed")
	  return res.redirect("/signup")
	}
	req.user = decodedToken
    next();
  } catch (error) {
    throw new Error("Unauthorized")
  }
};
