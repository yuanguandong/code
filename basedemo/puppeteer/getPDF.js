const puppeteer = require('puppeteer');

module.exports = async function getPDF({ url }) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox", // linux系统中必须开启
      "--no-zygote",
      // "--single-process", // 此处关掉单进程
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--disable-extensions",
      "--disable-file-system",
      "--disable-background-networking",
      "--disable-default-apps",
      "--disable-sync", // 禁止同步
      "--disable-translate",
      "--hide-scrollbars",
      "--metrics-recording-only",
      "--mute-audio",
      "--safebrowsing-disable-auto-update",
      "--ignore-certificate-errors",
      "--ignore-ssl-errors",
      "--ignore-certificate-errors-spki-list",
      "--font-render-hinting=medium",
    ]
  });
  // try...catch...
  try {
    const page = await browser.newPage();
    await page.goto(url, {
      waitUtil: 'networkidle2'
    });
    // 页眉模板（图片使用base64，此处的src的base64为占位值）
    const headerTemplate = ``
    // 页脚模板（pageNumber处会自动注入当前页码）
    const footerTemplate = ``;
    // 对于大的PDF生成，可能会时间很久，这里规定不会进行超时处理
    await page.setDefaultNavigationTimeout(0);
    // 定义html内容
    // await page.setContent(this.HTMLStr, { waitUntil: "networkidle2" });
    // 等待字体加载响应
    await page.evaluateHandle("document.fonts.ready");
    let pdfbuf = await page.pdf({
      // 页面缩放比例
      scale: 1,
      // 是否展示页眉页脚
      // displayHeaderFooter: true,
      // pdf存储单页大小
      format: "a4",
      // 页面的边距
      // 页眉的模板
      // headerTemplate,
      // // 页脚的模板
      // footerTemplate,
      margin: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
      // 输出的页码范围
      pageRanges: "",
      // CSS
      preferCSSPageSize: true,
      // 开启渲染背景色，因为 puppeteer 是基于 chrome 浏览器的，浏览器为了打印节省油墨，默认是不导出背景图及背景色的
      // 坑点，必须加
      printBackground: true,
    });
    // 关闭browser
    await browser.close();
    // 返回的是buffer不需要存储为pdf，直接将buffer传回前端进行下载，提高处理速度
    return pdfbuf
  } catch (e) {
    await browser.close();
    throw e
  }
}

