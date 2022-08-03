import { hrtime } from 'node:process';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static'
import * as config from '../config.js';
import getHtml from '../getHtml.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = Fastify({});

app.register(fastifyStatic, {
  root: path.join(__dirname, '../../public'),
  prefix: '/public/',
})

app.get('/', (request, reply) => {
  const requestStart = hrtime.bigint()
  reply.type('text/html');
  reply.send(getHtml({ ...config, TITLE: 'Fastify Server', START_TIME: requestStart }));
});

export default function main() {
  app.listen({ port: config.PORT });
}
