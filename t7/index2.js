import readline from 'node:readline/promises';
import process from 'node:process';
import questions from './questions.js';
import getWord from './wordform.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('close', () => {
    process.exit();
});

const getSeq = (n) => Array(n).fill().map((el,index) => index + 1);

const clear = () => write('printf \x1bc');
const write = str => process.stdout.write(str);
const writeln = str => write((str || '') + '\n');

const box = (row, col, height, width) => {
    const border = ['┌', '─', '┐', '│', '└', '┘'];
    const w = width - 2;
    const h = height - 2;
    pos(row, col);
    write(border[0] + border[1].repeat(w) + border[2]);
    for (let i = 1; i < h; i++) {
      pos(row + i, col);
      write(border[3] + ' '.repeat(w) + border[3]);
    }
    pos(row + h, col);
    write(border[4] + border[1].repeat(w) + border[5]);
};

const pos = (row, col) => {
    write(`\x1b[${row};${col}H`);
};

const showProgressBar = (count, total, answers) => {
    clear();
    box(1, 0, 7, 26);
    pos(2, 3);
    write(`\x1b[34mВопросов: ${count} из ${total}\x1b[0m`);
    box(3, 3, 4, 22);
    for (let i = 0; i < count; i++) {
      if (answers.includes(i)) {
        pos(4, 5 + i);
        write('\x1b[42m \x1b[0m');
      } else {
        pos(4, 5 + i);
        write('\x1b[41m \x1b[0m');
      }
    };
    pos(7, 0);
  };

const writeQuestion = (q, index) => {
    writeln('\x1b[32m' + `\nВопрос № ${index}`.toUpperCase())
    writeln('\n\x1b[32m' + q.question + '\x1b[0m');    
    q.options.forEach((item, index) => writeln(`${index + 1}. ${item}`));
};

const getAnswer = async(q, index) => {
    writeQuestion(q, index + 1);
    while (true) {
        const answer = await rl.question('\x1b[34m' + 'Ваш ответ: ' + '\x1b[0m');

        if(isNaN(+answer) || 
        (!(getSeq(q.options.length).includes(+answer)))) {
            write('Ответ некорректный! ');
            writeln(`Введите число от 1 до ${q.options.length}`);
            continue;
        }
        return +answer === q.correctIndex; 
    };
};

questions()
    .then(async data => {

        let correctAnswers = [];

        clear();
        writeln('TEST');
        writeln(`Тема: JavaScript и Node.js.`);
        writeln(`Количество вопросов: ${data.length}`)
        writeln('Для выбора варианта ответа введите его номер.');
        await rl.question(`Нажмите 'Enter', чтобы начать тестирование`);

        showProgressBar(0, data.length, correctAnswers);

        for( const [index, item] of data.entries()){
            const answer = await getAnswer(item, index);
            if (answer) {
                correctAnswers.push(index);
                writeln('Ответ верный. ');
            } else {
                writeln('Ответ неверный. ');
            };
            await new Promise(resolve => { 
                const tId = setInterval(() => {
                    write('.')
                }, 200)
                setTimeout(() => {
                    clearInterval(tId);
                    resolve();
                }, 1000)
            });
            showProgressBar(index + 1, data.length, correctAnswers);            
        };
        writeln();
        await rl.question(`Нажмите 'Enter' для просмотра результата тестирования.`);
        const correctCount = correctAnswers.length;
        clear();
        writeln('Тест завершён.');
        writeln('Вы ответили правильно на ' + 
            `${correctCount} ${getWord(correctCount,['вопрос','вопроса','вопросов'])} ` +
            `из ${data.length}.`);
    })
    .catch(error => {
        write('Ошибка: ' + error.message + '\n');
    })
    .finally(() => {
        rl.close()
    });
