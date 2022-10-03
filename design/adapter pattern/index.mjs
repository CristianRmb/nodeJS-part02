/* The Logger class expects any logStorage object it receives to implement a write and a read method.

Fix the LogStorageFSAdapter class so that it provides the methods the Logger class expects. */

import fs from "node:fs/promises";

class Logger {
  constructor(logStorage) {
    this.logStorage = logStorage;
  }

  async info(message) {
    await this.logStorage.write(`[INFO] ${message}\n`);
  }

  async error(message) {
    await this.logStorage.write(`[ERROR] ${message}\n`);
  }

  async replay() {
    console.log(await this.logStorage.read());
  }
}

class LogStorageFSAdapter {
  constructor(filepath) {
    this.filepath = filepath;
  }

  async write(message) {
    try {
      await fs.appendFile(this.filepath, `${message}\n`);
    } catch (error) {
      console.error(error);
    }
  }

  async read() {
    try {
      return await fs.readFile(this.filepath, { encoding: "utf-8" });
    } catch (error) {
      console.error(error);
    }
  }
}
//LogStorageFSAdapter aggiunge a Logger i 2 metodi read e write di cui ha bisogno per funzionare
const fsStorage = new LogStorageFSAdapter("output.log");

const logger = new Logger(fsStorage);

logger.info("Some information");

logger.error("A bit of an issue");

logger.error("A catastrophic error!");

logger.info("The best information");

logger.replay();
