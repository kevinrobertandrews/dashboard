import { execSync } from 'child_process';

execSync(`cd api && node server.js --watch`, { stdio: 'inherit' });

