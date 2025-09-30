// Usage: `node ./docker.js <stage>` ex: `node ./docker.js beta`
const { execSync } = require('child_process');

// Build Docker image
execSync(
  `docker build -t aidan-mackey-net-raycast .`,
  { stdio: 'inherit' }
);

// Deploy via Docker Compose
console.log(`Deploying Docker Compose`);
execSync(
    `ls`,
  { stdio: 'inherit' }
);
execSync(
  `docker compose -f docker-compose.yml up -d`,
  { stdio: 'inherit' }
);
