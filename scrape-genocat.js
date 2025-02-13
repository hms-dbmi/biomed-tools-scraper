const { chromium, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function scrapeGenocat() {
  // Launch browser
  const browser = await chromium.launch({ headless: false }); // Set to true for headless mode
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the website
    await page.goto('http://genocat.tools/');
    
    // Wait for and click the filter aside element
    await page.waitForSelector('aside.aside-3 a[href="/#filter"]');
    await page.click('aside.aside-3 a[href="/#filter"]');

    // click user preferences
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
    
    // Get all h3 elements with their associated links
    const results = await page.evaluate(() => {
        const linkElements = document.querySelectorAll('article.main .items h3 a');
        return Array.from(linkElements).map(link => {
            return {
              name: link.textContent.trim(),
              url: link ? link.href : ''
            };
        });
    });
    
    // Create CSV content
    const csvContent = ['Name,URL'];
    results.forEach(result => {
      csvContent.push(`"${result.name}","${result.url}"`);
    });
    
    // Write to CSV file
    const outputPath = path.join(__dirname, 'genocat_results.csv');
    fs.writeFileSync(outputPath, csvContent.join('\n'));
    
    console.log(`Results saved to ${outputPath}`);
    console.log(`Total items found: ${results.length}`);
    
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // Close browser
    await browser.close();
  }
}

// Run the script
scrapeGenocat();