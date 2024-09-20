#!/usr/bin/env node
const fs = require('fs');
const {exec, execSync} = require('child_process');

try {
    execSync('npm -v', { stdio: 'ignore' });
} catch (error) {
    console.log('NPM not found. Please install Node.js and NPM before running this script');
    process.exit(1);
}

try {
    // Check if commander is installed
    require.resolve('commander');
} catch (error) {
    // If commander is not installed, install it
    // console.log('Commander not found. Installing commander...');
    try {
        execSync('npm install commander', { stdio: 'ignore' });
        // console.log('Commander has been successfully installed');
    } catch (installError) {
        // console.error('Error: Failed to install commander. Please try installing it manually.');
        process.exit(1);
    }
}


const {Command} = require('commander');

const program = new Command();

program
    .command('install')
    .description('install all dependencies')
    .action(() => {
        exec('npm install --save-dev && tsc --init', (error, stdout, stderr) => {
            if (error) {
                console.error(`%cError installing dependencies: ${error}`, `color: red`);
                console.error(`%cError installing dependencies: ${stderr}`, `color: red`);
                process.exit(1);
            }
            const addedPackages = stdout.match(/added (\d+) packages?/);
            if (addedPackages && addedPackages[1]) {
                const count = addedPackages[1];
                console.log(`${count} dependencies were installed`);
            } else {
                console.log(`All dependencies are installed and up to date`);
            }
            // console.log(`%c${stdout}`, 'color: green');
        });
    });

program
    .argument('<file>', 'file to run')
    .description('process URL of the file to run and output metrics in NDJSON format')
    .action((file) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                console.error(`%cError reading file: ${err}`, `color: red`);
                process.exit(1);
            }
            const urls = data.split('\n').filter(line => line.trim() !== '');
            urls.forEach(url => {
                const metrics = MetricsManager(url);
                console.log(JSON.stringify(metrics));
            });
        });
    });
    //include the commands to run the tests etc

program
    .command('test')
    .description('run tests, compile TypeScript, and execute compiled JavaScript')
    .action(() => {
        try {
            // Run Jest tests and output results to a file
            // console.log('Running Jest tests...');
            execSync('npx jest --silent > test/jest-output.txt 2>&1', { stdio: 'ignore' });
            // console.log('Tests completed. Output written to test/jest-output.txt');
        } catch (error) {
            // console.error('Error: Failed to run Jest tests.');
            // console.error('Details:', error.message);
            process.exit(1);
        }

        try {
            // Compile the TypeScript test file
            // console.log('Compiling TypeScript...');
            execSync('npx tsc test_output.ts', { stdio: 'ignore' });
            // console.log('TypeScript compiled successfully.');
        } catch (error) {
            // console.error('Error: Failed to compile TypeScript file "test_output.ts".');
            // console.error('Details:', error.message);
            process.exit(1);
        }

        try {
            // Execute the compiled JavaScript file
            // console.log('Running compiled JavaScript...');
            execSync('node test_output.js', { stdio: 'ignore' });
            // console.log('Test execution completed.');
        } catch (error) {
            // console.error('Error: Failed to execute the compiled JavaScript file "test_output.js".');
            // console.error('Details:', error.message);
            process.exit(1);
        }
    });


program.parse(process.argv);