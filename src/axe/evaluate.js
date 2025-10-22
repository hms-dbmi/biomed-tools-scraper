import fs from 'fs';
import { chromium } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import csv from 'csv-parser';

const DATA_FOLDER = './data/scrapers';
const OUTPUT_FOLDER = './data/axe';
const FILE_PATH = `${DATA_FOLDER}/app-urls.csv`;
const URL_COLUMN = 'Data App URL';


const urls = await new Promise((resolve, reject) => {
  const results = [];
  fs.createReadStream(FILE_PATH)
  .pipe(csv())
  .on('data', (data) => {
    // console.log(data);
    const columnData = { 
      'name' : data["Name"], 
      'url' : data[URL_COLUMN]
    };

    switch (columnData.url) {
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
    reject(error);
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

  for (const {url, name} of urls) {

    if(!url || url=="n/a"){
      continue;
    }

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      console.log(`Testing: ${url}`);
      
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      } catch (navigationError) {
        console.error(`Error navigating to URL ${url}:`, navigationError);
        continue; // Skip to the next URL on failure
      }
  
      // Run axe-core analysis
      try {
        await runAxeCoreAnalysis(page, name, url);
      } catch (analysisError) {
        console.error('Error during Axe analysis:', analysisError);
      }
      
      console.log(`Finished testing: ${url}`);
    } catch (error) {
      console.error('Unexpected error while testing the URL:', error);
    } finally {
      await page.close(); // Close the page after finishing
      await context.close(); // Close the context to clean up
    }
  }
  await browser.close();
};

const runAxeCoreAnalysis = async (page, name, url) => {
  // let results = [];

  // console.log("running axe-core analysis");
        
  const axe = new AxeBuilder({ page });
  // const axeResults = await axe.analyze();
  const axeResults = await withTimeout(axe.analyze(), 30000); // 30 seconds timeout
  // const keyboardViolations = axeResults.violations.filter(v => 
  //   v.tags.includes('cat.keyboard')
  // );

  if(!axeResults){
    throw new error("axe.analyze() timeout");
  }

  const result = { 
    name,
    url, 
    // keyboardViolations,
    axeResults
  };

  fs.appendFileSync(`${OUTPUT_FOLDER}/keyboard-accessibility-results.json`, ""+JSON.stringify(result, null, 2)+",");

  console.log('Results saved to keyboard-accessibility-results.json');
}

// Utility function to add timeout to any promise
const withTimeout = (promise, time, timeoutError = new Error('Operation timed out')) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(timeoutError), time))
  ]);
};

fs.writeFileSync(`${OUTPUT_FOLDER}/keyboard-accessibility-results.json`, "[");
assessUrls(urls);
fs.appendFileSync(`${OUTPUT_FOLDER}/keyboard-accessibility-results.json`, "]");