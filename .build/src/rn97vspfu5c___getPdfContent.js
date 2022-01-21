const chrome = require("chrome-aws-lambda");
// const urlToPrint="https://www.google.com/";
const aws = require("aws-sdk")
module.exports.printPDF = async (event) => {
  try {
    const body = JSON.parse(event.body)
    const url = body.url
    console.log("getting pdf content started");
  const browser = await chrome.puppeteer.launch({
    ignoreHTTPSErrors: true,
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: true,
    devtools: false,
    defaultViewport: {
      width: 1792,
      height: 1041,
    },
  });
  console.log("browser created");
  const page = await browser.newPage();
  console.log("page created");
  // await page.goto(baseUrl + "?view=export", {
  //   waitUntil: "networkidle0",
  // });

  // await page.evaluate(
  //   ({ authToken, printViewState }) => {
  //     localStorage.setItem("authToken", authToken);
  //     localStorage.setItem("view", "export");
  //     localStorage.setItem("printViewState", printViewState);
  //   },
  //   { authToken, printViewState }
  // );
  // console.log("authtoken and state set");
  // await page.waitForTimeout(4000);
  const aws_params = {
    ACCESS_KEY: "",
    ACCESS_SECRET: ""
  }
  aws.config(aws_params);

  await aws.s3.upload(params, data);
  

  await page.goto(url, { waitUntil: "networkidle0" });
  console.log("directed to url print");
  // await page.waitFor("*");
  const [height] = await page.evaluate(() => [
    document.documentElement.offsetHeight,
  ]);
  // await page.pdf({ path: 'hn.pdf', format: 'a4' });
  const content = await page.pdf({
    printBackground: true,
    width: "50cm",
    height: height + 250, //250 added, was having some issues w.r.t pdf height
    scale: 1,
  });
  console.log("pdf created");
  browser.close();
  console.log("browser closed");
  return content;
  } catch (err) {
    console.log(err)
    return {status: "Error", statusCode: err.code, message: err.message}
  }
  
};