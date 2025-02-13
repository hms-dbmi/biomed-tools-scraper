// scrapes the awesome-tools-visualization website for web-based tools and creates a CSV with headings [ Name, Internal URL, External URL ]

import { chromium } from '@playwright/test';
import fs from 'fs';

export const scrapeAwesomeToolsVisualization = async function (OUTPUT_FILE, {HEADLESS,DELAY_MS,MAX_CONCURRENT}) {
    // Launch browser
    const browser = await chromium.launch({
        headless: HEADLESS
    }); // Set to true for headless mode
    const context = await browser.newContext();
    const page = await context.newPage();

    // Ensure CSV file starts with a header
    // if (!fs.existsSync(OUTPUT_FILE)) { // only  if it doesn’t exist
    fs.writeFileSync(OUTPUT_FILE, 'Name,Internal URL,External URL\n');
    // }

    try {
        // Navigate to the website
        await page.goto('https://cmdcolin.github.io/awesome-genome-visualization/');

        // Wait for and click the filter aside element
        await page.waitForSelector('#platform-select');
        await page.selectOption('#platform-select', 'Web');
        // document.querySelector(`select#platform-select`).value = 'Web'

        // Wait for the page to update with filtered results
        await page.waitForTimeout(2000); // Adjust timeout as needed

        // Get all filtered tools on page
        const tools = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('#root > div > div.mt-6 > div'))
                .map(tool => {
                    const nameElement = tool.querySelector('h3 a'); // Tool name inside <h3>
                    const urlElement = tool.querySelector('p > a[href^="http"]:not([href*="doi.org"])'); // First valid external URL
        
                    return {
                        name: nameElement ? nameElement.textContent.trim() : null,
                        url: urlElement ? urlElement.href : null
                    };
                });
        });
        
        console.log(`Found ${tools.length} tools.`);

        let toolsCSVString = "";

        tools.map( (tool,i) => {
            toolsCSVString += `"${tool.name}","","${tool.url}"\n`;
        });

        
        try {
            fs.appendFileSync(OUTPUT_FILE, toolsCSVString);
        } catch (error) {
            console.error(`❌ Failed to write to ${OUTPUT_FILE}:`, error);
        }

        console.log(`✅ Data written to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('❌ An error occurred:', error);
    } finally {
        await browser.close();
    }
}