import * as fs from 'fs';
import * as path from 'path';
import { initLogFile, logToFile } from '../src/utils/log.js';

try {
  initLogFile();
  const filePath = path.join(__dirname, 'jest-output.txt');
  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.split('\n');

  // Get total number of tests and number of tests passed
  const testsCountRegex = /Tests:\s+(\d+)\s+passed,\s+(\d+)\s+total/;
  const match = data.match(testsCountRegex);
  let passed = -1;
  let total = -1;
  if (match) {
    passed = parseInt(match[1], 10);
    total = parseInt(match[2], 10);
  }

  // Check if there are at least 5 lines
  if (lines.length >= 5) {
    // Get the 5th line (index 4)
    const fifthLine = lines[4];
    
    // Split the line into words/values and keep only numbers
    const values = fifthLine.split(/\s+/).filter(word => /^\d+(\.\d+)?$/.test(word));
    
    // Check if there are at least 4 values
    if (values.length >= 4) {
      // Get the 4th value and convert it to an integer
      const coverage = parseInt(values[3], 10);

      if (!isNaN(coverage)) {
        console.log(`${passed}/${total} test cases passed. ${coverage}% line coverage achieved.`);
      } else {
        logToFile('The 4th value on the 5th line is not a valid integer', 1);
      }
    } else {
        logToFile('The 5th line does not have 4 values', 1);
    }
  } else {
    logToFile('The file does not have 5 lines', 1);
  }
} catch (error) {
    logToFile(`Error reading or parsing the Jest output file: ${error}`, 1);
}