const { PDFDocument, StandardFonts, rgb }= require('pdf-lib');
const fs = require('fs');
const { runMain } = require('module');
const { pathToFileURL } = require('url');

run().catch(err => console.log(err));

//Creation of pdf
// async function run(){
//     //create a new document and add a new page
//     const doc= await PDFDocument.create();
//     const page= doc.addPage();

//     //Load the image and store it as a Node.js buffer in memory
//     let img= fs.readFileSync('./logo.png');
//     img= await doc.embedPng(img);

//     //Draw the image on the centre of the page
//     const { width, height }= img.scale(1);
//     page.drawImage( img,{
//         x: page.getWidth()/2 - width/2,
//         y: page.getHeight()/2 - height/2
//     });

//     //write the pdf to a file
//     fs.writeFileSync('./test.pdf', await doc.save());

// }


//Merge Pdfs

// async function run(){
//     //Load cover and content pdfs
//     const cover = await PDFDocument.load(fs.readFileSync('./cover.pdf'));
//     const content = await PDFDocument.load(fs.readFileSync('./page-30-31.pdf'));

//     //Create a new document
//     const doc = await PDFDocument.create();

//     //Add the cover to the new doc
//     const [coverPage] = await doc.copyPages(cover, [0]);
//     doc.addPage(coverPage);

//     //Add individual content pages
//     const contentPages = await doc.copyPages(content, content.getPageIndices());
//     for (const page of contentPages){
//         doc.addPage(page);
//     }

//     //write the PDF to a file
//     fs.writeFileSync('./test.pdf',await doc.save());

// }


//Adding indices to each page of a pdf
// async function run(){
//     const content = await PDFDocument.load(fs.readFileSync('./content.pdf'));

    //Add a font to the doc
    // const helveticaFont = await content.embedFont(StandardFonts.Helvetica);

    // //Draw a number at the bottom of each page
    // //Note that the bottom of the page is y=0,not the top
    // const pages= await content.getPages();
    // for (const [i, page] of Object.entries(pages)){
    //     page.drawText(`${+i +1}`,{
    //         x: page.getWidth()/2,
    //         y:10,
    //         size : 15,
    //         font : helveticaFont,
    //         color : rgb(0,0,0)

    //     });
    // }

    // //write the PDF to a file
    // fs.writeFileSync('./test.pdf', await content.save());
// }

//Merging 5 pdfs
async function run(){
    var pdfBuffer1= fs.readFileSync('./cover.pdf');
    var pdfBuffer2= fs.readFileSync('./page-30-31.pdf');
    var pdfBuffer3= fs.readFileSync('./content.pdf');
    var pdfBuffer4= fs.readFileSync('./dummy.pdf');
    var pdfBuffer5= fs.readFileSync('./file-sample_150kB.pdf');

    var pdfsToMerge = [pdfBuffer1,pdfBuffer2,pdfBuffer3,pdfBuffer4,pdfBuffer5];

    const mergedPdf= await PDFDocument.create();
    for (const pdfBytes of pdfsToMerge) {
        const pdf = await PDFDocument.load(pdfBytes);
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
            });
        });
    });
}



