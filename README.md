# Scraper and Keyboard tester

## Scraper

Scrapes Genocat, Awesome-Tools-Visualization, and Awesome-Biological-Visualizations.

### Setup

```bash
npm install
```

1. Update config in main.js

2. Run the scraper:

```bash
node main.js
```

- Scrapes Genocat, Awesome-Tools-Visualization, and Awesome-Biological-Visualizations.
- Collects tool `name`, `url`, `source`, and additional metadata
- Generates CSV files in `outputs/` directory
  - default :
    - combined : `outputs/combined.csv`
    - uniques (by URL) : `outputs/uniques_by_url.csv`


Finally, `outputs/uniques_by_url.csv` is duplicated into `outputs/uniques_by_url_manually_pruned.csv`, which is manually cleaned (TODO).

## Keyboard tester

```
node keyboard-test.js
```

## Notebook for data analysis (optional)

### Setup Jupyter notebook

```
pip install jupyterlab
npm install -g ijavascript
ijsinstall
jupyter lab
```


## Automated evaluation

### 1.
	Scrape: `genocat`, `awesome-biological-visualizations`, and `awesome-tools-visualization` for web-based data visualization tools
### 2.
	- Save web links to combined CSV
	- Clean the combined CSV
### 3.
	 - For each URL, run an automated accessibility checker, such as AXE.

---

### Codebase
```
scraper % tree .
.
├── README.md
├── analysis.ipynb
├── keyboard-test.js
├── main.js
├── node_modules
│   ├── ...
├── outputs
│   ├── awesome-biological-visualizations_results.csv
│   ├── awesome-tools-visualization_results.csv
│   ├── combined.csv
│   ├── genocat_results.csv
│   ├── impact_levels_doughnut_chart.html
│   ├── keyboard-accessibility-results.json
│   ├── uniques_by_url.csv
│   ├── uniques_by_url_manually_pruned.csv
│   ├── violation_heatmap.html
│   ├── violation_histogram.html
│   ├── violation_types_chart.html
│   ├── violations_chart.html
│   └── ...
├── package-lock.json
├── package.json
└── scrapers
    ├── scrape-awesome-biological-visualizations.js
    ├── scrape-awesome-tools-visualization.js
    └── scrape-genocat.js
```

---

### Scrapers
	```
	root
	├── main.js
	└── scrapers
	    ├── scrape-awesome-biological-visualizations.js
	    ├── scrape-awesome-tools-visualization.js
	    └── scrape-genocat.js
	```
	```
	$ node main.js
	```

### Saved data
	```
	root
	└── outputs
	    ├── [DATASource].csv
	    └── ...
	```

---

### Scraper output
``` 
// genocat_results.csv

Name,Source,Internal URL,External URL
"3D Genome Browser","genocat","http://genocat.tools/tools/3d_genome_browser/","http://3dgb.cs.mcgill.ca/"
"3dViewer","genocat","http://genocat.tools/tools/3dviewer/","http://bioinfo.au.tsinghua.edu.cn/member/nadhir/HiC3DViewer/"
"ABrowse","genocat","http://genocat.tools/tools/abrowse/","http://www.abrowse.org/"
"Apollo","genocat","http://genocat.tools/tools/apollo/","https://github.com/GMOD/Apollo"
"Alvis","genocat","http://genocat.tools/tools/alvis/","https://bitbucket.org/rfs/alvis/src/master/"
...
```

---

### Keyboard accessibility measurements
	```
	root
	└── keyboard-test.js
	```
	```
	$ node keyboard-test.js
	```

### Saved data
	```
	root
	└── outputs
	    └── keyboard-accessibility-results.json
	```

---

### Output (Axe)
```
[
  {
    "url": "http://3dgb.cs.mcgill.ca/",
    "violations": [
      {
        "id": "nested-interactive",
        "impact": "serious",
        "tags": [
          "cat.keyboard",
          "wcag2a",
          "wcag412",
          "TTv5",
          "TT6.a",
          "EN-301-549",
          "EN-9.4.1.2"
        ],
        "description": "Ensure interactive controls are not 
        nested as they are not always announced by screen 
        readers or can cause focus problems for assistive 
        technologies",
        "help": "Interactive controls must not be nested",
        "helpUrl": "https://dequeuniversity.com/rules/axe/
        4.10/nested-interactive?application=playwright",
        "nodes": [ ... ]
  }]},
  ...
]
        
```

---

### Analysis
	```
	root
	└── analysis.ipynb
	```

### Generated Graphs
	```
	root
	└── outputs
	    ├── [Graph].html
	    └── ...
	```

---

	http://127.0.0.1:3000/outputs/violation_histogram.html
	

/assets/Screen Shot 2025-02-21 at 16.16.01.png
size: contain
filter: darken

---

	http://127.0.0.1:3000/outputs/violation_types_chart.html
/assets/Screen Shot 2025-02-21 at 16.19.42.png
size: contain
filter: darken

---
	http://127.0.0.1:3000/outputs/violation_heatmap.html
/assets/Screen Shot 2025-02-21 at 16.21.38.png
size: contain
filter: darken

---
	http://127.0.0.1:3000/outputs/impact_levels_doughnut_chart.html
/assets/Screen Shot 2025-02-21 at 16.24.55.png
size: contain
filter: darken



---

### Common types of errors found so far ...
	- `region`
		- "Ensure all page content is contained by landmarks"
	- `nested interactive`
		- "Ensure interactive controls are not nested as they are not always announced by screen readers or can cause focus problems for assistive technologies"
	- `scrollable-region-focusable`
		- "Ensure elements that have scrollable content are accessible by keyboard"
	- `tabindex`
		- "Ensure tabindex attribute values are not greater than 0"
		- note this won't catch tabindex=-1 issues 
	- `skip-link`
		- "Ensure all skip links have a focusable target"

