import { Router } from "express";
import { loginUser, signUpUser } from "../controllers/user.controller";

const userRouter = Router();

userRouter.route("/login").post(loginUser);
userRouter.route("/signup").post(signUpUser);


export default userRouter;