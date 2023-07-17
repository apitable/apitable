const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const process = require('process');
const child_process = require('child_process');

dotenv.config();

function copyDataBusArtifacts(databusDir) {
  child_process.execSync('sh -c "make build-node"', { cwd: databusDir, encoding: 'utf-8', stdio: 'inherit' });
  fs.copyFileSync(path.join(databusDir, 'index.js'), path.join(__dirname, 'index.js'));
  fs.copyFileSync(path.join(databusDir, 'index.d.ts'), path.join(__dirname, 'index.d.ts'));
  for (const artifactFile of fs.readdirSync(databusDir, { withFileTypes: true })) {
    if (artifactFile.isFile() && artifactFile.name.endsWith('.node')) {
      fs.copyFileSync(path.join(databusDir, artifactFile.name), path.join(__dirname, artifactFile.name));
    }
  }
}

function buildCommunityArtifacts() {
  fs.writeFileSync(path.join(__dirname, 'index.js'), 'module.exports = {};', 'utf-8');
  fs.writeFileSync(
    path.join(__dirname, 'index.d.ts'),
    `
  export type DatasheetPackResponse = any;
  export type NativeModule = any;
  `,
    'utf-8',
  );
}

if (process.env.IS_ENTERPRISE === 'true') {
  const databusDir = path.resolve(__dirname, '../../../databus');
  if (fs.existsSync(databusDir)) {
    copyDataBusArtifacts(databusDir);
  } else {
    // In CI, DataBus is built by another script, so there there is no need to build it again.
    if (!fs.existsSync(path.join(databusDir, 'index.d.ts'))) {
      buildCommunityArtifacts();
    }
  }
} else {
  buildCommunityArtifacts();
}
