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

const writeQuestion = (q, index) => {
    writeln(`\nВопрос № ${index}`.toUpperCase())
    writeln('\n' + q.question);    
    q.options.forEach((item, index) => writeln(`${index + 1}. ${item}`));
};

const getAnswer = async(q, index) => {
    writeQuestion(q, index + 1);
    while (true) {
        const answer = await rl.question('Ваш ответ: ');

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

        let correctCount = 0;

        clear();
        writeln('TEST');
        writeln(`Тема: JavaScript и Node.js.`);
        writeln(`Количество вопросов: ${data.length}`)
        writeln('Для выбора варианта ответа введите его номер.');
        await rl.question(`Нажмите 'Enter', чтобы начать тестирование`);

        for( const [index, item] of data.entries()){
            const answer = await getAnswer(item, index);
            if (answer) {
                correctCount++
                writeln('Ответ верный.');
            } else {
                writeln('Ответ неверный.');
            }
        };
        writeln();
        await rl.question(`Нажмите 'Enter' для просмотра результата тестирования.`);

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
