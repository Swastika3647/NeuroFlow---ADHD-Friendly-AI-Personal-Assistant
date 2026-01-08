
# NeuroFlow - ADHD-Friendly AI Personal Assistant

NeuroFlow is a progressive web application (PWA) designed to manage tasks using neuro-divergent friendly methodologies. It features a "Traffic Light" priority system, Time Containers, and an Anxiety Reset mode.

## 🚀 Live Demo
https://neuro-flow-adhd-friendly-ai-persona.vercel.app/

- **Traffic Light System:** Strict limits on urgent tasks (Max 3 Red, 2 Yellow, 1 Green).
- **Time Containers:** Tasks are managed by duration (25m/45m), not strict deadlines.
- **Anxiety Reset:** A "Panic Button" that clears UI clutter and forces focus on a single task.
- **Weekly Reset Wizard:** A guided 3-step ritual to clear backlog and celebrate wins.
- **Offline First:** Built on Dexie.js (IndexedDB), data persists without internet.
- **PWA:** Installable on iOS and Android.

## 🛠️ Tech Stack
- **Framework:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Database:** Dexie.js (Client-side IndexedDB)
- **Drag & Drop:** @dnd-kit/core
- **NLP:** Chrono-node (Natural Language Date Parsing)

## 📦 Local Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/neuroflow.git](https://github.com/YOUR_USERNAME/neuroflow.git)
   cd neuroflow
   Install dependencies

Bash

npm install
Start the development server

Bash

npm run dev


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
