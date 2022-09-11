// 判断页面加载完成
const waitTillHTMLRendered = async (page, timeout = 10000) => {
  console.log('页面加载中...')
  const checkDurationMsecs = 1000;
  const maxChecks = timeout / checkDurationMsecs;
  let lastHTMLSize = 0;
  let checkCounts = 1;
  let countStableSizeIterations = 0;
  const minStableSizeIterations = 3;

  while (checkCounts++ <= maxChecks) {
    let html = await page.content();
    let currentHTMLSize = html.length;
    let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);
    console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);
    if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
      countStableSizeIterations++;
    else
      countStableSizeIterations = 0; //reset the counter

    if (countStableSizeIterations >= minStableSizeIterations) {
      console.log("页面完成加载!");
      checkCounts = maxChecks + 2
      break;
    }
    lastHTMLSize = currentHTMLSize;

    await page.waitForTimeout(checkDurationMsecs);
  }
};




module.exports = {
  waitTillHTMLRendered
}