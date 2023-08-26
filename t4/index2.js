import { EventEmitter } from 'node:events';
class EE extends EventEmitter {};
const emitter = new EE();

const sendMessage = (user, msg) => {
  emitter.emit('send', { user, msg })
};

const receiveMessage = ({user, msg}) => {
    console.log(`Message from ${user} : ${msg}`);
};

emitter.on('send', receiveMessage);

sendMessage('Mike', 'Hi!');
sendMessage('john', 'Hello. What\'s up bro?');
