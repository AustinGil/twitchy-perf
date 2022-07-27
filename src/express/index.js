import { hrtime } from 'node:process';
// @ts-expect-error ts is dumb
import express from 'express';
import * as config from '../config.js';
import getHtml from '../getHtml.js';

/** @type {import('express').Application} */
const app = express();

app.get('/', (req, res) => {
  const requestStart = hrtime.bigint()
  res.send(getHtml({ ...config, TITLE: 'Express Server', START_TIME: requestStart }));
});

export default function main() {
  app.listen(config.PORT);
}
