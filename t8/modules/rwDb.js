import { readFile, writeFile } from 'node:fs/promises';

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
