import { readFile } from "node:fs/promises";

const questions = async () => {
    try {
        const data = await readFile('./question.json');
        return JSON.parse(data);
    } catch (error) {
        throw error;
    }
};

export default questions;