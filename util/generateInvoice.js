const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

const helpers = require('./helpers');

const generateHeader = (invoice, order) => {
    let headingText = 'Faktura';
    if (order.isCanceled) headingText = 'Stornofaktura';

    const invoiceNumber = 'KR-' + order.variableSymbol.slice(0, -4) + '/' + order.variableSymbol.slice(-4);

    invoice
      .fillColor("#101010")
      .fontSize(24)
      .font('PTSans-Regular')
      .text(headingText, 50, 50)
      .fontSize(18)
      .text(`Číslo faktury: ${invoiceNumber}`, 0, 56, { align: "right" })
      .moveDown();
}

const generatePersonInformation = (invoice, order) => {
    invoice
        .rect(50, 100, 512, 135)
        .fill('#EEEEEE')
        .fillColor("#101010")
        .fontSize(10)
        .font('PTSans-Bold')
        .text('Dodavatel', 100, 125)
        .text('Odběratel', 306, 125)
        .moveDown();
    
    invoice
        .font('PTSans-Regular')
        .fontSize(10)
        .fillColor('#101010')
        .text('Vlastimila Nepevná', 100, 140)
        .text(`${order.firstName} ${order.lastName}`, 306, 140)
        .text('Havířská 956', 100, 155)
        .text(`${helpers.replaceHtmlEntities(order.street)}`, 306, 155)
        .text('Rosice 66501', 100, 170)
        .text(`${helpers.replaceHtmlEntities(order.city)} ${order.zipCode}`, 306, 170)
        .text('Česká Republika', 100, 185)
        .text(`Česká Republika`, 306, 185)
        .text('IČ: 12192520', 100, 200)
        .text(`Tel.: ${order.phone}`, 306, 200)
        .moveDown();
}

const generateInvoiceData = (invoice, order) => {
    const [ deliveryLabel, paymentLabel ] = helpers.getDelPayLabel(order.delivery, order.payment);

    const date = new Date(order.date);
    const readableDate = helpers.formatDate(date);

    const dueDate = new Date(date.getTime() + (1000 * 60 * 60 * 24 * 14));
    const readableDueDate = helpers.formatDate(dueDate);

    invoice
        // 1st column
        .font('PTSans-Bold')
        .fillColor('#101010')
        .fontSize(10)
        .text('Datum vystavení: ', 100, 260, {
            continued: true
        })
        .font('PTSans-Regular')
        .text(`${readableDate}`)
        .font('PTSans-Bold')
        .text('Datum splatnosti: ', 100, 275, {
            continued: true
        })
        .font('PTSans-Regular')
        .text(`${readableDueDate}`)
        .font('PTSans-Bold')
        .text('Způsob úhardy: ', 100, 290, {
            continued: true
        })
        .font('PTSans-Regular')
        .text(`${paymentLabel}`)
        .font('PTSans-Bold')
        .text('Způsob dopravy: ', 100, 305, {
            continued: true
        })
        .font('PTSans-Regular')
        .text(`${deliveryLabel}`)
        // 2nd column
        .font('PTSans-Bold')
        .fillColor('#101010')
        .fontSize(10)
        .text('Číslo účtu: ', 306, 260, {
            continued: true
        })
        .font('PTSans-Regular')
        .text(`43-5895350257/0100`)
        .font('PTSans-Bold')
        .text('Variabilní symbol: ', 306, 275, {
            continued: true
        })
        .font('PTSans-Regular')
        .text(`${order.variableSymbol}`)
        .font('PTSans-Bold')
        .text('Banka: ', 306, 290, {
            continued: true
        })
        .font('PTSans-Regular')
        .text(`Komerční banka`)
        .font('PTSans-Bold')
        .text('Název účtu: ', 306, 305, {
            continued: true
        })
        .font('PTSans-Regular')
        .text(`EFEKT`)
}

const generateProductsTable = (invoice, order) => {
    invoice
        // Heading
        .font('PTSans-Regular')
        .fontSize(10)
        .fillColor('#101010')
        .text('Objednávka z www.keramika-rosice.cz:', 65, 350)
        // Table head
        .font('PTSans-Bold')
        .fillColor('#101010')
        .fontSize(10)
        .text('Zboží', 65, 370)
        .text('Množství', 300, 370)
        .text('Jednotková cena', 400, 370)
        .text('Cena', 0, 370, { align: 'right' })
        .moveTo(50, 385)
        .lineTo(562, 385)
        .stroke();
    
    let deltaY = 0;
    
    order.items.forEach(item => {
        invoice
            // Item row
            .font('PTSans-Regular')
            .fillColor('#101010')
            .fontSize(10)
            .text(`${item.product.name}`, 65, 390 + deltaY)
            .text(`${item.amount}ks`, 300, 390 + deltaY)
            .text(`${item.product.price}Kč`, 400, 390 + deltaY)
            .text(`${item.product.price * item.amount}Kč`, 0, 390 + deltaY, { align: 'right' })
            .moveTo(50, 405 + deltaY)
            .lineTo(562, 405 + deltaY)
            .stroke();
        
        deltaY += 20;
    });

    const [ deliveryLabel, paymentLabel ] = helpers.getDelPayLabel(order.delivery, order.payment);
    let total = +order.total + +order.paymentCost + +order.deliveryCost;
    if (order.isCanceled) total = -total;

    invoice
        // Delivery row
        .font('PTSans-Regular')
        .fillColor('#101010')
        .fontSize(10)
        .text(`Doručení: ${deliveryLabel}`, 65, 390 + deltaY)
        .text(`${order.deliveryCost}Kč`, 0, 390 + deltaY, { align: 'right' })
        // Payment row
        .text(`Platba: ${paymentLabel}`, 65, 410 + deltaY)
        .text(`${order.paymentCost}Kč`, 0, 410 + deltaY, { align: 'right' })
        .moveTo(50, 425 + deltaY)
        .lineTo(562, 425 + deltaY)
        .stroke()
        // Summary row
        .font('PTSans-Bold')
        .fillColor('#101010')
        .fontSize(10)
        .text(`Celkem k úhradě:`, 65, 430 + deltaY)
        .text(`${total}Kč`, 0, 430 + deltaY, { align: 'right' });

    invoice
        .font('PTSans-Bold')
        .fillColor('#101010')
        .fontSize(10)
        .text('Dodavatel není plátce DPH.', 65, 470 + deltaY)
}

module.exports = (order, invoicePath) => {

    let invoice = new PDFDocument({ margin: 50 });

    invoice.registerFont('PTSans-Regular', path.join(__dirname, '/../public/fonts/PTSans-Regular.ttf'));
    invoice.registerFont('PTSans-Bold', path.join(__dirname, '/../public/fonts/PTSans-Bold.ttf'));

    generateHeader(invoice, order);
    generatePersonInformation(invoice, order);
    generateInvoiceData(invoice, order);
    generateProductsTable(invoice, order);
    
    invoice.end();
    invoice.pipe(fs.createWriteStream(invoicePath));
}