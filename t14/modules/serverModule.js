import { readFile, writeFile } from 'node:fs/promises';
import http from 'node:http';
import url from 'node:url';

const TICKERS_FILE = process.env.TICKERS_FILE;

const NOT_FOUND_MESSAGE = 'Resource not found.';
const NOT_VALID_METHOD = 'Resource not found.';
const SERVER_ERROR_MESSAGE = 'Internal server error.';
const INVALID_REQUEST_MESSAGE = 'Invalid request';
const SUCCESS_ADD_MESSAGE = 'Currency added successfuly.';
const SUCCESS_DELETE_MESSAGE = 'Currency deleted successfuly.';

const QUOTES_FILE = process.env.QUOTES_FILE;

const handleQueryStep = (res, quotesData, queryStep) => {
  const step = parseInt(queryStep);
  let lastValuesData = {};
  if (step && step > 0) {
    Object.keys(quotesData).forEach(ticker => {
      const values = quotesData[ticker];
      const slicedValues = values.slice(-step);
      lastValuesData[ticker] = step < values.length ? slicedValues : values;
    });
  } else {
    lastValuesData = quotesData;
  }
  res.end(JSON.stringify(lastValuesData));
};

const handleGetRequest = async (res, query) => {
  try {
    const fileData = await readFile(QUOTES_FILE, 'utf8');
    res.writeHeader(200, { 'Content-Type': 'application/json' });
    const quotesData = JSON.parse(fileData);

    let filteredData = {};
    if (query.tickers) {
      const tickers = query.tickers.toUpperCase().split(',');

      tickers.forEach(ticker => {
        if (Object.prototype.hasOwnProperty.call(quotesData, ticker)) {
          filteredData[ticker] = quotesData[ticker];
        }
      });
    } else {
      filteredData = quotesData;
    }
    handleQueryStep(res, filteredData, query.step);
  } catch (error) {
    console.error('Handle GET request error: ', error.message);
    res.writeHeader(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: SERVER_ERROR_MESSAGE }));
  }
};

const handlePostRequest = (res, req, tickers, validTickers) => {
  const lengthTickers = tickers.length;
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });
  req.on('end', async () => {
    const userTickers = [];

    const data = JSON.parse(body.toUpperCase());

    if (typeof data === 'string') {
      userTickers.push(data);
    }

    if (Array.isArray(data)) {
      userTickers.push(...data);
    }

    userTickers.forEach(ticker => {
      if (validTickers.includes(ticker) && !tickers.includes(ticker)) {
        tickers.push(ticker);
      }
    });

    if (tickers.length !== lengthTickers) {
      try {
        await writeFile(TICKERS_FILE, JSON.stringify(tickers), 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: SUCCESS_ADD_MESSAGE }));
      } catch (error) {
        console.error('Handle POST request error: ', error.message);
        res.writeHeader(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: SERVER_ERROR_MESSAGE }));
      }
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: INVALID_REQUEST_MESSAGE }));
    }
  });
};

const handleDeleteTickers = async (res, tickers, query) => {
  try {
    const tickersLength = tickers.length;

    if (!query.tickers) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: INVALID_REQUEST_MESSAGE }));
      return;
    }

    const removeTickers = query.tickers.toUpperCase().split(',');
    const fileData = await readFile(QUOTES_FILE, 'utf8');
    const quotesData = JSON.parse(fileData);

    removeTickers.forEach(ticker => {
      const index = tickers.indexOf(ticker);
      if (index !== -1) {
        tickers.splice(index, 1);
        delete quotesData[ticker];
      }
    });

    if (tickers.length !== tickersLength) {
      await writeFile(TICKERS_FILE, JSON.stringify(tickers), 'utf8');
      await writeFile(QUOTES_FILE, JSON.stringify(quotesData), 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: SUCCESS_DELETE_MESSAGE }));
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: INVALID_REQUEST_MESSAGE }));
    }
  } catch (error) {
    console.error('Handle DELETE request error: ', error.message);
    res.writeHeader(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: SERVER_ERROR_MESSAGE }));
  }
};

export const startServer = (tickers, validTickers) => {
  const server = http.createServer((req, res) => {
    const { pathname, query } = url.parse(req.url, true);
    if (pathname.startsWith('/crypto')) {
      if (req.method === 'GET') {
        handleGetRequest(res, query);
        return;
      }
      if (req.method === 'POST') {
        handlePostRequest(res, req, tickers, validTickers);
        return;
      }
      if (req.method === 'DELETE') {
        handleDeleteTickers(res, tickers, query);
        return;
      }
      res.writeHeader(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: NOT_VALID_METHOD }));
    }
    res.writeHeader(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: NOT_FOUND_MESSAGE }));
  });
  return server;
};
