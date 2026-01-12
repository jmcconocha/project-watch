# Project Watch

A native macOS app for tracking and managing your local development projects with GitHub integration.

![Project Watch](https://img.shields.io/badge/Platform-macOS-blue) ![Version](https://img.shields.io/badge/Version-1.0.0-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

## Features

- **Project Discovery** - Automatically scan folders for git repositories
- **Git Status Monitoring** - See branch, uncommitted changes, commits ahead/behind at a glance
- **GitHub Integration** - Connect with PAT to view open PRs and issues
- **Kanban Board** - Organize projects by status (Active, On Hold, Completed, Archived)
- **Quick Actions** - Open projects in VS Code, Terminal, Finder, or GitHub with one click
- **Native Performance** - Built with Tauri for a fast, lightweight experience (~12MB)
- **Dark Mode** - Full light/dark theme support

## Installation

### Download

Download the latest `.dmg` from [Releases](https://github.com/jmcconocha/project-watch/releases).

### Build from Source

```bash
# Clone the repo
git clone https://github.com/jmcconocha/project-watch.git
cd project-watch/project-watch

# Install dependencies
npm install

# Run in development
npm run tauri:dev

# Build for production
npm run tauri:build
```

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **Backend**: Tauri v2 (Rust)
- **State Management**: Zustand
- **UI Components**: Custom components with Lucide icons
- **Drag & Drop**: dnd-kit

## Usage

1. **Scan Projects** - Go to Settings → Projects → Choose Folder to Scan
2. **Connect GitHub** - Go to Settings → GitHub → Enter your PAT
3. **Manage Projects** - Use the Projects Board to organize by status
4. **Quick Actions** - Click project cards for quick access to editor, terminal, etc.

## Development

```bash
# Start dev server (hot reload)
npm run tauri:dev

# Type check
npm run build

# Lint
npm run lint

# Production build
npm run tauri:build
```

## Project Structure

```
project-watch/
├── src/                    # React frontend
│   ├── components/         # Shared UI components
│   ├── features/           # Feature modules
│   ├── pages/              # Route pages
│   ├── services/           # Tauri API services
│   └── stores/             # Zustand stores
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── lib.rs          # Tauri commands
│   │   └── main.rs         # Entry point
│   └── tauri.conf.json     # Tauri config
└── package.json
```

## License

MIT

## Author

Built by [@jmcconocha](https://github.com/jmcconocha)
