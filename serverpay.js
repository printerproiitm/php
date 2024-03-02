import { createWriteStream, promises as fsPromises } from 'fs';
import path, { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument } from 'pdf-lib';
import Jimp from 'jimp';

const ipAddress = '10.42.66.25';
const port = 7400;

import express from 'express';
import cors from 'cors';

import fileupload from 'express-fileupload';
const app = express();
app.use(fileupload());
app.use(
  cors({
    origin: '*',
  })
);

app.post('/printer-website', async (req, res) => {
  console.log('here');
  let files = req.files;
  if (!files) res.send({ message: 'No files sent' });
  let file = files.inpFile;
  const fileExtName = extname(file.name);
  console.log(fileExtName);

  const fileName =
    1 + '.pdf';
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const filePath = join(__dirname, 'uploads', file.name);
  const pdfFilePath = join(__dirname, 'uploads', fileName);

  // Write the uploaded file
  const writeStream = createWriteStream(filePath);
  writeStream.write(file.data);
  writeStream.end();

  await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });

  try {
    let pdfDoc = await PDFDocument.create(); // Initialize PDF document

    if (fileExtName.toLowerCase() === '.pdf') {
      // For PDF files, directly read and append pages into the new PDF
      const uploadedPdfBytes = await fsPromises.readFile(filePath);
      const externalPdf = await PDFDocument.load(uploadedPdfBytes);
      const copiedPages = await pdfDoc.copyPages(externalPdf, externalPdf.getPageIndices());
      copiedPages.forEach((page) => pdfDoc.addPage(page));
    } else if (fileExtName.toLowerCase() === '.png') {
      // For PNG files, rotate landscape images to portrait orientation
      const image = await Jimp.read(filePath);
      if (image.bitmap.width > image.bitmap.height) {
        image.rotate(90); // Rotate the image by 90 degrees
      }
      await image.writeAsync(filePath);

      // Now, proceed to embed the PNG image into the PDF document
      const pngData = await fsPromises.readFile(filePath);
      const pngImage = await pdfDoc.embedPng(pngData); // Embed the PNG image into the PDF document
      
      // Add a page to the PDF document with dimensions based on the image
      const page = pdfDoc.addPage([pngImage.width, pngImage.height]);
      
      // Draw the PNG image onto the page
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: pngImage.width,
        height: pngImage.height,
      });
    } else {
      throw new Error('Unsupported file type');
    }

    // Write the PDF document to a file
    const pdfBytes = await pdfDoc.save();
    await fsPromises.writeFile(pdfFilePath, pdfBytes);

    window.location.href = "/Users/vervypotato/elec club/basic/project/testpay/thankyou.html"
    //res.send('File converted and uploaded as PDF!');
  } catch (error) {
    console.error('Error converting file to PDF:', error);
    res.status(500).send('Error converting file to PDF');
  }
});

app.get('/', (req, res) => {
  res.send('hello');
});

app.listen(port, () => {
  console.log('server is listening on port ' + port);
});






