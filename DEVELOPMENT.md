# Development Setup Guide

This project is fully configured for development. Here's everything that's been set up:

## 🚀 Quick Start

```bash
# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

## 📦 Installation

All dependencies have been installed. If you need to install them again:

```bash
npm install
```

## 🛠️ Available Commands

### Development

- `npm run dev` - Start Vite development server with hot module replacement
- `npm run preview` - Preview production build locally
- `npm run kill` - Kill any process on port 5000/tcp (useful if dev server hangs)

### Building

- `npm run build` - Build for production (runs TypeScript check + Vite build)
- `npm run optimize` - Optimize Vite bundle

### Code Quality

- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without changes
- `npm run type-check` - Run TypeScript type checking

## 🔧 Project Configuration

### ESLint ([eslint.config.js](eslint.config.js))

- TypeScript support with `typescript-eslint`
- React and React Hooks rules
- React Refresh support for HMR
- Configured to ignore `dist` and `node_modules`

### Prettier ([.prettierrc.json](.prettierrc.json))

- 2-space indentation
- Single quotes
- 100-character line width
- Trailing commas (ES5 style)
- Semicolons enabled
- LF line endings

### EditorConfig ([.editorconfig](.editorconfig))

- Consistent line endings across editors (LF)
- UTF-8 charset for all files
- Trailing whitespace trimming
- Final newline enforcement

## 📝 VS Code Setup

### Workspace Configuration

- **Workspace file**: `flipper.code-workspace` - Open this file in VS Code for optimized settings
- **Settings**: `.vscode/settings.json` - Configured for this project
- **Extensions**: `.vscode/extensions.json` - Recommended for development

### Recommended VS Code Extensions

All these are listed in `.vscode/extensions.json`:

1. **Prettier** - Code formatter
2. **ESLint** - Linting and code quality
3. **Tailwind CSS IntelliSense** - Utility class completions
4. **GitHub Copilot** - AI code completion
5. **GitHub Copilot Chat** - AI conversations
6. **TypeScript Vue Plugin** - Vue type support
7. **ES7+ React/Redux/React-Native snippets** - React shortcuts
8. **MDX** - MDX file support
9. **EditorConfig** - EditorConfig support
10. **Material Icon Theme** - Better file icons
11. **Output Colorizer** - Color terminal output
12. **GitLens** - Git blame and history

### Automatic Formatting & Linting

- Files are automatically formatted on save with Prettier
- ESLint auto-fixes are applied on save
- These settings are in `.vscode/settings.json`

## 🏗️ Project Structure

```
.
├── src/
│   ├── components/          # Reusable React components
│   │   ├── FlipperDevice.tsx
│   │   ├── diagrams/       # Data visualization diagrams
│   │   ├── screens/        # Full-page screens
│   │   └── ui/             # Design system components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── styles/             # Global styles
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── .vscode/                # VS Code configuration
│   ├── settings.json       # Editor settings
│   └── extensions.json     # Recommended extensions
├── eslint.config.js        # ESLint configuration
├── .prettierrc.json        # Prettier configuration
├── .editorconfig           # Cross-editor configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── package.json            # Dependencies and scripts
```

## 📚 Tech Stack

### Core

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS

### UI Components

- **Radix UI** - Unstyled, accessible components
- **Phosphor Icons** - Icon library
- **Heroicons** - Alternative icon set
- **Lucide React** - Modern icons
- **Sonner** - Toast notifications

### Data Visualization

- **D3.js** - Data visualization
- **Recharts** - React charting library
- **Three.js** - 3D graphics

### Utilities

- **Framer Motion** - Animations
- **React Hook Form** - Form handling
- **Zod** - Data validation
- **TanStack React Query** - Server state management
- **Marked** - Markdown parser
- **UUID** - Unique ID generation

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript ESLint** - TS linting rules
- **React DevTools** - Browser dev tools

## 🎯 Common Workflows

### Starting Development

```bash
# Terminal 1: Start dev server
npm run dev

# Wait for "Local: http://localhost:5173"
# Open that URL in your browser
```

### Before Committing Code

```bash
# Check for type errors
npm run type-check

# Lint and fix issues
npm run lint:fix

# Format code
npm run format

# Optional: Verify formatting without changes
npm run format:check
```

### Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill the process using port 5000
npm run kill

# Then restart dev server
npm run dev
```

### TypeScript Errors Not Showing

- Make sure `vite.config.ts` is correct
- Try restarting the dev server
- VS Code may need to be reloaded (Cmd+Shift+P → Reload Window)

### Prettier/ESLint Not Working in VS Code

1. Install the extensions from `.vscode/extensions.json`
2. Restart VS Code
3. Check that `.prettierrc.json` and `eslint.config.js` exist
4. Verify the extension settings in VS Code

### Hot Module Replacement (HMR) Not Working

- This is expected during certain build steps
- Check the browser console for errors
- Most changes should hot reload automatically

## 📖 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ESLint Rules](https://eslint.org/docs/latest/rules/)

---

**Setup completed!** Everything is ready for development. Run `npm run dev` to get started! 🎉
