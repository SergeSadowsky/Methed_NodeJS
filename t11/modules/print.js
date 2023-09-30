const printNews = data => {
  const articles = JSON.parse(data).articles;

  if (articles.length > 0) {
    articles.forEach(element => {
      console.log(element);
    });
  } else {
    console.log('А новостей то и нет.');
  }
};

export default printNews;
