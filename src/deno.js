import { serve } from 'https://deno.land/std@0.119.0/http/server.ts';
import getHtml from './getHtml.js';

function handler(_req) {
  // const p = new Performance();

  // for (const e of p.getEntries()) {
  //   console.log(e);
  // }

  console.log(Deno.memoryUsage());

  return new Response('Hello, World');
}
console.log('Listening on http://localhost:8000');
serve(handler);
