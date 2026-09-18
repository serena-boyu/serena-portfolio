# GitHub source

repo: serena-boyu/Portfolio
branch: main

## Last sync

date: 2026-09-18T08:57:44Z
commit: (read-only inspection; nothing imported — tree hash was 95b4d6df887d)

### Updated in this project
- Read the repo tree to compare it against the current local build before publishing.
- Repo is substantially behind: it has 14 asset files vs 217 referenced locally.
- Repo entry point is `Portfolio.html`; local entry is now `index.html` (required by GitHub Pages).
- Nothing was imported from the repo — the local build is ahead in every file.

## Screen map

| Screen / area | Repo files | Local files |
| --- | --- | --- |
| Entry point | `Portfolio.html` | `index.html` |
| Home (Featured Work) | `src/Home.jsx` | `src/Home.jsx` |
| About + Archive + design projects | `src/About.jsx` | `src/About.jsx` |
| Case study template | `src/ProjectPage.jsx` | `src/ProjectPage.jsx` |
| Router | `src/App.jsx` | `src/App.jsx` |
| All copy + project data | `src/data.jsx` | `src/data.jsx` |
| Tweaks panel | `tweaks-panel.jsx` | `tweaks-panel.jsx` |
| Images / video | `assets/**` (14 files) | `assets/**` (217 referenced) |

## Notes

- The local build is the source of truth. The repo has not been updated in a while.
- `.gitignore` here excludes 186 full-resolution originals that the site does not load,
  plus `uploads/`, `screenshots/`, `.tmp/`, and the older V1.0 / V1.1 layouts.
- `Portfolio.html` and `SerenaNgPortfolio.html` in the repo are stale and should be
  deleted once `index.html` lands.
