import {Router} from 'express';
import { verifyJWT } from '../middlewares/verifyJwt';
import { getHealthRecordsOftheAnimalInitiatedByVet } from '../controllers/animal.controller';
import { addMedicationRecord, getMedicationRecordsbytheVet, getMedicationRecordsforanAnimal } from '../controllers/vet.controller';

const router = Router()

router.get("/dashboard-data", verifyJWT, getMedicationRecordsbytheVet) //this will get vet dashboard data the last 30 days medications
router.get("/:tagId/health-since-latest-treatment", verifyJWT, getMedicationRecordsforanAnimal); //this will allow vets to get medication and health records for a specific animal since its latest treatment
router.get('/:tagId/health-records', verifyJWT, getHealthRecordsOftheAnimalInitiatedByVet); //this will allow vets to get health records for a specific animal by tagId
router.post('/:tagId/medications', verifyJWT, addMedicationRecord) //this will allow vets to add medication records for a specific animal


export default router;