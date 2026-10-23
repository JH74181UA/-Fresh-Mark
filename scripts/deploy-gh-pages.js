const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const REPO_OWNER = 'JH74181UA';
const REPO_NAME = '-Fresh-Mark';
const DEFAULT_REMOTE_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}.git`;

function run(cmd, cwd) {
  console.log(`> ${cmd} (in ${cwd || 'root'})`);
  return execSync(cmd, { cwd, stdio: 'inherit' });
}

function getRemoteUrl() {
  try {
    const stdout = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    if (stdout) {
      // If stdout already contains Lalitha0518, use it, otherwise ensure user auth URL
      return stdout;
    }
  } catch (e) {
    // remote origin might not be set yet
  }
  return DEFAULT_REMOTE_URL;
}

function deploy() {
  const rootDir = path.resolve(__dirname, '..');
  const distDir = path.join(rootDir, 'dist');

  if (!fs.existsSync(distDir)) {
    console.log('dist directory not found. Running predeploy build...');
    run('npm run predeploy', rootDir);
  }

  const remoteUrl = getRemoteUrl();
  console.log(`Deploying to remote: ${remoteUrl}`);

  // 1. Create a fresh temp directory
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gh-deploy-'));
  console.log(`Created temp working directory at: ${tempDir}`);

  try {
    // 2. Copy dist into tempDir recursively
    fs.cpSync(distDir, tempDir, { recursive: true });

    // 3. Create .nojekyll to prevent GitHub Pages from ignoring files starting with _ or node_modules
    fs.writeFileSync(path.join(tempDir, '.nojekyll'), '');
    console.log('Created .nojekyll');

    // 4. Duplicate index.html to 404.html for SPA client-side routing on GitHub Pages
    const indexHtml = path.join(tempDir, 'index.html');
    const notFoundHtml = path.join(tempDir, '404.html');
    if (fs.existsSync(indexHtml)) {
      fs.copyFileSync(indexHtml, notFoundHtml);
      console.log('Created 404.html SPA fallback');
    }

    // 5. Initialize clean git repo inside tempDir
    run('git init -b gh-pages', tempDir);
    
    // Copy user name & email config from local machine if available
    try {
      const userName = execSync('git config user.name', { encoding: 'utf8' }).trim() || REPO_OWNER;
      const userEmail = execSync('git config user.email', { encoding: 'utf8' }).trim() || 'lalithaprabu2@gmail.com';
      run(`git config user.name "${userName}"`, tempDir);
      run(`git config user.email "${userEmail}"`, tempDir);
    } catch (e) {
      run(`git config user.name "${REPO_OWNER}"`, tempDir);
      run(`git config user.email "deploy@gh-pages.local"`, tempDir);
    }

    // 6. Force-add all files (specifically including any font/node_modules folders inside dist)
    run('git add -A --force', tempDir);
    run(`git commit -m "Deploy to GitHub Pages: ${new Date().toISOString()}"`, tempDir);

    // 7. Push force to gh-pages branch
    console.log(`Pushing to ${remoteUrl} (branch: gh-pages)...`);
    run(`git push --force "${remoteUrl}" gh-pages`, tempDir);

    console.log('\n Successfully deployed to GitHub Pages!');
    console.log(`Live URL will be available at: https://${REPO_OWNER}.github.io/${REPO_NAME}/`);
  } finally {
    // Clean up tempDir
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {
      // ignore cleanup errors
    }
  }
}

deploy();
