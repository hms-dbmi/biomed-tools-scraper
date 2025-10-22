import { scrapeGenocat } from "./scrape-genocat.js";
import { scrapeAwesomeToolsVisualization } from "./scrape-awesome-tools-visualization.js";
import { scrapeAwesomeBiologicalVisualizations } from "./scrape-awesome-biological-visualizations.js";
import fs from 'fs';

// Configurable settings
const DATA_FOLDER = './data/scrapers';

const params = {
    HEADLESS : true, // Set to false for debugging
    DELAY_MS : 3000, // Throttle delay (3 seconds)
    MAX_CONCURRENT : 10, // Number of pages to open at a time
    COMBINED_CSV_PATH :`${DATA_FOLDER}/combined.csv`,
    UNIQUE_CSV_PATH : `${DATA_FOLDER}/uniques_by_url.csv`,
    PRIMARY_KEY_COLUMN : 3 // column 3 is the url
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

const runScrapers = async function ({COMBINED_CSV_PATH}) {
    try {

        // run scrapers
        await Promise.all([
            scrapeGenocat(`${DATA_FOLDER}/genocat_results.csv`, params),
            scrapeAwesomeToolsVisualization(`${DATA_FOLDER}/awesome-tools-visualization_results.csv`, params),
            scrapeAwesomeBiologicalVisualizations(`${DATA_FOLDER}/awesome-biological-visualizations_results.csv`, params)
        ]);
        
        // create the merged CSV
        mergeCSVFiles(
            [
                `${DATA_FOLDER}/genocat_results.csv`,
                `${DATA_FOLDER}/awesome-tools-visualization_results.csv`,
                `${DATA_FOLDER}/awesome-biological-visualizations_results.csv`
            ],
            COMBINED_CSV_PATH
        );

        console.log("Scraping completed.");
    } catch (error) {
        console.error("Error during scraping:", error);
    }
}

const processCSV = function ({COMBINED_CSV_PATH, UNIQUE_CSV_PATH, PRIMARY_KEY_COLUMN}) {
    const content = fs.readFileSync(COMBINED_CSV_PATH, 'utf8').trim();
    const lines = content.split('\n');

    if (lines.length < 2) {
        console.error('CSV file is empty or has no data rows.');
        return;
    }

    const header = lines[0]; // Extract header row
    const rows = lines.slice(1); // Extract data rows

    const seenFields = new Map(); // Map to track duplicates
    let absoluteUniques = [];

    rows.forEach(row => {
        const columns = row.split(','); // Split row into columns
        const key = columns[PRIMARY_KEY_COLUMN]?.trim().toLowerCase().replace("https://","").replace("http://","").replace("www.",""); // Normalize key field (e.g., External URL)

        if (!key || key === "null" || key === '"null"') {
            seenFields.set(columns[0]?.trim().toLowerCase(), row);
        } else {
            seenFields.set(key, row); // Always store the latest occurrence of the key
        }
    });

    // Collect unique rows from the map
    absoluteUniques = [...seenFields.values()];

    // Sort by the first column (case-insensitive)
    absoluteUniques.sort((a, b) => {
        const nameA = a.split(',')[0]?.trim().toLowerCase();
        const nameB = b.split(',')[0]?.trim().toLowerCase();
        return nameA.localeCompare(nameB);
    });

    // Write the final absolute unique CSV
    fs.writeFileSync(UNIQUE_CSV_PATH, [header, ...absoluteUniques].join('\n'), 'utf8');
    console.log(`Absolute uniques saved to ${UNIQUE_CSV_PATH}`);
}

await runScrapers(params);

processCSV(params);
