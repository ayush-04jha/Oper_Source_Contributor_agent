import express from "express"
import { urlprocessor } from "../controllers/urlProcessingController.js";
const router = express.Router();


router.post('/num',urlprocessor);

export default router
