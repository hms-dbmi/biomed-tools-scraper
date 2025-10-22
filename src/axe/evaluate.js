import fs from 'fs';
import { chromium } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import csv from 'csv-parser';

const DATA_FOLDER = './data/scrapers';
const OUTPUT_FOLDER = './data/axe';
const FILE_PATH = `${DATA_FOLDER}/app-urls.csv`;
const URL_COLUMN = 'Data App URL';
const OUTPUT_FILE = 'keyboard-accessibility-results-1.json'
const LOG_FILE = 'log.txt'


// logging messages and errors
fs.writeFileSync(`${OUTPUT_FOLDER}/${LOG_FILE}`, "");

const log = (message) => {
  console.log(message);
  fs.appendFileSync(`${OUTPUT_FOLDER}/${LOG_FILE}`, `[${new Date().toISOString()}] LOG: ${message}\n`);
};

const logError = (message, error) => {
  if (message) {
    fs.appendFileSync(`${OUTPUT_FOLDER}/${LOG_FILE}`, `[${new Date().toISOString()}] ERROR: ${message}\n`);
  }
  if (error) {
    fs.appendFileSync(`${OUTPUT_FOLDER}/${LOG_FILE}`, `[${new Date().toISOString()}] ${error.stack || error}\n`);
  }
};


// retrieving tool URLs
const urls = await new Promise((resolve, reject) => {
  log("Start")
  const results = [];
  fs.createReadStream(FILE_PATH)
    .pipe(csv())
    .on('data', (data) => {
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
      resolve(results);
      log(`Number of tools: ${results.length}`)
    })
    .on('error', (error) => {
      logError('Error reading CSV file', error)
      reject(error);
    });
})


const results = []; 


const assessUrls = async (urls) => {
  const browser = await chromium.launch({headless: true});

  for (const {url, name} of urls) {

    if (!url || url=="n/a"){
      logError(`Tool ${name} - No URL`, false)
      continue;
    }

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Navigate to page
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      } catch (navigationError) {
        logError(`Tool ${name} - Navigation Error`, false);
        continue;
      }
  
      // Run axe-core analysis
      try {
        await runAxeCoreAnalysis(page, name, url);
      } catch (analysisError) {
        logError(`Tool ${name} - Axe Time-Out`, analysisError);
      }
      
    } catch (error) {
      logError(`Tool ${name} - Unexpected Error`, error);
    } finally {
      await page.close(); // Close the page after finishing
      await context.close(); // Close the context to clean up
    }
  }
  await browser.close();
};

const runAxeCoreAnalysis = async (page, name, url) => {  
  const axe = new AxeBuilder({ page });
  // const axeResults = await axe.analyze();
  const axeResults = await withTimeout(axe.analyze(), 30000); // 30 seconds timeout

  if (!axeResults){
    throw new error("axe.analyze() timeout");
  }

  const result = { 
    name,
    url, 
    axeResults
  };

  results.push(result);
}

// Utility function to add timeout to any promise
const withTimeout = (promise, time, timeoutError = new Error('Operation timed out')) => {
  let timer;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(timeoutError), time);
    })
  ]);
};

await assessUrls(urls);
fs.writeFileSync(`${OUTPUT_FOLDER}/${OUTPUT_FILE}`, JSON.stringify(results, null, 2));
