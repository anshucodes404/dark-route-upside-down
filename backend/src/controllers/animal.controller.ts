import { Request, Response } from "express";
import z from "zod"
import ApiResponse from "../utils/ApiResponse";
import ServerError from "../utils/ServerError";
import Animal from "../models/animal.model";
import path from "path";
import fs from "fs"
import HealthRecord from "../models/healthRecords.model";
export const attendanceSchema = z.object({
    tagId: z.string().min(1, "Animal ID is required"),
    date: z.date().optional(),
})


export async function attendance(req: Request, res: Response) {
    let imageFilePath: string | null = null;

    try {
        if (!req.file) {
            return res.status(400).json(
                new ApiResponse(false, "Image file is required", null)
            );
        }

        imageFilePath = req.file.path;

        const parsedData = attendanceSchema.safeParse({
            tagId: req.body.tagId,
            date: req.body.date ? new Date(req.body.date) : new Date(),
        });

        if (!parsedData.success) {
            fs.unlinkSync(imageFilePath);
            return res.status(400).json(
                new ApiResponse(false, "Validation error", null, parsedData.error)
            );
        }

        const { tagId, date } = parsedData.data;

        let animal = await Animal.findOne({ tagId: tagId });

        if (!animal) {
            animal = await Animal.create({ tagId: tagId, owner: req.user?._id })
        }

        if (!animal.attendanceLogs) {
            animal.attendanceLogs = [];
        }

        animal.attendanceLogs.push(date || new Date());
        await animal.save();

        //TODO: CAll the ML model to process the image and get insights
        //TODO: also here websockets will be implemented to notify the user in real-time about the attendance status

        fs.unlinkSync(imageFilePath);

        const attendanceRecord = {
            tagId: animal.tagId,
        }

        return res.status(200).json(
            new ApiResponse(
                true,
                "Attendance recorded successfully",
                attendanceRecord
            )
        );

    } catch (error) {
        if (imageFilePath) {
            fs.unlinkSync(imageFilePath);
        }
        console.error('Attendance error:', error);
        ServerError(res, error);
    }
}


// Get attendance records for a specific animal by tagId
export async function getHealthRecordsOftheAnimalInitiatedByVet(req: Request, res: Response) {
    try {
        const { tagId } = req.params;

        const animal = await HealthRecord.find({
            tagId: tagId,
            healthFlag: { $in: ["high", "medium"] }
        }).sort({ createdAt: -1 });

        if (!animal || animal.length === 0) {
            return res.status(404).json(
                new ApiResponse(false, `Animal with ID ${tagId} not found`, null)
            );
        }




        // const attendanceData = {
        //     tagId: animal.tagId,
        //     animalName: `${animal.species}${animal.breed ? ` - ${animal.breed}` : ''}`,
        //     totalAttendance: animal.attendanceLogs?.length || 0,
        //     attendanceLogs: animal.attendanceLogs || [],
        //     createdAt: animal.createdAt
        // };

        // return res.status(200).json(
        //     new ApiResponse(true, "Attendance records retrieved successfully", attendanceData)
        // );

    } catch (error) {
        console.error('Get attendance error:', error);
        ServerError(res, error);
    }
}


export async function getAnimalsAttendanceLogsOwnedByUser(req: Request, res: Response) {
    try {
        const userId = req.user?._id;
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const animals = await Animal.aggregate([
            {
                $match: {
                    owner: userId,
                    createdAt: { $gte: startOfDay, $lte: endOfDay }
                }
            },
            {
                $lookup: {
                    from: "healthrecords",
                    localField: "tagId",
                    foreignField: "tagId",
                    as: "healthRecords"
                },
            },
            {
                $project: {
                    tagId: 1,
                    species: 1,
                    createdAt: 1,
                    healthRecords: 1,
                }
            }
        ])

        return res.status(200).json(
            new ApiResponse(true, "Today's animals retrieved successfully", animals)
        );
    } catch (error) {
        console.error('Get attendance error:', error);
        ServerError(res, error);
    }
}