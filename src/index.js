const fs = require('fs');
const util = require('util');

const LOG_ENTRIES_PER_SECOND = 0.25;
const STRINGS = [
    "This is log Message %d",
    "%d messages received. load factor reached.",
    "this is some static log text with a number: %d that is bigger than the one before",
    "{\"mixingIn\": \"some json\",\"withSomeNumbers\": %d}"
];
let stopNow = false;
let counter = 0;
const LOG_FILE_NAME = "/var/log/jstest.log"

setupLogToFile();
console.log("Starting log generator");

process.on('SIGINT', stop);
process.on('SIGTERM', stop);

generateLogs();

/* ---------------------------- */

function setupLogToFile()  {
    // let log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
    let log_file = fs.createWriteStream(LOG_FILE_NAME, {flags : 'w'});
    let log_stdout = process.stdout;

    console.log = function(d) {
        log_file.write(util.format(d) + '\n');
        log_stdout.write(util.format(d) + '\n');
    };
}

function stop() {
    console.log('Process requested to quit. Stopping log generation.');
    stopNow = true;
}

function generateLogs() {
    if(!stopNow){
        setTimeout(generateLogs, 1000/LOG_ENTRIES_PER_SECOND);
        console.log(new Date().toISOString() +" "+ randomString());
    }
}

function randomString() {
    return util.format(STRINGS[Math.floor(Math.random()*STRINGS.length)], counter++);
}