

const puppeteer = require('puppeteer-extra');
const repl = require('puppeteer-extra-plugin-repl')();

async function showREPL() {
  await puppeteer.use(repl);
  //固定写法，表示puppeteer要使用repl插件

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--start-maximized']
    //launch这里将浏览器设置为非无头模式，且这里设置启动本机安装的chrome，如果这里不设置，还需要下载chromium，这里请设置你自己本机的chrome浏览器
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1366,
    height: 768
  });
  await page.goto('https://example.com');
  //默认打开上面的网页

  await page.repl();
  //在page对象上开启交互的REPL，这样可以实时看到page上提供的方法执行结果，执行效果见下图所示

  //在page对象上开启交互的REPL，这样可以实时看到page上提供的方法执行结果

  await browser.repl();
  //在browser对象上开启交互的REPL，这样可以实时看到page上提供的方法执行结果

  await browser.close();


}
showREPL();