#!/usr/bin/env node

import argsParse from './modules/argsParse.js';
import news from './modules/news.js';
import appConst from './modules/const.js';
import printNews from './modules/print.js';

const app = async () => {
  const params = {
    pageSize: appConst.pageSize,
    country: appConst.lang,
  };

  const args = argsParse(process.argv);

  if (Object.keys(args).length === 0) {
    news
      .getHeadlines(params)
      .then(data => {
        printNews(data);
      })
      .catch(err => {
        console.log(err);
      });
    return;
  }

  if (args.q && args.q.length > 0) {
    params.q = args.q;
  } else {
    console.log('Неверно указан параметр поиска.');
  }

  if (args.l && args.l.length === 2 && appConst.langs.includes(args.l)) {
    params.language = args.l;
  } else {
    console.log(
      'Неверно указан язык запроса. Возможные значения: ' + appConst.langs,
    );
  }

  if (args.c) {
    if (appConst.categs.includes(args.c)) {
      params.category = args.c;
    } else {
      console.log(
        'Категория указана неверно. Возможные значения: ' + appConst.categs,
      );
    }
  }

  if (args.s) {
    if (!isNaN(args.s) || +args.s <= 100) {
      params.pageSize = args.s;
    } else {
      console.log('Укажите количество новостей не более 100.');
      return;
    }
  }

  news
    .getSearch(params)
    .then(data => {
      printNews(data);
    })
    .catch(err => {
      console.log(err);
    });
};

app();
