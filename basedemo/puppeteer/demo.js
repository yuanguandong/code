const puppeteer = require('puppeteer-extra');
const repl = require('puppeteer-extra-plugin-repl')();

// 截图
const screenShot = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  const a = await page.screenshot({ path: 'example.png' });
  await browser.close();
}

// 执行脚本
const doScript = async () => {
  await page.goto('https://www.all1024.com', {
    waitUntil: 'networkidle2',
  });
  console.log('a', a)
  await page.pdf({ path: '1024.pdf', format: 'a4' });
  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio,
    };
  });
  console.log('Dimensions:', dimensions);
}

// 代理
const proxyUrl = async () => {
  const browser = await puppeteer.launch({
    // Launch chromium using a proxy server on port 9876.
    // More on proxying:
    //    https://www.chromium.org/developers/design-documents/network-settings
    args: ['--proxy-server=127.0.0.1:8000']
  });
  const page = await browser.newPage();
  await page.goto('http://baidu.com');
  await browser.close();
}

// 自动填表单
const fillForm = async () => {
  const browser = await puppeteer.launch();
  // 调试可见
  // const browser = await puppeteer.launch({
  //   headless: false,
  //   executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  //   args: ['--start-maximized']
  //   //launch这里将浏览器设置为非无头模式，且这里设置启动本机安装的chrome，如果这里不设置，还需要下载chromium，这里请设置你自己本机的chrome浏览器
  // });
  const page = await browser.newPage();
  // 地址栏输入网页地址
  await page.goto('https://baidu.com/', {
    waitUntil: 'networkidle2',
  });

  // 输入搜索关键字
  await page.type('#kw', '腾讯公司', {
    delay: 1000, // 控制 keypress 也就是每个字母输入的间隔
  });

  // 回车
  await page.keyboard.press('Enter');
}

fillForm()