# Keyboard Accessibility Evaluation

This repository contains a keyboard accessibility evaluation for visualization tools. It contains scripts and notebooks to retrieve app urls for three visualization repositories ([GenoCAT](https://genocat.tools), [awesome-genome-visualization](https://cmdcolin.github.io/awesome-genome-visualization/), and [awesome-biological-visualizations](https://github.com/keller-mark/awesome-biological-visualizations)), retrieve AXE accessibility reports for each resource, and analyze these results.

## Setup

In order to re-run the analysis scripts, set-up as follows:

```bash
npm install
node src/scrapers/scrape.js
node src/axe/evaluate.js
```

In order to re-run the notebooks, set-up as follows:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install .
```

In order to recreate the dashboard, set-up as follows:

```bash
pip install jupyterlab
npm install -g ijavascript
ijsinstall
jupyter lab
```

## Team

This project is part of the [HIDIVE Lab](https://hidivelab.org).

- Lawrence Weru
- Sehi L'Yi
- Thomas Smits
- Nils Gehlenborg
