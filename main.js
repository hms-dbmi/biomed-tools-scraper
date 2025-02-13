import { scrapeGenocat } from "./scrapers/scrape-genocat.js";
import { scrapeAwesomeToolsVisualization } from "./scrapers/scrape-awesome-tools-visualization.js";
import { scrapeAwesomeBiologicalVisualizations } from "./scrapers/scrape-awesome-biological-visualizations.js";
import fs from 'fs';

// Configurable settings
const params = {
    HEADLESS : false, // Set to false for debugging
    DELAY_MS : 3000, // Throttle delay (3 seconds)
    MAX_CONCURRENT : 3 // Number of pages to open at a time
}

function mergeCSVFiles(inputFiles, outputFile) {
    let mergedCSV = [];
    let headerProcessed = false; // Track if we've added the header

    for (const file of inputFiles) {
        const content = fs.readFileSync(file, 'utf8').trim(); // Read and trim

        const [header, ...rows] = content.split('\n'); // Split into lines

        if (!headerProcessed) {
            mergedCSV.push(header); // Add header only once
            headerProcessed = true;
        }

        mergedCSV.push(...rows); // Append rows (ignore duplicate header)
    }

    fs.writeFileSync(outputFile, mergedCSV.join('\n'), 'utf8');
    console.log(`Merged CSV saved to ${outputFile}`);
}

const runScrapers = async function () {
    try {

        // Run the scraper for genocat
        await scrapeGenocat('outputs/genocat_results.csv', params); 

        // run the scraper for awesome-tools-visualization
        await scrapeAwesomeToolsVisualization('outputs/awesome-tools-visualization_results.csv', params);

        // run the scraper for awesome-biological-visualizations
        await scrapeAwesomeBiologicalVisualizations('outputs/awesome-biological-visualizations_results.csv', params);

        // 'outputs/combined.csv'
        mergeCSVFiles(
            [
                'outputs/genocat_results.csv',
                'outputs/awesome-tools-visualization_results.csv',
                'outputs/awesome-biological-visualizations_results.csv'
            ],
            'outputs/combined.csv'
        );

        console.log("Scraping completed. Exiting...");
        process.exit(0); // Ensures the script fully terminates
    } catch (error) {
        console.error("Error during scraping:", error);
        process.exit(1);
    }
}

runScrapers();