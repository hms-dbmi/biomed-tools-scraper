# Data in Keyboard Accessibility Analysis
We have three data folders.

## Scrapers
Most of these files are created by running the script in `src/scrapers/scrape.js`.The unique urls were then manually pruned by our team, which resulted in `app-urls.csv`. This is the file used in subsequent analysis.

## Axe
Axe accessibility analysis was run on all tools in `app-urls.csv`, using the script in `scr/axe/evaluate.js`. The results are too large for GitHub, but available on Google Drive [here](https://drive.google.com/file/d/18wfkKZmkA-cM6KUVLTfny77OLYSUaFSJ/view?usp=sharing).However, not all axe outputs are necessary. With the `compress.ipynb` notebook we created two smaller files, which are used for further analysis.

## Inscidar
This folder includes issues from the [INSCIDAR](https://inscidar.org) project, used for comparative analysis here.
