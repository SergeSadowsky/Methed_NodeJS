const getWord = (n, forms) => {
    let u = n % 10;
    if (n > 10 && n < 20) return forms[2];
    if (u == 1) return forms[0];
    if (u > 1 && u <5) return forms[1];
    return forms[2];
};

export default getWord;