import { config } from 'dotenv';
import { execSync } from 'child_process';

// load dotenv
config();
const { DEPLOYMENT } = process.env;
if (!DEPLOYMENT) {
    console.error('ERROR: Missing keys in .env');
    process.exit(1);
}

// run build
execSync(`pnpm web:build`, { stdio: 'inherit' });

// deploy
execSync(DEPLOYMENT, { stdio: 'inherit' });

