import processRepo from "../processes/processRepo.js"
import { v4 as uuidv4 } from "uuid";
import { pendingJobs } from "../utils/jobStore.js";


export const urlprocessor = async (req, res) => {
    const gitHubLink = req.body.link;
    const jobId = uuidv4();
    processRepo(gitHubLink,jobId)
    
    return res.status(200).json({ jobId });
}