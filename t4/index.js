import { EventEmitter } from 'node:events';

class EE extends EventEmitter {
    constructor(count){
      super();
      this._count = count;
    }

    ticker(id){
      this._count++
      console.log(`Tick - ${this._count}`);
      if (this._count === 8) {
        clearInterval(id);
      };
    }
};
const ee = new EE(0);

ee.on('tick', ee.ticker);
              
const timerId = setInterval(() => {
    ee.emit('tick', timerId);
}, 1000);

  