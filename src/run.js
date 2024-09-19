#!/usr/bin/env node
const fs = require('fs');
const {exec} = require('child_process');
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
                const metrics = calculateMetrics(url);
                console.log(JSON.stringify(metrics));
            });
        });
    });
    //include the commands to run the tests etc

    program.parse(process.argv);