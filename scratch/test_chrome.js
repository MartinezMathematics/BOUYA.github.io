const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(__dirname, 'chrome_temp_profile');

const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  `--user-data-dir=${userDataDir}`,
  '--disable-gpu',
  '--no-sandbox',
  '--window-size=1440,900',
  'http://localhost:8080/index.html'
]);

async function run() {
  await new Promise(r => setTimeout(r, 1500));

  const listRes = await fetch('http://127.0.0.1:9222/json');
  const pages = await listRes.json();
  const page = pages.find(p => p.url.includes('localhost:8080'));
  if (!page) {
    console.log('Available pages:', pages);
    chromeProc.kill();
    return;
  }

  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let msgId = 1;
  const callbacks = new Map();

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      callbacks.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onopen = async () => {
    // Enable Page and Runtime
    await send('Runtime.enable');
    await send('Page.enable');

    // Check canvas element and canvas context
    const checkEval = await send('Runtime.evaluate', {
      expression: `(() => {
        const c = document.getElementById('proceduralMeshCanvas');
        if (!c) return { error: 'No canvas found' };
        const rect = c.getBoundingClientRect();
        return {
          id: c.id,
          width: c.width,
          height: c.height,
          clientWidth: c.clientWidth,
          clientHeight: c.clientHeight,
          rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
          computedOpacity: window.getComputedStyle(c).opacity,
          computedZIndex: window.getComputedStyle(c).zIndex,
          computedDisplay: window.getComputedStyle(c).display,
          computedVisibility: window.getComputedStyle(c).visibility
        };
      })()`,
      returnByValue: true
    });

    console.log('CANVAS INSPECTION RESULT:', JSON.stringify(checkEval.result.value, null, 2));

    // Capture screenshot
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot && shot.result && shot.result.data) {
      fs.writeFileSync(path.join(__dirname, 'screenshot.png'), Buffer.from(shot.result.data, 'base64'));
      console.log('Screenshot saved to screenshot.png');
    }

    ws.close();
    chromeProc.kill();
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && callbacks.has(data.id)) {
      callbacks.get(data.id)(data);
      callbacks.delete(data.id);
    }
  };
}

run().catch(err => {
  console.error(err);
  chromeProc.kill();
});
