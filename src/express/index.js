import * as os from 'node:os';
import { cpuUsage, memoryUsage, hrtime } from 'node:process';
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
  const url = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`)

  const startUsage = cpuUsage();
  const cpuUsageStats = cpuUsage(startUsage);
  const memoryUsageStats = memoryUsage();
  // const requestStart = hrtime.bigint()
  /** @type {Parameters<getHtml>[0]} */
  const args = {
    URL: url,
    FREE_MEM: os.freemem(),
    TOTAL_MEM: os.totalmem(),
    TITLE: 'Express Server',
    // START_TIME: requestStart,
    LOAD_AVERAGES: os.loadavg(),
    CPU_NUM: os.cpus().length,
    CPU_USAGE: cpuUsageStats.system + cpuUsageStats.user,
    MEMORY_USAGE: {
      heapTotal: memoryUsageStats.heapTotal,
      heapUsed: memoryUsageStats.heapUsed,
      rss: memoryUsageStats.rss,
    },
  }

  res.send(getHtml(args));
});

export default function main() {
  app.listen(config.PORT);
}
