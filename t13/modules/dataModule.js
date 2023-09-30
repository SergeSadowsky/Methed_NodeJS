import https from 'node:https';
import { readFile, writeFile } from 'node:fs/promises';

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;
const TICKERS_URL = 'data/all/coinlist?summary=true';
const PRICE_URL = 'data/pricemulti';
const TSYMS = process.env.TSYMS;
const QUOTES_FILE = process.env.QUOTES_FILE;
const QUOTES_SIZE = process.env.QUOTES_SIZE;

export const fetchUrlAsync = async url =>
  new Promise((resolve, reject) => {
    https.get(url, response => {
      let data = '';

      response.on('data', chunk => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(data);
      });

      response.on('error', err => {
        reject(err);
      });
    });
  });

export const fetchValidTickers = async () => {
  try {
    const url = `${API_URL}${TICKERS_URL}`;
    const data = await fetchUrlAsync(url);
    const validTickers = Object.keys(JSON.parse(data).Data);
    return validTickers;
  } catch (error) {
    console.error(`Data request error: ${error.message}`);
  }
};

export const fetchTickersData = async tickers => {
  const url = new URL(`${API_URL}${PRICE_URL}`);
  url.searchParams.set('tsyms', TSYMS);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('fsyms', tickers.join(','));

  try {
    const data = await fetchUrlAsync(url);
    //console.log('data: ', data);
    return JSON.parse(data);
  } catch (error) {
    console.error(`Data request error: ${error.message}`);
  }
};

export const createTimestampedData = tickersData => {
  const timestampedData = {};
  const timestamp = Date.now();

  for (const currency in tickersData) {
    timestampedData[currency] = {
      timestamp,
      //price: tickersData[currency][TSYMS],
    };
    TSYMS.split(',').forEach(tsym => {
      timestampedData[currency][`price_${tsym}`] = tickersData[currency][tsym];
    });
  }
  return timestampedData;
};

export const storeQuotesData = async data => {
  let quotesData = undefined;
  try {
    const filesData = await readFile(QUOTES_FILE, 'utf8');
    quotesData = JSON.parse(filesData);
    for (const currency in data) {
      if (Object.hasOwnProperty.call(data, currency)) {
        //const element = data[currency];
        if (!Object.hasOwnProperty.call(quotesData, currency)) {
          quotesData[currency] = [];
        }
        quotesData[currency].push(data[currency]);
      }
    }
  } catch (error) {
    console.log(`Store quotes Read error: ${error.mesage}`);
  }

  for (const currency in quotesData) {
    if (Object.hasOwnProperty.call(quotesData, currency)) {
      //const element = quotesData[currency];
      if (quotesData[currency].length > QUOTES_SIZE) {
        quotesData[currency].shift();
      }
    }
  }

  try {
    await writeFile(QUOTES_FILE, JSON.stringify(quotesData));
  } catch (error) {
    console.log(`Store quotes Write error: ${error}`);
  }
};

export const fetchAndStoreData = async tickers => {
  const tickersData = await fetchTickersData(tickers);
  const timestampedData = createTimestampedData(tickersData);
  storeQuotesData(timestampedData);
};
