const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(__dirname, 'chrome_temp_profile');

async function captureUrl(url, outName) {
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    url
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const listRes = await fetch('http://127.0.0.1:9222/json');
  const pages = await listRes.json();
  const page = pages[0];
  if (!page) {
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

  return new Promise((resolve) => {
    ws.onopen = async () => {
      await send('Page.enable');
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      if (shot && shot.result && shot.result.data) {
        fs.writeFileSync(path.join(__dirname, outName), Buffer.from(shot.result.data, 'base64'));
        console.log(`Saved ${outName}`);
      }
      ws.close();
      chromeProc.kill();
      resolve();
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && callbacks.has(data.id)) {
        callbacks.get(data.id)(data);
        callbacks.delete(data.id);
      }
    };
  });
}

async function main() {
  await captureUrl('http://localhost:8080/coaches.html', 'coaches_screenshot.png');
  await new Promise(r => setTimeout(r, 800));
  await captureUrl('http://localhost:8080/contact.html', 'contact_screenshot.png');
}

main().catch(console.error);
