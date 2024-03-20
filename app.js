const puppeteer = require('puppeteer');
const fs = require('fs');

async function printPDF() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://healios.org.uk/about/', {waitUntil: 'networkidle0'});
    const pdf = await page.pdf({ format: 'A4' });
 
    await browser.close();
    return pdf;
}

printPDF().then(function(pdf) {
    const outputFileName = '/tmp/test.pdf';
    console.log('PDF Buffer:', pdf);
    fs.writeFile(outputFileName, pdf, function(err) {
        if (err) {
            console.error('Error writing PDF to file:', err);
            return;
        }
        console.log('PDF written to', outputFileName);

        const { exec } = require('child_process');
        exec('open ' + outputFileName, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(stdout);
        });
    });    
});