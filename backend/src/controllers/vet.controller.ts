import { Request, Response } from 'express';
import z from "zod"
import ApiResponse from '../utils/ApiResponse';
import Medication from "../models/medication.model"
import HealthRecord from "../models/healthRecords.model"
import ServerError from '../utils/ServerError';

const medicationRecordSchema = z.object({
    tagId: z.string().min(1, "Animal ID is required"),
    disease: z.string().min(1, "Disease is required"),
    description: z.string().min(1, "Description is required"),
    solution: z.string().min(1, "Solution is required"),
})


export async function addMedicationRecord(req: Request, res: Response) {
    try {
        const { tagId } = req.params;
        const parsedData = medicationRecordSchema.safeParse(req.body);

        if (!parsedData.success) {
            return res.status(400).json(
                new ApiResponse(false, "Validation error", null, parsedData.error)
            );
        }

        const { disease, description, solution } = parsedData.data;

        const prescribedBy = req.user?._id;

        const newMedicationRecord = await Medication.create({
            tagId,
            prescribedBy,
            disease,
            description,
            solution
        });

        return res.status(201).json(
            new ApiResponse(true, "Medication record added successfully", newMedicationRecord)
        );

    } catch (error) {
        console.error("Error occured while adding medication")
        ServerError(res, error);
    }
}

export async function getMedicationRecordsbytheVet(req: Request, res: Response) {
    try {
        const vetId = req.user?._id;
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const medicationRecords = await Medication.find({
            prescribedBy: vetId,
            createdAt: { $gte: thirtyDaysAgo }
        }).sort({ createdAt: -1 });

        if (!medicationRecords || medicationRecords.length === 0) {
            return res.status(200).json(
                new ApiResponse(true, "No medication records found in the last 30 days", [])
            );
        }

        const uniqueTagIds = [...new Set(medicationRecords.map(record => record.tagId))];

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const healthRecords = await HealthRecord.find({
            tagId: { $in: uniqueTagIds },
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        const animalsHealthData = uniqueTagIds.map(tagId => {
            const animalMedications = medicationRecords.filter(m => m.tagId === tagId);
            const animalHealthRecords = healthRecords.filter(h => h.tagId === tagId);

            return {
                tagId,
                medicationCount: animalMedications.length,
                latestMedication: animalMedications[0],
                healthRecords: animalHealthRecords,
                treatmentDates: animalMedications.map(m => m.createdAt)
            };
        });

        return res.status(200).json(
            new ApiResponse(
                true, 
                `Health records for ${uniqueTagIds.length} unique animals treated in the last 30 days`, 
                animalsHealthData
            )
        );

    } catch (error) {
        console.error("Error occurred while fetching medication records:", error);
        ServerError(res, error);
    }
}

export async function getMedicationRecordsforanAnimal(req: Request, res: Response) {
    try {
        const { tagId } = req.params;

        const medicationRecords = await Medication.find({ tagId }).sort({ createdAt: -1 });

        if (!medicationRecords || medicationRecords.length === 0) {
            return res.status(404).json(
                new ApiResponse(false, `No medication records found for animal with ID ${tagId}`, null)
            );
        }

        const latestTreatmentDate = medicationRecords[0].createdAt;

        const healthRecords = await HealthRecord.find({
            tagId: tagId,
            createdAt: { $gte: latestTreatmentDate }
        }).sort({ createdAt: -1 });

        const treatmentData = {
            tagId,
            latestTreatmentDate,
            medicationCount: medicationRecords.length,
            medicationRecords,
            healthRecords,
            totalHealthRecordsDays: healthRecords.length
        };

        return res.status(200).json(
            new ApiResponse(true, `Medication and health records for animal with ID ${tagId} retrieved successfully`, treatmentData)
        );

    } catch (error) {
        console.error("Error occurred while fetching medication records for animal:", error);
        ServerError(res, error);
    }
}

