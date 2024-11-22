const puppeteer = require('puppeteer');
const UTILS = require('./utils');

module.exports = async ({ url, name = 'file.png', width = 1366 }) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width,
    height: 768
  });
  await page.goto(url, {
    waitUtil: 'networkidle2'
  });
  await UTILS.waitTillHTMLRendered(page);
  console.log('开始截图……')
  const res = await page.screenshot({ path: name, fullPage: true });
  console.log('完成截图')
  await browser.close();
  return res

}