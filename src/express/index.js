import { hrtime } from 'node:process';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
// @ts-expect-error ts is dumb
import express from 'express';
import * as config from '../config.js';
import getHtml from '../getHtml.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('express').Application} */
const app = express();

app.use('/public', express.static(path.join(__dirname, '../../public')))

app.get('/', (req, res) => {
  const requestStart = hrtime.bigint()
  res.send(getHtml({ ...config, TITLE: 'Express Server', START_TIME: requestStart }));
});

export default function main() {
  app.listen(config.PORT);
}
