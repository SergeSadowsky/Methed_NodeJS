const COUNTRY =
  // eslint-disable-next-line max-len
  'aearataubebgbrcachcncocuczdeegfrgbgrhkhuidieilinitjpkrltlvmamxmyngnlnonzphplptrorsrusasesgsiskthtrtwuausveza'
    .replace(/([a-z]{2})/gi, '$1_')
    .split('_');
const CATEGORIES =
  'business_entertainment_general_health_science_sports_technology'.split('_');
const LANGS = 'ardeenesfrheitnlnoptrusvudzh'
    .replace(/([a-z]{2})/gi, '$1_')
    .split('_');

const appConst = {
  country: COUNTRY,
  lang: 'ru',
  langs: LANGS,
  categs: CATEGORIES,
  pageSize: 10,
  headlinesAPI: 'https://newsapi.org/v2/top-headlines',
  searchAPI = 'https://newsapi.org/v2/everything',
};

export default appConst;
