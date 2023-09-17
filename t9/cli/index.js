#!/usr/bin/env node

import process from 'node:process';

import { readDb, writeDb, exportDb } from "./modules/rwDb.js";
import argsParse from "./modules/argsParse.js";
import userInterface from './modules/ui.js';
import toDoList from './modules/toDoList.js';

const commandHandler = (args, ui) => {

    if (args.add) return ui.add(args.add);

    if (args.list) return ui.list();

    if (args.update) return ui.update(args.update);

    if (args.get) return ui.get(args.get);

    if (args.status) return ui.status(args.status);

    if (args.delete) return ui.delete(args.delete);

    if (args.save) return exportDb();

    if (args.h || args.help) return ui.help();    

    console.log('Неверная команда.\n');
    ui.help();
}

const app = async () => {
    const args = argsParse(process.argv, ['add', 'list', 'get', 'update', 'status', 'delete', 'save']);

    let data = [];
    try {
        data = await readDb();
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
    
    const list = toDoList(data);
    const ui = userInterface(list);
    try {
        commandHandler(args, ui);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
    

    if(list.isChanged){
        try {
            writeDb(list.list);
        } catch (error) {
            console.error(error.message);
            process.exit(1);
        };
    } 
};

app();
