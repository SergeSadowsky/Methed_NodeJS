import { EventEmitter } from 'node:events';

class Logger extends EventEmitter {
    constructor(fileName, maxSize){
      super();
      this._fileName = fileName;
      this._maxSize = maxSize;
      this._logQueue = [];
      this._writing = false;
    }

    log(message) {
        this._logQueue.unshift(message);
        this.writeLog();
    }

    writeLog() {
         //writeFile
         this._logQueue.length = 0;
         this.emit('messageLogged')
    }
};
const loger = new Logger('test.log', 2048);
