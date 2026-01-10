import { Request, Response } from 'express';
import z from "zod"
import ApiResponse from '../utils/ApiResponse';
import User from '../models/user.model';
import bcrypt from "bcryptjs"
import ServerError from '../utils/ServerError';
import jwt, { SignOptions } from "jsonwebtoken"

export const loginSchema = z.object({
    phone: z.string().min(10).max(10),
    password: z.string().min(6, "Password must be at least 6 characters long")
})

export const signUpSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    phone: z.string().min(10).max(10),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["farmer", "vet"]),
    pincode: z.string().min(6).max(6),
    farmName: z.string().optional(),
    location: z.string().optional()
})

export async function loginUser(req: Request, res: Response) {
    try {
        const parsedData = loginSchema.safeParse(req.body);

        if (!parsedData.success) {
            return res.status(400).json(
                new ApiResponse(false, "Invalid request data", null, parsedData.error)
            )
        }

        const { phone, password } = parsedData.data;

        const user = await User.findOne({ phone });
        console.log(user)
        if (!user) {
            return res.status(404).json(
                new ApiResponse(false, "User not found")
            )
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(isPasswordValid)
        if (!isPasswordValid) {
            return res.status(401).json(
                new ApiResponse(false, "Invalid password")
            )
        }

        const payload = {
            name: user.name,
            role: user.role,
            _id: user._id
        }

        const secret = process.env.JWT_SECRET as string

        const expiresIn = {
            expiresIn: "7d" as SignOptions["expiresIn"]
        }

        const token = jwt.sign(payload, secret, expiresIn)

        return res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60 * 1000
            }).json(
                new ApiResponse(true, "LoginSuccessful", user)
            )
    } catch (error) {
        ServerError(res, error)
    }
}

export async function signUpUser(req: Request, res: Response) {
    try {
        const parsedData = signUpSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json(
                new ApiResponse(false, "Invalid request data", null, parsedData.error)
            )
        }

        const { name, phone, password, role, pincode, farmName, location } = parsedData.data;

        const existingUser = await User.findOne({ phone });

        if (existingUser) {
            return res.status(409).json(
                new ApiResponse(false, "User with this phone number already exists")
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            phone,
            password: hashedPassword,
            role,
            pincode,
            farmName,
            location
        });

        await newUser.save();

        return res.status(201).json(
            new ApiResponse(true, "User registered successfully", newUser)
        )
    } catch (error) {
        ServerError(res, error)
    }
}