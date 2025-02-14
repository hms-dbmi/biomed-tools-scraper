## Scrapes Genocat, Awesome-Tools-Visualization, and Awesome-Biological-Visualizations.

### Setup

```bash
npm install
````

1. Update config in main.js

2. Run the scraper:
```
node main.js
```

- Scrapes Genocat, Awesome-Tools-Visualization, and Awesome-Biological-Visualizations.
- Collects tool `name`, `url`, `source`, and additional metadata
- Generates CSV files in `outputs/` directory
  - default :
    - combined : `outputs/combined.csv`
    - uniques (by URL) : `outputs/uniques_by_url.csv`
    

Finally, `outputs/uniques_by_url.csv` is duplicated into `outputs/uniques_by_url_manually_pruned.csv`, which is manually cleaned (TODO).