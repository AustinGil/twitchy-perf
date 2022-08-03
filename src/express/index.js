import { hrtime } from 'node:process';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
// @ts-expect-error ts is dumb
import express from 'express';
import * as config from '../config.js';
import getHtml from '../getHtml.js';
import getTime from '../getTimePoorly.js';
import fibonacci from '../fibonacci.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('express').Application} */
const app = express();

app.use('/public', express.static(path.join(__dirname, '../../public')))

app.get('/api/time', async (req, res) => {
  const time = await getTime()
  res.send(time)
})
app.get('/api/fib', async (req, res) => {
  console.log(req.query.count)
  res.send(String(fibonacci(req.query.count || 1)))
})
app.get('/api/cube', async (req, res) => {
  const count = (req.query.num)
  let r = 0
  // while (r < Number(count)) {
  //   r += 1
  // }
  for (let x = 0; x < Number(count); x++) {
    for (let y = 0; y < Number(count); y++) {
      for (let z = 0; z < Number(count); z++) {
        r += 1;
      }
    }
  }
  // let r = [];
  // for (let x = 0; x < Number(count); x++) {
  //   for (let y = 0; y < Number(count); y++) {
  //     for (let z = 0; z < Number(count); z++) {
  //       let arr = [];
  //       let obj = [];
  //       obj[(x + y + z) + ''] = x * y * z;
  //       arr[x, y, z] = obj[x + y + z];
  //       r.push(arr);
  //     }
  //   }
  // }
  res.send(String(r))
})

app.get('/', (req, res) => {
  const requestStart = hrtime.bigint()
  res.send(getHtml({ ...config, TITLE: 'Express Server', START_TIME: requestStart }));
});

export default function main() {
  app.listen(config.PORT);
}
