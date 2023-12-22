// const { exec } = require('child_process');
// const fs = require('fs');

// const packageDir = 'packages/ai-components';
// if (fs.existsSync(packageDir) && fs.lstatSync(packageDir).isDirectory()) {
//   if (!fs.existsSync(`${packageDir}/rollup.config.js`)) {
//     return;
//   }
//   process.chdir(packageDir);
//   const command = 'pnpm build';

//   const childProcess = exec(command);

//   childProcess.stdout.on('data', (data) => {
//     console.log(data);
//   });

//   childProcess.stderr.on('data', (data) => {
//     console.error(data);
//   });

//   childProcess.on('exit', (code) => {
//     if (code === 0) {
//       console.log(`Command '${command}' executed successfully.`);
//     } else {
//       console.error(`Command '${command}' failed with exit code ${code}.`);
//     }
//   });
// } else {
//   console.error(`Directory '${packageDir}' does not exist.`);
// }
