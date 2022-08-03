import cluster from 'node:cluster';
import { cpus } from 'node:os';
import * as config from './config.js';
import nodeApp from './node/index.js';
import expressApp from './express/index.js';
import fastifyApp from './fastify/index.js';

if (cluster.isPrimary) {
  var numWorkers = cpus().length;

  console.log('Master cluster setting up ' + numWorkers + ' workers...');

  for (var i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('online', function (worker) {
    console.log('Worker ' + worker.process.pid + ' is online');
  });

  cluster.on('exit', function (worker, code, signal) {
    console.log(
      'Worker ' +
        worker.process.pid +
        ' died with code: ' +
        code +
        ', and signal: ' +
        signal
    );
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  let main;
  switch (config.SERVER) {
    case 'express':
      main = expressApp;
      break;
    case 'fastify':
      main = fastifyApp;
      break;
    default:
      main = nodeApp;
  }

  main();
  console.log(`Server is running on http://${config.HOST}:${config.PORT}`);
}

// 0a. Server monitoring & Linode longview (server metrics)
// 0b. Client audit (client metrics)
// 1. Web frameworks (node, express, fastify)
// 2. Clusters (utilize all CPUs available)
// 3. Partytown integration

// SERVER SIDE:
// Manual/synthetic testing: unit tests
// Caching: Redis
// Application performance monitoring (New Relic / Dynatrace)
// Time series DB
// GZIP/Brottli

// CLIENT SIDE:
// Caching: CDN, Browser, HTTP
// Real user monitoring: mPulse
// HTTP priority hints (prefetch/preconnect)
// Deferred script loading
// JS client side perf reporting
// Image optimization (size, quality, lazy)
// Resource offloading (CDN, EdgeWorker)
