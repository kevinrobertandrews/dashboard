import { config } from 'dotenv';
import { execSync } from 'child_process';

config();

const { DEPLOY_HOST, DEPLOY_PATH } = process.env;

if (!DEPLOY_HOST || !DEPLOY_PATH) {
    console.error('Missing DEPLOY_HOST or DEPLOY_PATH in .env');
    process.exit(1);
}

execSync(`scp -r web/dist/web/browser ${DEPLOY_HOST}:${DEPLOY_PATH}`, { stdio: 'inherit' });