import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { projects } from '../src/data/projects.js';
import * as cv from '../src/data/cv.js';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const payload = { ...cv, projects };
const output = execFileSync(process.env.PYTHON || 'python', ['scripts/generate_cv_pdf.py'], {
  cwd: root, input: JSON.stringify(payload), encoding: 'utf8', maxBuffer: 1024 * 1024,
});
process.stdout.write(output);
