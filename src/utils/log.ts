import { openSync, closeSync } from "fs";

const fs = require('fs');

export function initLogFile() {
    if (!fs.existsSync(process.env.LOG_FILE)) {
        // Create log file if it doesn't exist
        fs.writeFileSync(process.env.LOG_FILE, '');
    } else {
        // Clear it if it does exist
        fs.writeFileSync(process.env.LOG_FILE, '');
    }
}

export function logToFile(message: string | object, message_level: number) {
    let log_level = parseInt(process.env.LOG_LEVEL || '1', 10);
    // Check if LOG_LEVEL is valid
    if (isNaN(log_level) || log_level < 0 || log_level > 3) {
        // console.error('Invalid LOG_LEVEL. Using default level 0.');
        log_level = 0;
    }
    if (message_level <= log_level) {
        let formattedMessage: string;
        if (typeof message === 'object') {
            formattedMessage = JSON.stringify(message, null, 2);
        } else {
            formattedMessage = message.toString();
        }
        fs.appendFileSync(process.env.LOG_FILE, formattedMessage + '\n');
    }
}

// Usage examples:
// logToFile('Informational messages', 1);
// logToFile('Debug messages', 2);