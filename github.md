# GitHub source

repo: serena-boyu/serena-portfolio
branch: main
live: https://serena-boyu.github.io/serena-portfolio/

## Last sync

date: 2026-09-18T09:47:08Z
tree: 861fa1b1bda0 (tree hash, not a commit)

### Updated in this project
- Published the full local build to `serena-boyu/serena-portfolio`; GitHub Pages is live.
- Entry point renamed from "Portfolio V1.2 Simple Playground.html" to `index.html`.
- Added `.gitignore` (excludes 186 unreferenced full-res originals, uploads/, screenshots/)
  and `.nojekyll`.
- The older `serena-boyu/Portfolio` repo is stale and NOT the live site.

## Screen map

| Screen / area | Files |
| --- | --- |
| Entry point | `index.html` |
| Home (Featured Work) | `src/Home.jsx` |
| About, Archive, design projects | `src/About.jsx` |
| Archive layout (simple variant) | `src/PlaygroundSimple.jsx` |
| Case study template | `src/ProjectPage.jsx` |
| Router | `src/App.jsx` |
| All copy + project data | `src/data.jsx` |
| Tweaks panel | `tweaks-panel.jsx` |
| Images / video | `assets/**` (217 referenced) |

## Publishing notes

- Push fix: `git config http.postBuffer 524288000` was required — pushes over
  ~30MB failed with "remote disconnected" until the buffer was raised.
- Local repo is at the user's unzipped project folder, managed via GitHub Desktop.
- Workflow for updates: replace changed files locally → Commit to main → Push origin.

## Known follow-ups

- Videos total ~131MB across 25 files — compression is the main remaining win.
  See the HandBrake priority list: biggest offenders are pomodoro/demo-2-watches
  (18.9MB), misc/neu_dragon_dance (15.9MB), flo/3d-render-background (12.6MB),
  misc/espresso_shot (10.8MB), neu-dragon/keychains-video (10.0MB).
- React is loaded from development builds; production builds would be smaller
  (needs correct SRI hashes).
