// scrapes the genocat website (rate-limited) for web-based tools and creates a CSV with headings [ Name, Internal URL, External URL ]

import { chromium, expect } from '@playwright/test';
import fs from 'fs';
const source = "genocat";

export const scrapeGenocat = async function (OUTPUT_FILE, {HEADLESS,DELAY_MS,MAX_CONCURRENT}) {
    // Launch browser
    const browser = await chromium.launch({
        headless: HEADLESS
    }); // Set to true for headless mode
    const context = await browser.newContext();
    const page = await context.newPage();

    // Ensure CSV file starts with a header
    fs.writeFileSync(OUTPUT_FILE, 'Name,Source,Internal URL,External URL\n');

    try {
        // Navigate to the website
        await page.goto('http://genocat.tools/');

        // Wait for and click the filter aside element
        await page.waitForSelector('aside.aside-3 a[href="/#filter"]');
        await page.click('aside.aside-3 a[href="/#filter"]');

        // Click user preferences
        await page.waitForSelector('text="User Preferences"');
        await page.click('text="User Preferences"');

        // Wait for the "web application" checkbox and click it
        await page.waitForSelector('text="Web Application"');
        await page.click('text="Web Application"');

        // Click the Done button
        const doneLink = page.locator('#filter a:has-text("Done")');
        await expect(doneLink).toBeVisible(); // Ensures it's visible before clicking
        await doneLink.click();

        // Wait for the page to update with filtered results
        await page.waitForTimeout(2000); // Adjust timeout as needed

        // Get all internal Genocat tool links
        const internalLinks = await page.evaluate(() => {
            const linkElements = document.querySelectorAll('article.main .items h3 a');
            return Array.from(linkElements).map(link => ({
                name: link.textContent.trim(),
                internalUrl: link.href
            }));
        });

        console.log(`Found ${internalLinks.length} tools.`);

        // Process in batches to prevent server overload
        for (let i = 0; i < internalLinks.length; i += MAX_CONCURRENT) {
            const batch = internalLinks.slice(i, i + MAX_CONCURRENT);

            await Promise.all(batch.map(async (item) => {
                await new Promise(resolve => setTimeout(resolve, Math.random() * DELAY_MS)); // Randomized delay
                const toolPage = await context.newPage();

                try {
                    await toolPage.goto(item.internalUrl, {
                        waitUntil: 'domcontentloaded'
                    });

                    // Extract external "Tool Link"
                    const externalLink = await toolPage.evaluate(() => {
                        const linkElement = document.querySelector('tr td.labelCol + td a[target="_blank"]');
                        return linkElement ? linkElement.href : 'N/A';
                    });

                    // Append result to CSV as we go
                    fs.appendFileSync(OUTPUT_FILE, `"${item.name}","${source}","${item.internalUrl}","${externalLink}"\n`);
                } catch (error) {
                    console.error(`Failed to fetch ${item.internalUrl}:`, error);
                } finally {
                    await toolPage.close();
                }
            }));
        }

        console.log(`Data continuously written to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await browser.close();
    }
}