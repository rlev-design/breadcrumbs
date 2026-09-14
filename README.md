# Breadcrumbs

A local-first desktop app for leaving a trail on projects you step away from. Each **breadcrumb** records what changed, which decisions you made, the next step, and a note to future you — so you can pick the work back up without reconstructing context from memory.

Built with **Tauri 2**, **React 19**, **TypeScript**, **Vite**, **Tailwind CSS 4**, and **SQLite**.

## What it does

The window is three panes:

1. **Sidebar** — project list and “New project”. Projects have a name and a color.
2. **Workspace** — the selected project’s trail. Breadcrumbs appear in order; the latest is marked *You are here*.
3. **Detail** — the selected breadcrumb, or the forms for creating a project or breadcrumb.

On first launch with no data, the center pane prompts you to create a project. Creating a breadcrumb requires a selected project.

A breadcrumb stores:

| Field | Purpose |
| --- | --- |
| Title | Short label for this point in the trail |
| Date | Set automatically on save (`en-US` month + day) |
| What changed | What moved since the last crumb |
| Decisions | Comma-separated on input, stored as a list |
| Next step | What to do when you return |
| Note to future me | Anything else you want to remember |

Data lives in a local SQLite file (`breadcrumbs.db`) via `@tauri-apps/plugin-sql`. Schema is applied with a Tauri SQL migration on startup.

## Prerequisites

- [Node.js](https://nodejs.org/) (npm)
- [Rust](https://www.rust-lang.org/tools/install) (stable)
- Platform tooling for Tauri 2: see [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)

## Run locally

From this directory (`breadcrumbs/`):

```bash
npm install
npm run tauri dev
```

That starts Vite on `http://localhost:1420` and opens the native window.

Useful scripts:

| Command | What it does |
| --- | --- |
| `npm run tauri dev` | Desktop app in development |
| `npm run tauri build` | Production bundle |
| `npm run dev` | Vite only (no SQLite / Tauri APIs) |
| `npm run build` | Typecheck + Vite production build |

## Layout

```
src/
  App.tsx                 # Loads projects, selection, create flows
  db.ts                   # SQLite: getProjects, createProject, createBreadcrumb
  types.ts
  components/
    Sidebar.tsx
    ProjectWorkspace.tsx
    DetailPanel.tsx
    NewProject.tsx
    NewBreadcrumb.tsx
src-tauri/
  src/lib.rs              # App bootstrap + SQL migration
  capabilities/           # sql execute permission for the main window
```

Tables:

- `projects` — `id`, `name`, `color`
- `breadcrumbs` — `id`, `project_id`, `title`, `date`, `what_changed`, `decisions` (JSON array), `next_step`, `note_to_future_me`

Deleting a project would cascade to its breadcrumbs at the database level; the UI does not expose delete or edit yet.

## Current limits

- Home, Today, All Projects, Starred, and Settings in the sidebar are placeholders.
- Breadcrumbs and projects cannot be edited or deleted from the UI.
- Vite-only (`npm run dev`) will not persist data; use `npm run tauri dev`.

## IDE

[VS Code](https://code.visualstudio.com/) / Cursor with the [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) and [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer) extensions.
