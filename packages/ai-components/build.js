const { exec } = require('child_process');
const fs = require('fs');

const dir = 'src';

// Check if the file exists
fs.access(dir, fs.constants.F_OK, (err) => {
  if (err) {
    console.error(`${dir} does not exist, no compilation will be performed.`);
  } else {
    // File exists, execute the rollup -c command
    exec('rm -rf ./dist && rollup -c --bundleConfigAsCjs && tsc-alias', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error occurred while executing the compilation command: ${error}`);
      } else {
        console.log('Rollup compilation successful');
      }
    });
  }
});
