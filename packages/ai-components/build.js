const fs = require('fs');
const { exec } = require('child_process');

const configFile = 'rollup.config.js';

// Check if the file exists
fs.access(configFile, fs.constants.F_OK, (err) => {
  if (err) {
    console.error(`${configFile} does not exist, no compilation will be performed.`);
  } else {
    // File exists, execute the rollup -c command
    exec('rm -rf ./dist && rollup -c --bundleConfigAsCjs', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error occurred while executing the compilation command: ${error}`);
      } else {
        console.log('Rollup compilation successful');
      }
    });
  }
});
