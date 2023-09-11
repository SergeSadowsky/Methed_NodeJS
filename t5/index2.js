import { EventEmitter } from 'node:events';
import { copyFile, stat, truncate, writeFile } from 'node:fs/promises';

// Напишите класс Logger для логирования
//
// Создайте класс Logger, который будет расширять EventEmitter.
//
// constructor(filename, maxSize): Конструктор класса. Принимает два аргумента:
//
// filename (строка) - имя файла лога, в который будут записываться сообщения.
// maxSize (число) - максимальный размер файла лога в байтах.
//
// Логи записываются в начало и обрезаются с конца, когда файл превышает maxSize.
//
// В конструктор инициализируем поля объекта:
// имя файла(filename)
// максимальный размер(maxSize)
// очередь логов(logQueue - array)
// флаг записи(writing - boolean)
// Определите методы:
// log(message): добавляет сообщение в начало logQueue и вызывает метод writeLog, если запись в файл в данный момент не выполняется, устанавливает флаг writing в значение true.
// writeLog(): Записывает файл лога из массива logQueue и очищает его. Генерирует событие 'messageLogged'. Вызывает метод проверки размера файла checkFileSize.
// Если в массиве logQueue есть еще сообщения лога, рекурсивно вызывает метод writeLog.
// Если в массиве logQueue больше нет сообщений лога, устанавливает флаг writing в значение false.    
// getFileSize(): с помощью fs.stat получает информацию о размере файла и возвращает его размер в байтах. Если возникает ошибка при получении информации о файле, возвращает 0.
// checkFileSize(): Если текущий размер файла превышает максимальный размер, вызывает метод rotateLog для выполнения ротации лога.
// rotateLog(): Создает резервную копию файла с расширением .bak (копируя текущий лог-файл), затем обрезает текущий лог-файл с помощью метода fs.truncate
/*
* const logger = new Logger('log.txt', 1024);
* logger.on('messageLogged', message => {
*   console.log('Записано сообщение:', message);
* });
* logger.log('Первое сообщение');
* logger.log('Второе сообщение');
*/

class Logger extends EventEmitter {
    constructor(fileName, maxSize){
      super();
      this._fileName = fileName;
      this._maxSize = maxSize;
      this._logQueue = [];
      this._writing = false;
    };

    log(message) {
        this._logQueue.unshift(message);
        this._writing = true;
        this.writeLog();
    };

    async writeLog() {
         try {
            await writeFile(this._logQueue);
            this._logQueue.length = 0;
            this.emit('messageLogged');
         } catch (error) {
            console.log(error.message);
         }
    };

    async getFileSize() {
      try {
        const fsStat = await stat(fileName);
        return fsStat.size;
      } catch (error) {
        console.error(error.message);
        return 0;
      }
    };

    async checkFileSize() {
      
    
      if(this.getFileSize > this._maxSize){
        await this.rotateLog();
      }
    };

    async rotateLog() {
      const now = new Date();
      const newFile = [now.getFullYear(), 
        (now.getMonth() + 1).toString().padStart(2), 
        now.getDate().toString().padStart(2, '0'),
        now.getHours().toString().padStart(2, '0'),
        now.getMinutes().toString().padStart(2, '0'),
        now.getSeconds().toString().padStart(2, '0'),
        this._fileName].join('-'); 
        if(!this._writing) {
          try {
            await copyFile(this._fileName, newFile)
            truncate(this._fileName, 0);
          } catch (error) {
            console.error(error.message);
          } 
        }
    };
};
const logger = new Logger('test.log', 2048);

logger.on('messageLogged', message => {
  console.log('Записано сообщение:', message);
  });
logger.log('Первое сообщение');
logger.log('Второе сообщение');

console.log('logger.getFileSize: ', logger.getFileSize());
console.log('logger.checkFileSize(): ', logger.checkFileSize());

