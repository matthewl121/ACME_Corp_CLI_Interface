#!/usr/bin/env node

const {exec} = require('child_process');
const {Command} = require('commander');

const program = new Command();

program
    .command('install')
    .description('install all dependencies')
    .action(() => {
        exec('npm install --save-dev && tsc --init', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error installing dependencies: ${error}`);
                console.error(`Error installing dependencies: ${stderr}`);
                process.exit(1);
            }
            console.log(`${stdout}`);
            process.exit(0);
        });
    });

    //include the commands to run the tests etc

    program.parse(process.argv);