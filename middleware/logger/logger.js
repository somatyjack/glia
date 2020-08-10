const fs = require("fs");

/**
 * Custom asynchronous logger for service specific needs
 */

let prevDate;
let currentDate;
let gblConfig; // temporary

//get formatted day for today
function getToday() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    return `${day < 10 ? "0" + day : day}_${
        month < 10 ? "0" + month : month
    }_${year}`;
}

//return path
function getFilePath(logType) {
    //const hash = uuidv4(); //in case if server restarted multiple times per day, so that it didn't overrite today's date logs
    return `${gblConfig.ms.LOGS_PATH}/${logType}_${currentDate}.log`; //_${hash}
}

//create new logging file with above path
function createNewFile(logType, options) {
    const filePath = getFilePath(logType);
    let stream = fs.createWriteStream(filePath, options);

    return stream;
}

function checkFile(logType, callback) {
    // check if this type of log with date already exists, then reuse it, otherwise create new one
    // reopening file, by removing last }
    const path = getFilePath(logType);
    fs.access(path, fs.F_OK, (err) => {
        callback(createNewFile(logType, { flags: "a" }));
    });
}

// update date and check if new set log files should be created
function setDate() {
    currentDate = getToday();

    //create new file if day has changed
    if (prevDate != currentDate) {
        options.closeLogging(); // close current log files
        // create new log for each type
        Object.keys(logTypes).forEach((type) => {
            logTypes[type] = createNewFile(type);
        });

        prevDate = currentDate;
    }
}

/* MAIN
 * check if logging is enabled
 */

// we want to make sure that similar error were grouped together within single file
// .i.e db_error and error should be in one file
const logStreams = {
    info: "info",
    error: "error",
    db_error: "error",
    not_found_error: "error",
    kernel_error: "error",
    service_error: "error",
    token_error: "info",
};

let logTypes = {};

async function assignStream(logType) {
    await checkFile(logType, (stream) => {
        const streamType = logStreams[logType];
        logTypes[streamType] = stream;
    });
}

const options = {
    init: function (config) {
        gblConfig = config;

        if (!config.ms.LOGS_ENABLED) return;

        currentDate = getToday();
        prevDate = currentDate; // init prev date on load
        // create new files if don't exist for today or reopen existing ones
        logTypes = {
            info: undefined,
            error: undefined,
        };

        assignStream("info");
        assignStream("error");

        // this is done when day finishes and new file should be create
        let mytime = setInterval(setDate, gblConfig.ms.LOGS_REFRESH_RATE);
    },
    log: (logType, textMsg, errPlace) => {
        if (!gblConfig.ms.LOGS_ENABLED) return;

        if (!logStreams[logType])
            throw new Error("Logging type:" + logType + " does not exist");

        var date = new Date();
        var MIL = date.getMilliseconds();
        var SEC = date.getSeconds();
        var MIN = date.getMinutes();
        var HR = date.getHours();

        var timestamp = HR + ":" + MIN + ":" + SEC + "." + MIL;

        var logEntry = {
            timeStamp: timestamp,
            logData: {
                type: logType,
                message: textMsg,
                where: errPlace,
            },
        };

        logEntry = JSON.stringify(logEntry) + ", \n";

        const streamType = logStreams[logType];
        logTypes[streamType].write(logEntry);
    },
    closeLogging: () => {
        if (!gblConfig.ms.LOGS_ENABLED) return;
    },
};

module.exports = options;
