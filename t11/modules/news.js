import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';
import dotenv from 'dotenv';
import appConst from './const.js';

dotenv.config();

const news = {
  async getHeadlines(params) {
    return await this._fetchData(appConst.headlinesAPI);


  },
  getSearch(params) {

    
  },
  
  fetchData(urlStr) {
    const myUrl = new URL(urlStr);
    const httpModule = myUrl.protocol === 'https:' ? https : http;

    const options = {
      hostname: myUrl.hostname,
      path: myUrl.pathname,
      port: myUrl.port,
      headers: {
        'X-Api-Key': process.env.API_KEY || '',
        'User-Agent': 'UncleSergeApp/1.0',
      },
    };

    return new Promise((resolve, reject) => {
      try {
        const req = httpModule.request(options, res => {
          let data = '';
          res.on('data', chunk => {
            data += chunk;
          });
          res.on('end', () => {
            resolve(data);
          });
        });
        req.on('error', err => {
          reject(err);
        });
        req.end();
      } catch (error) {
        reject(error);
      }
    });
  },
};

export default news;
