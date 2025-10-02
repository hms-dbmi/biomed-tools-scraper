## Automated evaluation

	1. 
		- Scrape: `genocat`, `awesome-biological-visualizations`, and `awesome-genome-visualization` for web-based data visualization tools
	 2. 
		- Save web links to combined CSV
		- Clean the combined CSV
	3.
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
### Scraper code
	```
	root
	├── ...
	├── main.js
	├── ...
	└── scrapers
	    ├── scrape-awesome-biological-visualizations.js
	    ├── scrape-awesome-tools-visualization.js
	    └── scrape-genocat.js
	```

---
### Run Scrapers
	```
	$ node main.js
	```

---
### Scraped data
	```
	root
	└── outputs
	│   ├── awesome-biological-visualizations_results.csv
	│   ├── awesome-tools-visualization_results.csv
	│   ├── ...
	│   ├── genocat_results.csv
	│   └── ...
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
### Cleaned data
	```
	root
	└── outputs
	│   ├── combined.csv
	│   ├── uniques_by_url.csv
	│   ├── uniques_by_url_manually_pruned.csv
	│   └── ...
	└── ...
	```

---
### Data cleaning outputs
	```
	   awesome-biological-visualizations_results.csv 
	 + awesome-tools-visualization_results.csv       
	 + genocat_results.csv                           
	 ──────────────────────────────────────────────────
	 = combined.csv 
		└──> uniques_by_url.csv
				└──> uniques_by_url_manually_pruned.csv
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

---

### Next: 
	- Manually check URLs to ensure they are all pointing to data apps and not their landing pages
	- Graph ranges and averages

---

	TODO:
	1. Consider proposals for individuals with disabilities to participate in manual evaluation
	- Present a proposal for determining severity and defining the scope of accessibility issues as identified by Axe analysis
	- Finalize plans and approaches for interpreting Axe results and determining the potential impact of OpenKeyNav
	- Start designing a metric to assess the impact of OpenKeyNav on accessibility issues
	- Discuss plans for study and draft a plan for IRB submission focused on recruitment and study execution
	- Identify disabilities to focus on
	- If time permitting, try to do the same for your projects



Re: Start designing a metric to assess the impact of OpenKeyNav on accessibility issues -- I'm still concerned that this is about turning OKN into an overlay, which is tone deaf.

---

### 6. Identify disabilities to focus on
	- People with motor disabilities, aka: Individuals who primarily use a keyboard over a mouse, a trackpad, or other pointing devices on desktops or laptops due to personal preferences or temporary or permanent motor disabilities (e.g., arthritis, repetitive strain injury (RSI), broken/fractured bone, cerebral palsy (CP)).

Manual assessment: ~3 people

Inclusion criteria (on Slack)

COME BACK TO THIS

For the sake of having bigger numbers: "the average person" / typical user?

Establishing a baseline: If someone is slow using a keyboard.

Pre-screening: 
- [ ] Take a look into projects or studies that are doing something similar. What are people typically doing to do motor disabilities. There might be some established process.

Where to start looking? Maybe ASSETS conference? They might mention the study protocol.

Onboarding: 
- 

We have all of these websites designed for interaction with a mouse. In theory an AI could use a mouse too. Computationally move stuff around. 

Compare performance of an agent on pure voyager on a website without openkeynav integrated, if it has better performance, then it's an example because we're building something because it does simplify the interaction. When you have a mouse, you [ here are the things you can interact with, and how ]

Not retrofitting, putting this additional layer.

Maybe the title for the paper would be effective website navigation for machine and human / AI and humans. 

Another reason why it matters.

Sehi didn't realize we will be recruiting a small number.

We can purposefully recruit people with and without disabilities.

~12 - 20. Depends on design of the study.

The number of people depends on what we want to show. If we have two to compare, say here's the website without, and then with, and then compare quantitatively their performance,

Alternatively: compare someone with a mouse vs without a mouse. We could take able-bodied individuals, try to do it with / without a mouse, probably find that someone is

Claims:
- We know how many websites need solutions like this one
- We wanted to try to measure how many problems OpenKeyNav can fix and expose through keyboard interactions
- Could probably get away with qualitative evaluation, that things that would otherwise 

We're showing there is a way to address this problem, we don't have to go quantitatively into it.

Depending on venue: in context of more scientific software, bioinformatics. If you want to send to ASSETS. 


Re: size:
- Small number, qualitative, get quotes?
- Sehi - really depends on venue. If ASSETS, mention that user study is preliminary study.
- Go for smaller numbers. Easier, will lead more quickly to conclusion for the paper.

Then we can talk for a moment about a potential venue:
- One opportunity for us is to bring this into the comp bio / life sciences space. 
- Nobody has looked at this problem, but it's very much workforce related.
- Maybe also AI-related?
- What are people thinking about opportunities right now? They're thinking about wow I can build an AI system that can interact with these websites and generate new knowledge.
- ...
- We're proposing a system that will enhance performance of AI-based agents on life science websites. When we could send to venue like Bioinformatics and make the claim. Then we would need to show it. We would need to show performance of AI-based systems.
- Sellability: anything accessibility-related is a hard task right now. AI-related is an easy sell.
- Nils - I do think the discussion about the retreat, let's make these AI-ready data resources. We're adding these layers that make them more accessible to AI, and other software technologies. We're talking about defining this layer, building this layer. Not only assistive technology will use this layer but AI agents as well.
- We could start to move this direction and start demonstrating this.
- When we already established in our analysis paper, there are all of these websites and tools that won't be rebuilt to be more accessible to AI / technology. We can make these things more useful for others if we have this smartly-built layer.
- Can you compare whatever AI system you used on the interaction with OpenKeyNav, does the performance get improved?
- Think we're better off pitching this to bioinformatics community (people who build software for biomedical data), accessibility community (ASSETS), CHI. Trying to get this into a venue focused on tool builders.
- Humans + AI









---

## 2. Present a proposal for determining severity and defining the scope of accessibility issues as identified by Axe analysis
	### Scope:
	The proposal is to classify Axe issues as keyboard-related or not. A heuristic:
	- If it's WCAG S.C.: 
		- 1.3.1 Info and Relationships
		- 1.3.2 Meaningful Sequence
		- 1.4.13 Content on Hover or Focus
		- 2.1.x, 
			- 2.1.1 Keyboard
			- 2.1.2 No Keyboard Trap
			- 2.1.3 Keyboard (No Exception) (Level AAA)
			- 2.1.4 Character Key Shortcuts
		- 2.2.1 Timing Adjustable
		- 2.4.1 Bypass Blocks
		- 2.4.3 Focus Order
		- 2.4.7 Focus Visible
		- 2.5.1 Pointer Gestures
		- 2.5.3 Label in Name
		- 3.2.1 On Focus
		- 3.2.2 On Input
		- 3.2.5 Change on Request (Level AAA)
		- 3.3.2 Labels or Instructions
		- 4.1.2 Name, Role, Value
	- If AXE classifies it as Cat.keyboard
	### Severity:
	SiteImprove, Axe, etc all classify WCAG issues by severity, which include keyboard violations. If there is a need to reinvent the wheel, it is to classify by relevance to completing the common tasks of biomedical data tools.

Aaaaaaaaaaaaaaaaaah 
---



### Keyboard-related WCAG Success Criteria (Direct)
//---
	- **SC 2.1.1 Keyboard**: Ensures all functionality of the content is operable through a keyboard interface without requiring specific time-based keystrokes, unless the underlying function depends on the input's path rather than just endpoints.
// ---
	- **SC 2.1.2 No Keyboard Trap**: Ensures users can navigate to any component on the webpage using a keyboard and can exit the component using the keyboard without becoming trapped.
// ---
	- **SC 2.1.3 Keyboard (No Exception) (Level AAA)**: Extends **SC 2.1.1** by requiring that all functionality is operable through the keyboard with no exceptions, even for those functions that depend on path-dependent input.
// ---
	- **SC 2.1.4 Character Key Shortcuts**: Added in WCAG 2.1, this criterion ensures that where keyboard shortcuts use a single character key, there is a way to turn off or remap the shortcut, which prevents accidental activation and provides flexibility in how users interact with content.
// ---
	- **SC 2.4.3 Focus Order**: Ensures that when navigating a webpage, the focus follows a meaningful order that preserves the user's expected sequence of interaction and operation.
// ---
	- **SC 2.4.7 Focus Visible**: Ensures there is a visible indication when an interface element receives keyboard focus, so users can keep track of their location on a page when navigating via keyboard.
---

### Keyboard-related WCAG Success Criteria (Indirect)
	- 	**SC 1.3.1 Info and Relationships**: Ensures that information and relationships conveyed through presentation are programmatically determinable, which can facilitate keyboard navigation by providing a logical structure and clear relationships between elements that screen readers can convey.
	1. 	**SC 1.3.2 Meaningful Sequence**: Focuses on presenting content in a meaningful sequence, which is crucial for keyboard users who rely on a logical tab order to navigate through content.
	1. **SC 1.4.13 Content on Hover or Focus**: Though more about display on focus, this criterion helps ensure that additional content triggered by keyboard navigation can be dismissed with the same method, supporting seamless keyboard use.
	1. **SC 2.2.1 Timing Adjustable**: Requires that users have control over time limits required by content, which indirectly benefits keyboard users by allowing more time for navigation and interaction.
	1. **SC 2.4.1 Bypass Blocks**: This helps users bypass blocks of content that are repeated on multiple web pages. Although not directly about keyboard interaction, providing ways to skip directly to content can significantly enhance the user experience for individuals navigating by keyboard.
	1. **SC 2.5.1 Pointer Gestures**: While this criterion is more focused on touch and pointer-based interactions, keyboard users benefit from ensuring alternative interaction methods are available, emphasizing that non-pointer means (like keyboards) are equally capable of navigating complex interactions.

	- **SC 2.5.2 Pointer Cancellation**: Ensures that functions can be canceled or aborted before completion, a principle that applies generally but supports design strategies that consider various interaction methods, including keyboards.
	8. **SC 2.5.3 Label in Name**:Ensures that the visible label of user interface components matches their accessible name. It is particularly important for users who navigate by keyboard and rely on assistive technologies.
	1. **SC 3.2.1 On Focus**: Prevents unexpected changes of context when a component receives focus, which is important when navigating using a keyboard. Users should not experience unexpected behavior or navigation changes when tabbing through elements.
	1. **SC 3.2.2 On Input**: Prevents changes in context when user inputs are entered, such as text fields or dropdowns. For keyboard users, it's critical that the focus does not move unexpectedly when interacting by tabbing or entering inputs.
	1. **SC 3.2.5 Change on Request (Level AAA)**: Ensures that changes of context are initiated only by a user request, which can help avoid unexpected navigation shifts for keyboard users.
	1. **SC 3.3.2 Labels or Instructions**: Provides necessary labels and instructions, which helps orient keyboard users, especially when filling out forms.
	1. **SC 4.1.2 Name, Role, Value**: Ensures that user interface components have appropriate names, roles, and states that are programmatically determinable and can be set by user agents, which is important for assistive technologies used alongside keyboard navigation.

AI Generated. Check! 

---


## 3. Finalize plans and approaches for interpreting Axe results and determining the potential impact of OpenKeyNav
	### Interpreting Axe results:
	- Same as 2
	### Determining the potential impact of openKeyNav:
	Before-and-after evaluations:
	##### 1. Manual integration with user studies
	(Quantify `user's productivity` without openKeyNav -> Quantify `user's productivity` on a tool with openKeyNav set up)
	 - Measure success of completing tasks before and after integrating openKeyNav (or with and without)
	##### 2. Accessibility Overlay w/ automated evaluation
	(Quantify violations w/ Axe -> Use Javascript to automatically modify source code after pageload -> Measure w/ Axe)
	- Not novel.
	- Frowned upon by accessibility community, including experts and end-users.
	- (see **overlayfactsheet.com**)

--- 

	#### What is a web accessibility overlay?

	"Overlays are a broad term for technologies that aim to improve the accessibility of a website. They apply third-party source code (typically JavaScript) to make improvements to the front-end code of the website." 
	-- overlayfactsheet.com

---

There is an entire industry designed to profit from the desires of organizations to spend as little money as possible on accessibility.

	#### Some examples of web accessibility overlays (by alphabetical order):
	- AccessiBe
	- Accessibility Adapter
	- Accessiblelink
	- Accessiplus
	- Accessiway
	- Adally
	- Adapte Mon Web (Adapt my Web)
	- AdaptifY
	- Allyable
	- Alchemy*
	- Amaze
	- AudioEye
	- Bakh Fix
	- DIGIaccess

	- Eye-Able.com
	- Equally.ai
	- EqualWeb
	- FACIL'iti
	- MaxAccess
	- Poloda AI
	- Purple Lens
	- ReciteME
	- RentCafe
	- Sentinel*
	- TruAbilities
	- True Accessibility
	- UsableNet Assistive
	- UserWay
	- WebAbility
	- *: denotes that these products are no longer developed or marketed. 
- 
---

	#### Strengths and weaknesses of automated repair
	 `While some automated repair is possible, customers should be discouraged from using an overlay as a long-term solution.`
	
	Some overlay products have capabilities aimed at providing accessibility repairs to the underlying page on which the overlay is added. **These repairs are applied when the page loads in the user’s browser**.
	While it is true that a non-trivial array of accessibility problems can be repaired in this manner, the nature, extent, and accuracy of such repair are limited by a number of important factors:
	- Automated application of text alternatives for images is not reliable
	- Automated repair of field labels, error management, error handling, and focus control on forms is not reliable
	- **Automated repair of keyboard access is not reliable**
	- Modern, component-based user interfaces, such as those using ReactJS, Angular, or Vue may change the state of all or some of the underlying page independently of the overlay, rendering it unable to fix those JavaScript-driven changes to content
	- Repairs to the page can either slow down page load times or cause unexpected page changes for assistive technology users.
	In addition to the above, overlays do not repair content in Flash, Java, Silverlight, PDF, HTML5 Canvas, SVG, or media files.

---
	 "Overlay widgets are unnecessary and are poorly placed in the technology stack."
	
	openKeyNav is designed as a **pre-deployment intervention** to be *implemented* by web developers during development.

---

### 4. Start designing a metric to assess the impact of OpenKeyNav on accessibility issues
	 - In progress: Manual user studies: a productivity-related metric (Success rate? Speed?)

---

	## 1. Consider proposals for individuals with disabilities to participate in manual evaluation
	...
	...

---

### 5. Discuss plans for study and draft a plan for IRB submission focused on recruitment and study execution

---

### 7. If time permitting, try to do the same for your projects
	 ... Time has not yet been permitting

---




