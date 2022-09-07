// export default {
//   port: 3000,
//   fetch(request) {
//     return new Response('Welcome to Bun!');
//   },
// };

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// import { renderToReadableStream } from "react-dom/server";
import getHtml from './getHtml.js';

const PORT = 3000;

const dt = new Intl.DateTimeFormat();

export default {
  port: PORT,
  fetch(request) {
    console.log(request);
    const html = getHtml({
      URL: new URL(request.url),
      CPU_NUM: 1,
      CPU_USAGE: { system: 0, user: 0 },
      FREE_MEM: 0,
      LOAD_AVERAGES: [0, 0, 0],
      MEMORY_USAGE: {
        heapTotal: 0,
        heapUsed: 0,
        rss: 0,
      },
      TOTAL_MEM: 0,
    });
    return new Response(html, {
      headers: {
        'content-type': 'text/html',
      },
    });
  },
};

console.log(`App running at http://localhost:${PORT}`);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
