const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define paths
const rootDir = __dirname;
const buildDir = path.join(rootDir, '.next');

// Ensure the .vercelignore file exists
const vercelIgnorePath = path.join(rootDir, '.vercelignore');
if (!fs.existsSync(vercelIgnorePath)) {
  console.log('Creating .vercelignore file...');
  fs.writeFileSync(
    vercelIgnorePath,
    `# Ignore Projects directory\nProjects/\nProjects/**/*\n\n# Other common excludes\n.git/\n.github/\n.vscode/\nnode_modules/\n**/node_modules/`
  );
}

// Run the deploy command
try {
  console.log('Deploying to Vercel...');
  execSync('vercel --prod', { stdio: 'inherit' });
  console.log('Deployment completed successfully!');
} catch (error) {
  console.error('Deployment failed:', error);
  process.exit(1);
} 