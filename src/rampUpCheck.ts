// import fs from 'fs';

// export const rampUpCheck = (fileContent: string): boolean => {
//   const file = fs.readFileSync(fileContent, 'utf-8');
//   const lines = file.split('\n');
//   let lastLine = lines[lines.length - 1];
//   if (lastLine === '') {
//     lastLine = lines[lines.length - 2];
//   }
//   const lastLineTime = new Date(lastLine.split(',')[0]);
//   const currentTime = new Date();
//   const timeDifference = currentTime.getTime() - lastLineTime.getTime();
//   const rampUpTime = rampUp * 1000;
//   return timeDifference < rampUpTime;
// };