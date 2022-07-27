import * as os from 'node:os';
import { cpuUsage, memoryUsage, hrtime } from 'node:process';
import { convertBytes } from './utils.js';

/**
 * @param {Pick<import('./config'), 'SENTRY'|'CDNJS'|'TAG_MANAGER'> & {
 * TITLE?: string,
 * START_TIME?: bigint
 * }} config
 */
export default function (config) {
  const loadAverages = os.loadavg();
  const startUsage = cpuUsage();
  const cpuUsageStats = cpuUsage(startUsage);
  const memoryUsageStats = memoryUsage();

  return `<html>
  <head>
    ${
      /*<script>
      partytown = {
        forward: ['dataLayer.push'],
      };
    </script>
    <script>
      /* Inlined Partytown Snippet *\/
    </script>*/ ''
    }
    ${
      config.SENTRY
        ? `<script type="text/partytown"
      src="https://browser.sentry-cdn.com/7.8.0/bundle.min.js"
      integrity="sha384-PVOy/EiuuBcf464HEXLzrIR872jZ4k78GhHPH9YhXiXR0/E/s1FTIOv1rlZ792HR"
      crossorigin="anonymous"
    ></script>`
        : ''
    }

    ${
      config.CDNJS
        ? `<script type="text/partytown" src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js" integrity="sha512-WFN04846sdKMIP5LKNphMaWzU7YpMyCU245etK3g/2ARYbPK9Ub18eG+ljU96qKRCWh+quCY7yefSmlkQw1ANQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script type="text/partytown" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>`
        : ''
    }
  
    ${
      config.TAG_MANAGER
        ? `<!-- Google Tag Manager -->
    <script type="text/partytown">(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-M6JDRD7');</script>
    <!-- End Google Tag Manager -->`
        : ''
    }
  </head>
  <body>
    ${
      config.TAG_MANAGER
        ? `<!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M6JDRD7"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->`
        : ''
    }
    
    ${config.TITLE ? `<h1>${config.TITLE}</h1>` : ''}

    <table>
      <tr>
        <th>Number of CPUs:</th>
        <td>${os.cpus().length}</td>
      </tr>
      <tr>
        <th>CPU Usage:</th>
        <td>${convertBytes(cpuUsageStats.user + cpuUsageStats.system)}</td>
      </tr>
      <tr>
        <th>1 Min Load Average:</th>
        <td>${Math.floor(loadAverages[0] * 100)}%</td>
      </tr>
      <tr>
        <th>5 Min Load Average:</th>
        <td>${Math.floor(loadAverages[1] * 100)}%</td>
      </tr>
      <tr>
        <th>15 Min Load Average:</th>
        <td>${Math.floor(loadAverages[2] * 100)}%</td>
      </tr>
      <tr>
        <th>Total Memory:</th>
        <td>${convertBytes(os.totalmem())}</td>
      </tr>
      <tr>
        <th>Free Memory:</th>
        <td>${convertBytes(os.freemem())} (${(
    os.totalmem() / os.freemem()
  ).toFixed(2)}%)</td>
      </tr>
      <tr>
        <th>Heap Total:</th>
        <td>${convertBytes(memoryUsageStats.heapTotal)}</td>
      </tr>
      <tr>
        <th>Heap Used:</th>
        <td>${convertBytes(memoryUsageStats.heapUsed)}</td>
      </tr>
      <tr>
        <th>Resident Set Size:</th>
        <td>${convertBytes(memoryUsageStats.rss)}</td>
      </tr>
      ${
        config.START_TIME
          ? `<tr>
        <th>Request Processing Time:</th>
        <td>${`${
          Number(hrtime.bigint() - config.START_TIME) / 1000000
        } milliseconds`}</td>
      </tr>`
          : ''
      }
    </table>
  </body>
  </html>`;
}
