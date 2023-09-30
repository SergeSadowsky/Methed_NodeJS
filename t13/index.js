import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { startServer } from './modules/serverModule.js';
import { fetchValidTickers, fetchAndStoreData } from './modules/dataModule.js';

const PORT = process.env.PORT || 3000;
// console.log('PORT: ', PORT);

try {
  const validTickers = await fetchValidTickers();
  // console.log('validTickers: ', validTickers);

  const fileData = await readFile(process.env.TICKERS_FILE, 'utf8');
  const tickers = JSON.parse(fileData);
  const server = startServer(tickers, validTickers);
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  //   const tickersData = await fetchTickersData(tickers);
  //   saveTickersData(tickersData);
  //   await fetchAndStoreData(tickers);

  setInterval(() => {
    fetchAndStoreData(tickers);
  }, 5000);
} catch (error) {
  console.log('Error: ' + error.message);
}
