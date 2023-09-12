import sharp from "sharp";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

const resizeImage = async (inputPath, outputPath) => {
    const rStream = createReadStream(inputPath);
    const wStream = createWriteStream(outputPath);
    const resizing = sharp().resize(400, 400).toFormat('jpeg');
    try {
        await pipeline(rStream, resizing, wStream);
    } catch (err) {
        console.error(err);
    }
};

await resizeImage('./files/landscape.jpg', './files/resized.jpg');


const greyBlurImage = async (inputPath, outputPath) => {
    const rStream = createReadStream(inputPath);
    const wStream = createWriteStream(outputPath);
    const changing = sharp().greyscale().blur(5).toFormat('jpeg');
    try {
        await pipeline(rStream, changing, wStream);
    } catch (err) {
        console.error(err);
    }
};

await greyBlurImage('./files/resized.jpg', './files/greyblured.jpg');

