// #!/usr/bin/env node

import readline from 'node:readline/promises';
import process from 'node:process';
import { readdir, readFile, writeFile, access, constants } from 'node:fs/promises';
import path from 'node:path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const clear = () => write('printf \x1bc');
const write = str => process.stdout.write(str);
const writeln = str => write((str || '') + '\n');

const findNReplace = async (dir, oldStr, newStr) => {
  const files = await readdir(dir, { withFileTypes: true, recursive: true});
  for await(const fso of files){
    if(!fso.isDirectory()){
      if(path.extname(fso.name) === '.txt'){
        try {
          const filePath = path.join(fso.path, fso.name);
          const fileTxt = await readFile(filePath, { encoding: 'utf-8' });
          const newTxt = fileTxt.replaceAll(oldStr, newStr);
          await writeFile(filePath, newTxt);
          writeln(`Текст в файле ${filePath} заменён.`);
        } catch (error) {
          writeln(error.message)
        }
      }
    }
  }
}

clear();
const dir = await rl.question('Введите путь к директории: ');
try {
  await access(dir, constants.R_OK | constants.W_OK);
} catch (error) {
  writeln('Ошибка доступа к каталогу. ' + error.message);
  process.exit(1);
};

const oldStr = await rl.question('Какую строку ищем? ');
if(oldStr.length === 0){
  writeln(`Строка поиска не может быть пустой.`)
  process.exit(1)
}
const newStr = await rl.question('На какую строку меняем? ');

findNReplace(dir, oldStr, newStr);
rl.close();

