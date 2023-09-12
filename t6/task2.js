import { createReadStream, createWriteStream } from 'node:fs';
import * as path from 'node:path';
import { readdir } from 'node:fs/promises';

const txtFileFilter = (arr) => arr.filter(el => el.match(/([^\s]+(?=\.(txt))\.\2)/));

const concater = async (dir, resultFile) => {
    const wStream = createWriteStream(resultFile);
    try {
        let fileList = await readdir(dir);
        fileList = txtFileFilter(fileList);
        fileList.forEach(file => {
            const rStream = createReadStream(path.join(dir, file));  
            rStream.on('data', chunk => {
                wStream.write(`[${file}]\n(${chunk})\n`);
            });
        }); 
    } catch (error) {
        console.error(error.message);
    };
};

concater('./files', './result.txt');
