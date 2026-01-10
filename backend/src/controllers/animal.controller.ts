import { Request, Response } from "express";
import z from "zod"
import ApiResponse from "../utils/ApiResponse";
import ServerError from "../utils/ServerError";
import Animal from "../models/animal.model";
import HealthRecord from "../models/healthRecords.model";
import path from "path";
import fs from "fs"

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
export async function getAttendanceRecords(req: Request, res: Response) {
    try {
        const { tagId } = req.params;

        const animal = await Animal.findOne({ tagId: tagId });

        if (!animal) {
            return res.status(404).json(
                new ApiResponse(false, `Animal with ID ${tagId} not found`, null)
            );
        }

        const attendanceData = {
            tagId: animal.tagId,
            animalName: `${animal.species}${animal.breed ? ` - ${animal.breed}` : ''}`,
            totalAttendance: animal.attendanceLogs?.length || 0,
            attendanceLogs: animal.attendanceLogs || [],
            createdAt: animal.createdAt
        };

        return res.status(200).json(
            new ApiResponse(true, "Attendance records retrieved successfully", attendanceData)
        );

    } catch (error) {
        console.error('Get attendance error:', error);
        ServerError(res, error);
    }
}

export async function getDashboardStats(req: Request, res: Response) {
    try {
        const ownerId = req.user?._id;

        if (!ownerId) {
            return res.status(401).json(new ApiResponse(false, "Authentication required"));
        }

        const animals = await Animal.find({ owner: ownerId });
        const totalAnimals = animals.length;

        if (totalAnimals === 0) {
            return res.status(200).json(
                new ApiResponse(true, "No animals found", {
                    presentCount: 0,
                    absentPercentage: 0,
                    flaggedCount: 0,
                    syncStatus: "Synced"
                })
            );
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let presentCount = 0;
        const animalIds = animals.map(a => a._id);

        animals.forEach(animal => {
            const hasLogToday = animal.attendanceLogs?.some(logDate => {
                const d = new Date(logDate);
                d.setHours(0, 0, 0, 0);
                return d.getTime() === today.getTime();
            });
            if (hasLogToday) presentCount++;
        });

        const absentCount = totalAnimals - presentCount;
        const absentPercentage = Math.round((absentCount / totalAnimals) * 100);

        // Get flagged animals (Risk Level High or Medium in latest record)
        const healthRecords = await HealthRecord.find({
            animal: { $in: animalIds }
        }).sort({ createdAt: -1 });

        // Group by animal and take the latest
        const latestRecordsMap = new Map();
        healthRecords.forEach(record => {
            if (!latestRecordsMap.has(record.animal.toString())) {
                latestRecordsMap.set(record.animal.toString(), record);
            }
        });

        let flaggedCount = 0;
        latestRecordsMap.forEach(record => {
            if (record.riskLevel === 'high' || record.riskLevel === 'medium') {
                flaggedCount++;
            }
        });

        const stats = {
            presentCount,
            absentPercentage,
            flaggedCount,
            syncStatus: "Synced"
        };

        return res.status(200).json(
            new ApiResponse(true, "Dashboard stats retrieved successfully", stats)
        );

    } catch (error) {
        console.error('Get Dashboard Stats error:', error);
        ServerError(res, error);
    }
}