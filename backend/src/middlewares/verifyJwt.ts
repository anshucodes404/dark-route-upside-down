import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json(new ApiResponse(false, "Unauthorized: No token provided"));
    }

    const secret = process.env.JWT_SECRET as string;
    if (!secret) {
      console.error("JWT_SECRET is not defined in environment");
      return res.status(500).json(new ApiResponse(false, "Internal Server Error: Security configuration missing"));
    }

    const decodedToken = jwt.verify(token, secret) as JwtPayload;

    if (!decodedToken) {
      return res.status(401).json(new ApiResponse(false, "Unauthorized: Invalid token"));
    }

    req.user = decodedToken;
    next();
  } catch (error: any) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json(new ApiResponse(false, "Unauthorized: " + error.message));
  }
};
