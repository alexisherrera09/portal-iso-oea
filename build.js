import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get mode from command line arguments
const mode = process.argv[2];

// Validación: Requiere ambiente
if (!mode) {
  console.error('Usage: npm run build <env>');
  console.error('Example: npm run build qa');
  console.error('Example: npm run build production');
  process.exit(1);
}

// Validación: Ambiente válido
const validModes = ['qa', 'production'];
if (!validModes.includes(mode)) {
  console.error(`Invalid mode: ${mode}`);
  console.error(`Valid modes: ${validModes.join(', ')}`);
  process.exit(1);
}

// Validación: Archivo .env existe
const envFile = path.join(__dirname, `.env.${mode}`);
if (!fs.existsSync(envFile)) {
  console.error(`Environment file not found: .env.${mode}`);
  process.exit(1);
}

// Leer y mostrar configuración
const envContent = fs.readFileSync(envFile, 'utf-8');
const apiBaseMatch = envContent.match(/VITE_API_BASE=(.+)/);
const apiBase = apiBaseMatch ? apiBaseMatch[1].trim().replace(/\r?\n$/, '') : 'not found';

console.log(`Building for ${mode} environment...`);
console.log(`Using API base: ${apiBase}`);

// Ejecutar build
try {
  execSync(`npx vite build --mode ${mode}`, { stdio: 'inherit', cwd: __dirname });
  console.log(`Build completed successfully for ${mode}`);
} catch (error) {
  console.error(`Build failed: ${error.message}`);
  process.exit(1);
}
