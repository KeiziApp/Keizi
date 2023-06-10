import chalk from 'chalk';

class Logger {
    debug(message: string | unknown) {
        console.log(`${chalk.gray(new Date())} ${chalk.white("DEBUG")}: ${chalk.white(message)}`);
    }

    info (message: string) {
        console.log(`${chalk.gray(new Date())} ${chalk.blue("INFO")}: ${chalk.white(message)}`);
    }

    warn (message: string) {
        console.log(`${chalk.gray(new Date())} ${chalk.yellow("WARN")}: ${chalk.white(message)}`);
    }

    error (message: string) {
        console.log(`${chalk.gray(new Date())} ${chalk.red("ERROR")}: ${chalk.white(message)}`);
    }
}

const loggerInstance = new Logger();

export default loggerInstance;