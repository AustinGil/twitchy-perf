import { convertBytes } from './utils.js';

/** @param {number} count */
function heavyLoad(count) {
  if (count >= 100) {
    count = 100;
  }
  count = (count / 100) * 1000;
  let b = [];
  for (let x = 1; x < count + 1; x++) {
    for (let y = 1; y < count + 1; y++) {
      for (let z = 1; z < count; z++) {
        var _arr = {};
        var _obj = [];
        var _ttl = x + y + z;
        _obj[_ttl] = x * y * z * x + x * y * z * y + x * y * z * z;
        _arr[`${x},${y},${z}`] = _obj[x + y + z];
        b.push(_arr);
      }
    }
  }
  return b;
}

/**
 * @param {{
 * URL: URL,
 * TITLE?: string,
 * START_TIME?: bigint,
 * END_TIME?: bigint,
 * LOAD_AVERAGES: [number, number, number],
 * CPU_NUM: number,
 * CPU_USAGE: { user: number, system: number }
 * TOTAL_MEM: number,
 * FREE_MEM: number,
 * MEMORY_USAGE: { heapTotal: number, heapUsed: number, rss: number }
 * }} config
 */
export default function (config) {
  const query = config.URL.searchParams;

  /** @type {number|string|null} */
  let load = query.get('cpu-load');

  if (load) {
    load = Math.floor(Math.max(0, Math.min(100, Number(load))));
    heavyLoad(load);
  }

  const js = {
    scripts: query.getAll('js-scripts'),
    partytown: query.has('js-partytown'),
  };
  const img = {
    optimized: query.has('img-optimized'),
    lazy: query.has('img-lazy'),
    format: query.get('img-format'),
    decode: query.get('img-decode'),
  };

  return `<html>
  <head>
    <link href="/public/css/tailwind.css" rel="stylesheet">
    ${
      js.partytown
        ? `<script>
        partytown = {
          debug: true,
          lib: '/public/~partytown/',
          forward: ['dataLayer.push'],
        };
      </script>
      <script type="text/javascript" src="/public/~partytown/partytown.js"></script>
      <!-- <script>
        /* Inlined Partytown Snippet */
      </script> -->`
        : ''
    }
    ${
      js.scripts.includes('sentry')
        ? `<script type="${
            js.partytown ? 'text/partytown' : 'text/javascript'
          } "
      src="https://browser.sentry-cdn.com/7.8.0/bundle.min.js"
      integrity="sha384-PVOy/EiuuBcf464HEXLzrIR872jZ4k78GhHPH9YhXiXR0/E/s1FTIOv1rlZ792HR"
      crossorigin="anonymous"
    ></script>`
        : ''
    }

    ${
      js.scripts.includes('cdnjs')
        ? `<script type="${
            js.partytown ? 'text/partytown' : 'text/javascript'
          } " src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js" integrity="sha512-WFN04846sdKMIP5LKNphMaWzU7YpMyCU245etK3g/2ARYbPK9Ub18eG+ljU96qKRCWh+quCY7yefSmlkQw1ANQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <script type="${
    js.partytown ? 'text/partytown' : 'text/javascript'
  }" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>`
        : ''
    }
  
    ${
      js.scripts.includes('tag-manager')
        ? `<!-- Google Tag Manager -->
    <script type="${
      js.partytown ? 'text/partytown' : 'text/javascript'
    } ">(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
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
      js.scripts.includes('tag-manager')
        ? `<!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M6JDRD7"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->`
        : ''
    }
    
    ${
      config.TITLE
        ? `<header class="bg-blue-500">
          <h1 class="max-w-lg m-auto py-4 px-2 text-4xl text-white">${config.TITLE}</h1>
        </header>`
        : ''
    }

    <main class="max-w-lg mx-auto my-8 px-2">
      <form>
        <fieldset class="mb-4">
          <legend>Scripts</legend>
          <div>
            <input id="tag-manager" name="js-scripts" value="tag-manager" type="checkbox"${
              js.scripts.includes('tag-manager') ? ' checked' : ''
            } />
            <label for="tag-manager">Google Tag Manager</label>
          </div>
          <div>
            <input id="sentry" name="js-scripts" value="sentry" type="checkbox"${
              js.scripts.includes('sentry') ? ' checked' : ''
            } />
            <label for="sentry">Sentry</label>
          </div>
          <div>
            <input id="cdnjs" name="js-scripts" value="cdnjs" type="checkbox"${
              js.scripts.includes('cdnjs') ? ' checked' : ''
            } />
            <label for="cdnjs">CDNJS</label>
          </div>
          <div>
            <input id="partytown" name="js-partytown" type="checkbox"${
              js.partytown ? ' checked' : ''
            } />
            <label for="partytown">Use Partytown.js to offload script to workers</label>
          </div>
        </fieldset>

        <fieldset class="mb-4">
          <legend>Images</legend>
          <div>
            <input id="img-optimized" name="img-optimized" value="img-optimized" type="checkbox"${
              img.optimized ? ' checked' : ''
            } />
            <label for="img-optimized">Optimized</label>
          </div>
          <div>
            <input id="img-lazy" name="img-lazy" type="checkbox"${
              img.lazy ? ' checked' : ''
            } />
            <label for="img-lazy">Lazy load</label>
          </div>
          <div>
            <label for="img-format">Format:</label>
            <select id="img-format" name="img-format">
              <option value="">Default (jpg/png)</option>
              <option value="webp"${
                img.format === 'webp' ? ' selected' : ''
              }>webp</option>
              <option value="avif"${
                img.format === 'avif' ? ' selected' : ''
              }>avif</option>
            </select>
          </div>
          <div>
            <label for="img-decode">Decoding:</label>
            <select id="img-decode" name="img-decode">
              <option value="">Auto (default)</option>
              <option value="sync"${
                img.decode === 'sync' ? ' selected' : ''
              }>Sync</option>
              <option value="async"${
                img.decode === 'async' ? ' selected' : ''
              }>Async</option>
            </select>
          </div>
        </fieldset>

        <fieldset class="mb-4">
          <legend>Compute</legend>
          <div>
            <label for="cpu-load">Synthetic load (0-30)</label>
            <input id="cpu-load" name="cpu-load" type="number" min="0" max="30" value="${
              load ? load : ''
            }" />
          </div>
        </fieldset>

        <button type="submit" class="border-2 border-blue-500 py-1 px-3">Submit</button>
      </form>
      <table class="w-full mb-8">
        <tr>
          <th>Number of CPUs:</th>
          <td>${config.CPU_NUM}</td>
        </tr>
        <tr>
          <th>CPU Usage:</th>
          <td>${convertBytes(
            config.CPU_USAGE.user + config.CPU_USAGE.system
          )}</td>
        </tr>
        <tr>
          <th>1 Min Load Average:</th>
          <td>${Math.floor(config.LOAD_AVERAGES[0] * 100)}%</td>
        </tr>
        <tr>
          <th>5 Min Load Average:</th>
          <td>${Math.floor(config.LOAD_AVERAGES[1] * 100)}%</td>
        </tr>
        <tr>
          <th>15 Min Load Average:</th>
          <td>${Math.floor(config.LOAD_AVERAGES[2] * 100)}%</td>
        </tr>
        <tr>
          <th>Total Memory:</th>
          <td>${convertBytes(config.TOTAL_MEM)}</td>
        </tr>
        <tr>
          <th>Free Memory:</th>
          <td>${convertBytes(config.FREE_MEM)} (${(
    (config.FREE_MEM / config.TOTAL_MEM) *
    100
  ).toFixed(2)}%)</td>
        </tr>
        <tr>
          <th>Heap Total:</th>
          <td>${convertBytes(config.MEMORY_USAGE.heapTotal)}</td>
        </tr>
        <tr>
          <th>Heap Used:</th>
          <td>${convertBytes(config.MEMORY_USAGE.heapUsed)}</td>
        </tr>
        <tr>
          <th>Resident Set Size:</th>
          <td>${convertBytes(config.MEMORY_USAGE.rss)}</td>
        </tr>
        ${
          config.START_TIME
            ? `<tr>
          <th>Request Processing Time:</th>
          <td>${`${
            Number(config.END_TIME - config.START_TIME) / 1000000
          } milliseconds`}</td>
        </tr>`
            : ''
        }
      </table>

      <div class="grid justify-items-center">
        <img src="/public/img/profile-pic.png" alt="Austin Gil" width="300" height="300" loading="${
          img.lazy ? 'lazy' : 'eager'
        }" decode="${img.decode || 'auto'}" >
        <img src="/public/img/Cloud Computing Blog Cover.png" alt="Cloud Computing Blog Cover" width="600" height="300" loading="${
          img.lazy ? 'lazy' : 'eager'
        }" decode="${img.decode || 'auto'}" >
        <img src="/public/img/Command-Line-Blog-Cover.png" alt="Command Line Blog Cover" width="600" height="300" loading="${
          img.lazy ? 'lazy' : 'eager'
        }" decode="${img.decode || 'auto'}" >
        <img src="/public/img/Opinion Blog Cover.png" alt="Opinion Blog Cover" width="600" height="300" loading="${
          img.lazy ? 'lazy' : 'eager'
        }" decode="${img.decode || 'auto'}" >
      </div>
    </main>
  </body>
  </html>`;
}
