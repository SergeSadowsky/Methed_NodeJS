const textToBuffer = (text, encoding) => {
    return Buffer.from(text, encoding).toString('base64');
};

const bufferToText = (buffer, encoding) => {
    return Buffer.from(buffer, 'base64').toString(encoding);
};

const text = 'Привет, мир!!!';

const utf8Buffer = textToBuffer(text, 'utf8');
console.log('utf8Buffer : ', utf8Buffer );

const decodedText1 = bufferToText(utf8Buffer, 'utf8');
console.log('decodedText1: ', decodedText1);




