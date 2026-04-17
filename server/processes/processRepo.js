import { cloneRepository } from '../utils/cloner.js';
import { exec } from 'node:child_process';
import util from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getFiles } from './getFiles.js';

   // exec is used to run terminal commands but we have to pass the command and the callback function in it which can be little messy and also we can't use async await in it so we promisify it to reduce complexity and to use it in async await style
const execPromise = util.promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// __dirname is giving you the folder path of current file (server->current files folder name). and ROOT_DIR is giving you the folder path of just above parent folder of the current folder(Open_Source)
const ROOT_DIR = path.resolve(__dirname, '../..');

export default  async function processRepo(url) {
    try {
        const { targetPath, jobId } = await cloneRepository(url);
        // we know that the  target path is the path till jobid folder and we are fetching all files from it, which are cloned in that folder from git url
        const allFiles = await getFiles(targetPath)
         // extracting the files which have extensions as ['.js', '.py', '.ts', '.jsx']
        const codeFiles = allFiles.filter(file =>
            ['.js', '.py', '.ts', '.jsx'].includes(path.extname(file))
        );

        if (codeFiles.length === 0) {
            console.log("No code files found to parse!");
            return;
        }
        console.log(`🚀 Starting Ingestion for ${codeFiles.length} files...`); console.log(`🚀 Starting Ingestion for ${codeFiles.length} files...`);
        // --- THE VIRTUAL ENVIRONMENT PATHS ---
        // 1. Point directly to the python.exe INSIDE your .venv
        const venvPythonPath = path.join(ROOT_DIR, 'ai_engine', '.venv', 'Scripts', 'python.exe');
        //pythonScriptPath is a path to processor.py 
        const pythonScriptPath = path.join(ROOT_DIR, 'ai_engine', 'processor.py');
        let totalFunctionsSaved = 0;
        for (const [index, filePath] of codeFiles.entries()) {
            try {
                // Log progress so you don't think the terminal is frozen
                const fileName = path.basename(filePath);
                const normalizedPath = path.normalize(filePath);
                process.stdout.write(`[${index + 1}/${codeFiles.length}] Processing: ${fileName}... `);
               // you are running processor.py and python.exe in terminal for each file in an interval of 6 sec.
                const { stdout, stderr } = await execPromise(
                    `"${venvPythonPath}" "${pythonScriptPath}" "${normalizedPath}" "${jobId}"`,
                    { timeout: 60000 }
                );
                if (stderr) {
                    console.log(`\n❌ ERROR in ${fileName}: ${stderr}`); // This will tell us the exact line in Python that failed
                }

                if (stdout && stdout.trim()) {
                    const result = JSON.parse(stdout.trim());
                    totalFunctionsSaved += result.functions_saved;
                    console.log(`✅ Saved ${result.functions_saved} functions.`);
                }
                if (stderr) {
                    // This will show us if Gemini is rate-limiting you
                    console.log(`\n⚠️ Python Warning: ${stderr}`);
                }
                await new Promise(resolve => setTimeout(resolve, 1500));
            } catch (fileError) {
                // If ONE file fails (maybe a syntax error), we skip it and continue
                console.log(`❌ Skipped (Error in file)`);
            }
        }
         
        console.log(`\n--- INGESTION COMPLETE ---`);
        console.log(`Total Files Processed: ${codeFiles.length}`);
        console.log(`Total Functions in Vector DB: ${totalFunctionsSaved}`);
        console.log(`Repo ID for Search: ${jobId}`);
         return 1;

    } catch (err) {
        console.error("❌ Critical System Error:", err.message);
    }
}

