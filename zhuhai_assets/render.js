const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const file = 'file://' + path.resolve(__dirname, '..', '珠海AI产业_小绿书.html');
  const outDir = path.resolve(__dirname, '..', 'zhuhai_png');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  await page.setViewportSize({ width: 1080, height: 1440 });
  await page.goto(file, { waitUntil: 'networkidle' });
  // ensure webfonts are ready
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);

  const ids = ['p01','p02','p03','p04','p05','p06','p07','p08','p09','p10'];
  for (const id of ids) {
    const el = await page.$('#' + id);
    const out = path.join(outDir, '珠海AI_' + id + '.png');
    await el.screenshot({ path: out });
    console.log('saved', out);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
