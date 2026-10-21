# Project Overview

**Daybook** (`journal-app-ui`) is an editorial, tranquil personal journaling React web application designed for mindful daily reflections and multi-journal management. It provides a peaceful, distraction-free writing environment (featuring a Zen/focus mode, daily writing prompts, mood tagging, and rich calendar/history overviews) integrated with a Spring Boot REST backend (`http://localhost:8081/api/`).

---

## Tech Stack & Architecture

- **Language / Runtime**: JavaScript (ES6+), Node.js
- **Framework / Core**: React 18 (`react`, `react-dom`), `react-scripts` (Create React App)
- **Routing & Navigation**: Single-page state-based view switching via `JournalContext` (also has `react-router-dom` available)
- **Styling / UI**:
  - Tailwind CSS 3 (configured with editorial ivory/parchment/sage color palettes and custom typography)
  - Lucide React & FontAwesome icons
  - React Bootstrap / Bootstrap 5 utility integration
- **State Management**: React Context API (`JournalContext`) providing centralized entries, active journal management, toast notifications, search/filter criteria, and user preferences (`localStorage` backed)
- **Data Serialization & API Client**:
  - Axios client (`axiosConfig.js`) targeting backend REST endpoints (`/journals`, `/entries`)
  - Dedicated serialization utility (`entrySerializer.js`) transforming backend payloads to frontend presentation models
- **Testing**: Jest, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`

---

## Directory Structure

```text
journal-app-ui/
├── public/                     # Static assets (HTML shell, favicons, manifest)
├── src/
│   ├── api/                    # HTTP client and backend integration
│   │   ├── axiosConfig.js      # Axios instance targeting backend REST API (port 8081)
│   │   └── journalApi.js       # CRUD API operations for journals and entries
│   ├── components/             # Reusable UI component library
│   │   ├── calendar/           # Monthly calendar reflection view
│   │   ├── common/             # Modals (Delete confirmation), Toast notifications
│   │   ├── editor/             # Writing canvas, mood selector, prompt banner, tags
│   │   ├── history/            # Entry cards, list views, search, and filtering
│   │   ├── journal/            # Journal list management & creation modal
│   │   ├── layout/             # TopBar, Sidebar, and Mobile BottomNav navigation
│   │   └── settings/           # User settings modal (typography, font size, prompts)
│   ├── context/
│   │   └── JournalContext.js   # Central state container & backend sync hook
│   ├── data/                   # Fallback mock data and writing prompt suggestions
│   │   ├── mockEntries.js      # Sample entries for fallback or tests
│   │   └── writingPrompts.js   # Reflective daily prompts library
│   ├── utils/
│   │   └── entrySerializer.js  # Bidirectional entity serialization (frontend <-> backend)
│   ├── App.js                  # Root application view layout and router switcher
│   ├── App.test.js             # End-to-end integration and smoke test suite
│   ├── index.css               # Base Tailwind imports and font definitions
│   └── index.js                # React DOM entry point
├── package.json                # Project dependencies, test config, and lifecycle scripts
├── tailwind.config.js          # Tailwind theme configuration (custom serif fonts & color themes)
└── postcss.config.js           # PostCSS configuration for Tailwind CSS
```

---

## Key Commands

- **Development Server**: `npm start` (Runs the dev server at [http://localhost:3000](http://localhost:3000))
- **Production Build**: `npm run build` (Bundles and optimizes static assets to the `build/` directory)
- **Run Tests**: `npm test` or `npm test -- --watchAll=false` (Executes Jest / React Testing Library suite)
- **Lint / Code Inspection**: Handled via Create React App's embedded ESLint rules during `npm start` and `npm run build`

---

## Code Guidelines & Standards

- **State & Architecture**: Keep backend synchronization encapsulated within [`JournalContext.js`](file:///C:/Users/khans/Documents/MyProjects/Journal/journal-app-ui/src/context/JournalContext.js) and [`journalApi.js`](file:///C:/Users/khans/Documents/MyProjects/Journal/journal-app-ui/src/api/journalApi.js). Avoid direct component-level Axios mutations.
- **Data Serialization**: When exchanging journal entry payloads with the backend, route data transformations through [`entrySerializer.js`](file:///C:/Users/khans/Documents/MyProjects/Journal/journal-app-ui/src/utils/entrySerializer.js) to preserve mood, tags, and serialized metadata.
- **Component Design**: Organize views modularly under `src/components/<domain>/`. Leverage Tailwind utility classes conforming to the project's serene color scheme (`ivory`, `parchment`, `sage`, `charcoal`).
- **Resilience & Offline Handling**: Always gracefully handle backend downtime or missing API responses with sensible fallbacks and informative toast alerts.
- **Testing**: Maintain comprehensive coverage in [`App.test.js`](file:///C:/Users/khans/Documents/MyProjects/Journal/journal-app-ui/src/App.test.js) for view transitions, navigation, search, and modal interactions using `@testing-library/react`.
