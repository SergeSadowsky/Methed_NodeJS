import { access, constants, copyFile, mkdir, readdir } from 'node:fs/promises';
import * as path from 'node:path';

const errors = [];

let dirCount = 0;
let fileCount = 0;
let dirErrors = 0;
let fileErrors = 0;
let listErrors = 0

async function *getFSObjects(dir){
  try{
    const files = await readdir(dir, { withFileTypes: true});
    // console.log('files: ', files);
    for (const file of files) {
      if (file.isDirectory()) {
        yield file;
        yield* await getFSObjects(path.join(dir, file.name));        
      } else {
        yield file;
      };
    };
  } catch (error) {
    console.error(`Can't get access to ${dir}`, error.message);
    errors.push(`Can't get access to ${dir} - ` + error.message)
    listErrors++;
  };
};

const filesCopy = async (srcDir, dstDir, cb) => {
  try {
    await access(srcDir, constants.R_OK);
    console.log('Source directory - Ok');
  } catch (error) {
    cb(['Source directory - Error. ' + error.message]);
    process.exit(1);
  };
  try {
    await access(dstDir, constants.W_OK);
    console.log('Destination directory - Ok');
  } catch (error) {
    cb(['Destination directory - Error. ' + error.message]);
    process.exit(1);
  };

  for await(const fso of getFSObjects(srcDir)){
    const oldFso = path.join(fso.path.replace(srcDir,''), fso.name);
    const newFso = path.join(dstDir, oldFso);
  
    if(fso.isDirectory()){
      try {
        await mkdir(newFso);
        console.log('\x1b[33m%s\x1b[0m', `${newFso} created.`);
        dirCount++;
      } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', `Can't create directory ${newFso} - ${error.code}`);
        errors.push(`Can't create directory ${newFso} - ${error.code}`);
        dirErrors++;
      }
    } else {
      try {
        const oldFile = path.join(fso.path, fso.name);
        await copyFile(oldFile, newFso);
        console.log(`${oldFso} => ${newFso} copied.`);
        fileCount++;
      } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', error.message);
        errors.push(error.message);
        fileErrors++;      
      };
    };
  };

  console.log('\x1b[32m%s\x1b[0m', `Directories created - ${dirCount}, Files copied - ${fileCount}`);
  console.log('\x1b[31m%s\x1b[0m', `Directories errors - ${dirErrors}, Files errors - ${fileErrors}`);
  if(errors.length > 0) {
    cb(errors);
  } else {
    cb(null);
  }
};

const args = process.argv.slice(2);

// const srcDir = '../../Methed_NodeJS/';
// const dstDir = '/home/uncleserge/Study/test';
const srcDir = args[0];
console.log('srcDir: ', srcDir);
const dstDir = args[1];
console.log('dstDir: ', dstDir);

filesCopy(srcDir, dstDir, (error) => {
  if(error) {
    console.error('Errors:');
    error.forEach(element => {
      console.error(element);
    });
  } else {
    console.log('All file system objects copied succesfully.');
  }
});