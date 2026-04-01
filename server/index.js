import { cloneRepository } from './utils/cloner.js';
import { exec } from 'node:child_process';
import util from 'node:util';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const execPromise = util.promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
async function getFiles(dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
}

async function processRepo(url) {
    try {
        const { targetPath, jobId } = await cloneRepository(url);
        const allFiles = await getFiles(targetPath);

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
        const pythonScriptPath = path.join(ROOT_DIR, 'ai_engine', 'processor.py');
        let totalFunctionsSaved = 0;
        for (const [index, filePath] of codeFiles.entries()) {
            try {
                // Log progress so you don't think the terminal is frozen
                const fileName = path.basename(filePath);
                const normalizedPath = path.normalize(filePath);
                process.stdout.write(`[${index + 1}/${codeFiles.length}] Processing: ${fileName}... `);

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


    } catch (err) {
        console.error("❌ Critical System Error:", err.message);
    }
}

processRepo('https://github.com/ayush-04jha/Bugverse-App');