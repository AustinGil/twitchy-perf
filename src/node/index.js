import * as http from 'node:http';
import { hrtime } from 'node:process';
import * as config from '../config.js';
import getHtml from '../getHtml.js';

/** @type {import('node:http').RequestListener} */
function app(req, res) {
  const requestStart = hrtime.bigint()
  res.writeHead(200);
  res.end(getHtml({ ...config, TITLE: 'Node Server', START_TIME: requestStart }));
}

export default function main() {
  const server = http.createServer(app);
  server.listen(config.PORT, config.HOST);
}
