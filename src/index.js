import 'newrelic';
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

// 1. Web frameworks (node, express, fastify)
// 2. Clusters (utilize all CPUs available)

// SERVER SIDE:
// Linode longview product / extended metrics
// Manual/synthetic testing: unit tests
// Caching: Redis
// Server monitoring in Linode
// Application performance monitoring
// Time series DB
// New Relic / Dynatrace

// CLIENT SIDE:
// Caching: CDN, Browser, HTTP
// Real user monitoring: mPulse
// HTTP priority hints (prefetch/preconnect)
// Deferred script loading
// Partytown.js
// JS client side perf reporting
// Image optimization (size, quality, lazy)
