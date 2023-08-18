setTimeout(() => {
    console.log('Был диван,');  // 4

    setTimeout(() => {
        console.log('Выйди вон!');  // 8
    }, 10);

}, 0);

setImmediate(() => {
    console.log('На диване');  // 5
});

process.nextTick(() => {
    console.log('Чемодан,');  // 2
});
  
setImmediate(() => {
    setImmediate(() => {
        console.log('Кто не верит –');  // 7
    });

    console.log('Ехал слон.');   //  6
});

process.nextTick(() => {
    console.log('В чемодане');  // 3
});

console.log('Плыл по морю'); // 1