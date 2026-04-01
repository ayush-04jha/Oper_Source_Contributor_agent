import { simpleGit } from 'simple-git';
import { v4 as uuidv4 } from 'uuid';
import fs from 'node:fs/promises'; 
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const git = simpleGit();
console.log("__dirname: ",__dirname);

 export async function cloneRepository(repoUrl){
        const jobId = uuidv4();
        const tempBaseDir = path.join(__dirname,'..','temp');
        const targetPath = path.join(tempBaseDir, jobId);

        try{
           await fs.mkdir(tempBaseDir, { recursive: true });

        console.log(`[${jobId}] Cloning: ${repoUrl}...`);
        await git.clone(repoUrl, targetPath);
        
        console.log(`[${jobId}] Successfully cloned to: ${targetPath}`);
        return { jobId, targetPath };
        }
        catch{
console.error("Cloning failed:", error);
        throw error;
        }
  }