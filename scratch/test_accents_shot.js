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
  '--window-size=1440,1100',
  'http://localhost:8080/index.html'
]);

async function run() {
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

  ws.onopen = async () => {
    await send('Page.enable');
    
    // Screenshot 1: Home page Focus Cards
    let shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot && shot.result && shot.result.data) {
      fs.writeFileSync(path.join(__dirname, 'shot_home_accents.png'), Buffer.from(shot.result.data, 'base64'));
      console.log('Saved shot_home_accents.png');
    }

    // Screenshot 2: Services page
    await send('Page.navigate', { url: 'http://localhost:8080/services.html' });
    await new Promise(r => setTimeout(r, 1000));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot && shot.result && shot.result.data) {
      fs.writeFileSync(path.join(__dirname, 'shot_services_accents.png'), Buffer.from(shot.result.data, 'base64'));
      console.log('Saved shot_services_accents.png');
    }

    // Screenshot 3: Contact Youth Tab
    await send('Page.navigate', { url: 'http://localhost:8080/contact.html?form=children' });
    await new Promise(r => setTimeout(r, 1000));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot && shot.result && shot.result.data) {
      fs.writeFileSync(path.join(__dirname, 'shot_contact_youth.png'), Buffer.from(shot.result.data, 'base64'));
      console.log('Saved shot_contact_youth.png');
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

run().catch(e => {
  console.error(e);
  chromeProc.kill();
});
