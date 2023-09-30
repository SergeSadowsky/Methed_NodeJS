import fetchData from "./modules/fetch.mjs";
import parseHtml from "./modules/parse.mjs";


fetchData('https://lenta.ru')
.then(data => {
    parseHtml(data);
})
.catch(err => {
    console.log('err: ', err);    
})