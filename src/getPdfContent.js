const chrome = require("chrome-aws-lambda");
const AWS = require("aws-sdk");
const { upload_to_s3 } = require("./upload");
const { download_from_s3 } = require("./downloadPDF");
const { listAllKeys } = require("./listS3keys");

        
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,AWS_SESSION_TOKEN } = require("../utils/constants");


//For merging pdfs part
const { PDFDocument, StandardFonts, rgb }= require('pdf-lib');
const fs = require('fs');
const { runMain } = require('module');
const { pathToFileURL } = require('url');



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
    
    await page.goto(url, { waitUntil: "networkidle0" });
    console.log("directed to url print");
    // await page.waitFor("*");
    const [height] = await page.evaluate(() => [
      document.documentElement.offsetHeight,
    ]);
    
    const content = await page.pdf({
      path: 'sample_output.pdf',
      format: 'a4' ,
      printBackground: true,
      width: "50cm",
      height: height + 250, //250 added, was having some issues w.r.t pdf height
      scale: 1,
    });
    
    console.log("pdf created");
    // console.log("Pdf content is ",content);


    //Upload generated PDF to S3 Bucket
    const responseURL= await upload_to_s3({file: content})

    browser.close();
    console.log("browser closed");
    return responseURL;
  } catch (err) {
    console.log(err)
    return {status: "Error", statusCode: err.code, message: err.message}
  }
  
};




module.exports.mergePDF = async function(event){
  try {


    const keyNames = await listAllKeys('ivms-testing-pdf1', 'created/', 'merged/');
    const mergedPdf= await PDFDocument.create();

    for(var i=0;i<keyNames.length;i++){
      const key = keyNames[i];
      var data = await download_from_s3({name: key.substring("/created".length)});
      var pdfBuffer= data.Body;

      const pdf = await PDFDocument.load(pdfBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf,pdf.getPageIndices());
      copiedPages.forEach((page)=>{
          mergedPdf.addPage(page);
      });

    }
    const buf = await mergedPdf.save();

    let path= 'merged.pdf';
    fs.open(path, 'w', function(err,fd){
        fs.write(fd,buf,0,buf.length, null, function(err){
            fs.close(fd,function(){
                  console.log('wrote the file successfully');
                  // return buf;
              });
          });
      });
      // throw Error("Internal Error")
      // console.log(buf)
      return { status: "Success"};
  } catch (error) {
    console.log(error)
  }
}