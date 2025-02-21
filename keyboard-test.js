import fs from 'fs';
import { chromium } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import csv from 'csv-parser';

const params = {
  filePath : './outputs/uniques_by_url.csv',
  columnName : 'External URL'
}

const urls = await new Promise((resolve, reject) => {
  const results = [];
  fs.createReadStream(params.filePath)
  .pipe(csv())
  .on('data', (data) => {
    // console.log(data);
    const columnData = data[params.columnName];

    switch (columnData) {
      case 'null':
        break;
      default:
        results.push(columnData)
        break;
    }
  })
  .on('end', () => {
    // console.log(results);
    resolve(results);
  })
  .on('error', (error) => {
      console.error('Error reading CSV file:', error);
  });
})

// console.log(results);



// process.exit();


// // List of URLs to scan
// const urls = [
//   'https://example.com',
//   'http://3dgb.cs.mcgill.ca/',
//   'http://bioinfo.au.tsinghua.edu.cn/member/nadhir/HiC3DViewer/',
//   'http://www.bioinformatics.org/strap/aa',
//   'https://github.com/ihh/abrowse',
//   'http://www.abrowse.org/',
// ];

const assessUrls = async (urls) => {
    const browser = await chromium.launch({headless: false});
    const context = await browser.newContext();
    const page = await context.newPage();
  let results = [];

  for (const url of urls) {
    try {
      console.log(`Testing: ${url}`);
      await page.goto(url, { waitUntil: 'load' });
  
      // Run axe-core analysis and filter keyboard-related issues
      const axe = new AxeBuilder({ page });
      const axeResults = await axe.analyze();
      
      const keyboardViolations = axeResults.violations.filter(v => 
        v.tags.includes('cat.keyboard') // only the issues tagged cat.keyboard
      );
  
      results.push({ 
        url, 
        violations: keyboardViolations
      });
  
      console.log(`Finished testing: ${url}`);
    } catch (error) {
      console.error(error);
    }
  }

  fs.writeFileSync('outputs/keyboard-accessibility-results.json', JSON.stringify(results, null, 2));

  console.log('Results saved to keyboard-accessibility-results.json');
  await browser.close();
};


assessUrls(urls)