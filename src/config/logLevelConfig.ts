import { ConsoleLoggerOptions, LogLevel } from "@nestjs/common";

export const consoleLoggerOptions: ConsoleLoggerOptions = getLogLevel(); 

function getLogLevel() {
    let logLevels: LogLevel[] = [];
    if (process.env.LOGLEVEL) {
        logLevels = logLevels.concat(<LogLevel>process.env.LOGLEVEL);
    }

    let consoleLoggerOptions: ConsoleLoggerOptions = {
        logLevels: logLevels
    }
    return consoleLoggerOptions;
};
