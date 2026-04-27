import { execSync } from 'child_process';

// run build
execSync(`(cd web && ng serve)`, { stdio: 'inherit' });

