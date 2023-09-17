import { copyFile, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const FILE_PATH = './db/dbToDo.json';

export const readDb = async () => {
  try {
    const data = await readFile(FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`READ DB: ${err.message}`);
  }
};

export const writeDb = async (data) => {
    try {
      await writeFile(FILE_PATH, JSON.stringify(data), { encoding: 'utf-8' });
      return true;
    } catch (err) {
        throw new Error(`WRITE DB: ${err.message}`);
    }
};

export const exportDb = async () => {
  try {
    const filePath = path.join(os.homedir(), 'todo.json');
    await copyFile(FILE_PATH, filePath);
    console.log(`Список задач скопирован в домашнюю папку пользователя ${os.userInfo.name}`);
    console.log(`Путь к файлу: ${filePath}`);
    return true;
  } catch (err) {
    throw new Error(`EXPORT DB: ${err.message}`);
  }  
};