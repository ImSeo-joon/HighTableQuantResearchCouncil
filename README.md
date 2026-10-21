# High Table Quantitative Finance Research Council

高桌量化金融研究委员会 · 中英法日多语言版

This is a static, dependency-free website designed for GitHub Pages. Japanese is the default language; visitors can switch among Japanese, English, Chinese and French from the header, and the choice is remembered in their browser. The Chinese interface uses locally bundled Noto Sans SC and Noto Serif SC subsets, so typography does not depend on a third-party font service.

The council is positioned as a full-finance research and career platform, using quantitative methods as a lens rather than limiting coverage to quantitative roles.

The site is also an installable PWA. On supported desktop and mobile browsers, use **Install desktop app** in the top bar or the browser's **Install app / Add to Home Screen** action to create a standalone shortcut.

The homepage is a module directory rather than a compressed long page. Independent routes include research, labs, competitions, companies, careers, interview lab, concept lab and investment simulator.

## Preview locally

Because the site is fully static, opening `index.html` directly works in most browsers. For a local server:

```powershell
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Publish to GitHub Pages

1. Create a GitHub repository and upload every file and folder in this directory to the repository root.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and the `/ (root)` folder, then save.
5. GitHub will provide the published URL after the first deployment.

The `.nojekyll` file is included so GitHub Pages serves the static assets directly.

## Project structure

```text
HighTableQuantResearchCouncil/
├── index.html
├── .nojekyll
├── manifest.webmanifest
├── sw.js
├── README.md
└── assets/
    ├── css/styles.css
    ├── js/
    │   ├── app.js
    │   ├── fr-i18n.js
    │   └── ja-i18n.js
    ├── fonts/
    │   ├── high-table-sans-sc.woff2
    │   ├── high-table-serif-sc.woff2
    │   └── LICENSE-NOTO.txt
    └── img/
        ├── site-background.jpg
        ├── site-background-ja.jpg
        ├── logo-192.png
        ├── logo-512.png
        ├── logo-mark-192.png
        ├── apple-touch-icon.png
        └── favicon.ico
```

## Editing content

- Interface copy is stored in paired `data-en` / `data-zh` attributes in `index.html`.
- Verified competition cards and official links are in the Competition Directory section of `index.html`.
- Twenty-eight company profiles across the Americas, Europe and Asia, including hiring stages and preparation notes, are in the `companyData` array in `assets/js/app.js`.
- Twelve interactive finance job cards are in the `careerData` array. Their work content, work chain, preparation notes and interview prompts are in `careerPlaybooks`.
- The five-stage application, online-test, technical, case and superday playbook is in the Interview Lab section of `index.html`.
- The interview question bank is in `questionBank`; resume checklist and bullet generation logic are in `assets/js/app.js`.
- The zero-background Quant Lab contains five interactive experiments: compounding, risk and drawdown, diversification, signal versus noise, and overfitting. Definitions and simulation logic are in `labDefinitions`, `labState` and the `renderQuantLab` functions.
- The Investment Simulator runs 200 deterministic Monte Carlo paths with adjustable capital, horizon, fees and global equity, bond, gold and cash allocations. It supports neutral, inflation, recession and tech-boom scenarios. Simulation logic is in `investmentState`, `investmentScenarios` and `runInvestmentSimulation`.
- The Labs page includes two lab entry cards. The Concept Lab and Investment Simulator open as separate views using `#/quant-lab` and `#/investment-simulator`, with browser-history support and a return-to-overview control.
- Main module routes are `#/research`, `#/labs`, `#/competitions`, `#/companies`, `#/careers`, `#/interview-lab` and `#/council`.
- The competition directory contains ten established organizer cards across investment research, quantitative research, trading, modeling, negotiation, law, arbitration and risk.
- The quant lab includes guided challenge presets and copyable experiment records.
- The investment simulator supports defensive, balanced and growth presets; monthly, quarterly, annual or no rebalancing; scenario assumptions; and CSV export.
- The Research page includes a six-question research agenda, a methods stack and defined research output formats.
- Each research agenda card opens a standalone detail route with its own interactive model, research question, concepts, methods and expected outputs.
- Chinese display headings use a local Kai-style typeface stack with Noto Serif SC fallback; Chinese body copy uses Noto Sans SC.
- French UI and dynamically generated content are translated through `assets/js/fr-i18n.js`; company names, job titles and competition names may remain in their official or internationally used form.
- Japanese is the default interface language. Japanese UI, company, career, research, lab and simulator content is translated through `assets/js/ja-i18n.js`.
- The Japanese edition uses `assets/img/site-background-ja.jpg` as a full-width desktop backdrop, with reduced overlays so the source image remains legible. Mobile uses a centred cover treatment.
- The persisted language preference uses the `hightable-language-v2` local-storage key, allowing this Japanese-default release to supersede earlier language preferences.
- Brand colors, typography and responsive rules are in `assets/css/styles.css`.
- Fonts are generated as local character subsets. If substantial Chinese copy is added later, regenerate the font subsets or extend the subset character set.
- Increment `CACHE_NAME` in `sw.js` whenever core site files change, so installed users receive the new version.

## Before launch

- Verify all competition dates and eligibility with official organizers.
- Review company profiles against current official sources.
- Confirm every company careers link before launch.
- Add the final domain through GitHub Pages settings or a `CNAME` file.
- The company section is explicitly labelled independent and non-affiliated; keep that disclaimer visible.

## Content note

Competition and company sections are independent educational resources, not official calendars, rankings or investment recommendations. Hiring processes and role titles can change by firm, office and program. No third-party logos or photography are bundled with this version.
