import fs from 'fs';
import PDFDocument from 'pdfkit';

// Read the JSON file
import { jsonData } from '../docs/jsonData/data.js';

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream(`./docs/jsonoutput_${Date.now()}.pdf`));

// Loop through the JSON data and add it to the PDF document
for (var i = 0; i < jsonData.length; i++) {
  for (const key in jsonData[i]) {
    if (jsonData[i].hasOwnProperty(key)) {
      doc.text(`${key}: ${jsonData[i][key]}`);
    }
  }
}

doc.end();
