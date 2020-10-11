const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

/* ----------------------------------------------------------
https://pspdfkit.com/blog/2019/generate-invoices-pdfkit-node/
---------------------------------------------------------- */

function generateHeader(invoice) {
    invoice
      .image("public/img/logo.jpg", 50, 45, { width: 50 })
      .fillColor("#444444")
      .fontSize(20)
      .text("Keramika Rosice", 110, 57)
      .fontSize(10)
      .text("123 Main Street", 200, 65, { align: "right" })
      .text("New York, NY, 10025", 200, 80, { align: "right" })
      .moveDown();
  }
  
function generateFooter(invoice) {
    invoice
        .fontSize(10)
        .text(
        "Payment is due within 15 days. Thank you for your business.",
        50,
        780,
        { align: "center", width: 500 }
        );
}

module.exports = (order, path) => {
    let invoice = new PDFDocument({ margin: 50 });

    generateHeader(invoice);
    /* generateCustomerInformation(invoice, order);
    generateInvoiceTable(invoice, order); */
    generateFooter(invoice);
  
    invoice.end();
    invoice.pipe(fs.createWriteStream(path));
}