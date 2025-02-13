// scrapes the awesome-biological-visualizations website for web-based tools and creates a CSV with headings [ Name, Internal URL, External URL ]

import { chromium } from '@playwright/test';
import fs from 'fs';

export const scrapeAwesomeBiologicalVisualizations = async function (OUTPUT_FILE, {HEADLESS,DELAY_MS,MAX_CONCURRENT}) {
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
        await page.goto('https://github.com/keller-mark/awesome-biological-visualizations');

        // Get all tools on page
        const tools = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('article ul:not(:first-of-type) li'))
                .map(tool => {
                    const nameElement = tool.querySelector('a'); // Tool name inside <h3>
                    const urlElement = tool.querySelector('a[href^="http"]:not([href*="doi.org"])'); // First valid external URL
        
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