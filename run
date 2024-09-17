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
            console.log(`%c${stdout}`, 'color: green');
        });
    });

    //include the commands to run the tests etc

    program.parse(process.argv);