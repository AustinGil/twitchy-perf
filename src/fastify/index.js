import { hrtime } from 'node:process';
import Fastify from 'fastify';
import * as config from '../config.js';
import getHtml from '../getHtml.js';

const app = Fastify({});
app.get('/', (request, reply) => {
  const requestStart = hrtime.bigint()
  reply.type('text/html');
  reply.send(getHtml({ ...config, TITLE: 'Fastify Server', START_TIME: requestStart }));
});

export default function main() {
  app.listen({ port: config.PORT });
}
