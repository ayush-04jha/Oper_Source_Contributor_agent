import { fileURLToPath } from 'node:url';
import path from 'node:path';
console.log("file path",import.meta.url)
console.log("->",fileURLToPath(import.meta.url));
console.log("---->", path.dirname(fileURLToPath(import.meta.url)));
