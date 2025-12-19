# File Structure

## Overview

```
board-game-template/
├── docs/                    # 📖 Documentation (what you're reading)
├── rules/                   # 🎲 Game logic (server-side)
├── app/                     # 🎨 React interface (client-side)
├── package.json             # Yarn workspace configuration
├── lerna.json               # Lerna configuration (versioning)
├── tsconfig.json            # TypeScript configuration (root)
├── .editorconfig            # Editor configuration
├── .gitignore               # Files ignored by Git
└── README.md                # Main documentation
```

## /rules Folder (Game Logic)

This is where **all the game business logic** is located.

```
rules/
├── src/
│   ├── material/            # Material definitions
│   │   ├── MaterialType.ts  # ⭐ Material type enum
│   │   └── LocationType.ts  # ⭐ Location type enum
│   │
│   ├── rules/               # Game rules
│   │   ├── RuleId.ts        # ⭐ Rule identifier enum
│   │   ├── helpers/         # Reusable helper classes
│   │   │   └── ScoreHelper.ts
│   │   ├── XxxRule.ts       # One file per rule
│   │   ├── YyyRule.ts
│   │   └── CustomMove.ts    # [Optional] Custom moves
│   │
│   ├── MyGameRules.ts       # ⭐ Main rules class
│   ├── MyGameSetup.ts       # ⭐ Game setup (initial state)
│   ├── MyGameOptions.ts     # ⭐ Game options
│   ├── PlayerColor.ts       # Player colors/identifiers
│   ├── Memory.ts            # [Optional] Game memory
│   └── index.ts             # Public exports
│
├── package.json             # Dependencies and npm config
├── tsconfig.json            # TypeScript configuration
└── README.md                # [Optional] Game documentation
```

### Essential Files (⭐)

You **must** modify these files:

1. **material/MaterialType.ts**: Define all material types
2. **material/LocationType.ts**: Define all locations
3. **MyGameRules.ts**: Main class, references all rules
4. **MyGameSetup.ts**: Create the initial game state
5. **MyGameOptions.ts**: Game options (player count, variants)
6. **rules/RuleId.ts**: Identifiers of all rules
7. **rules/XxxRule.ts**: One file per game rule

### Optional Files

- **rules/helpers/**: Reusable utility classes
- **rules/CustomMove.ts**: For complex moves (not just moving an item)
- **Memory.ts**: To store temporary info during the game
- **tutorial/**: Interactive tutorial (recommended for complex games)

## /app Folder (User Interface)

This is where **all the visuals** of the game are located.

```
app/
├── public/
│   ├── images/              # 🖼️ All game images
│   │   ├── cards/
│   │   │   ├── card-1.jpg
│   │   │   ├── card-2.jpg
│   │   │   └── back.jpg
│   │   ├── boards/
│   │   │   └── board.jpg
│   │   ├── tokens/
│   │   └── ...
│   ├── favicon.ico
│   └── index.html
│
├── src/
│   ├── material/            # Visual descriptions
│   │   └── Material.ts      # ⭐ Config for all MaterialTypes
│   │
│   ├── locators/            # Element positioning
│   │   ├── Locators.ts      # ⭐ Config for all LocationTypes
│   │   ├── XxxLocator.ts    # [Optional] Custom locators
│   │   └── help/            # [Optional] Helpers for locators
│   │
│   ├── headers/             # Texts displayed during game
│   │   ├── Headers.tsx      # ⭐ Index of all headers
│   │   ├── XxxHeader.tsx    # One file per rule
│   │   └── YyyHeader.tsx
│   │
│   ├── panels/              # Player panels
│   │   └── PlayerPanels.tsx # ⭐ Info displayed per player
│   │
│   ├── animations/          # [Optional] Custom animations
│   │   └── GameAnimations.ts
│   │
│   ├── dialogs/             # [Optional] Help popups
│   │   └── HelpDialog.tsx
│   │
│   ├── translations.json    # ⭐ FR/EN translations
│   ├── GameDisplay.tsx      # ⭐ Main display component
│   ├── App.tsx              # ⭐ Application wrapper
│   ├── main.tsx             # React entry point
│   ├── theme.ts             # [Optional] Theme colors
│   └── vite-env.d.ts        # Vite types
│
├── vite.config.ts           # Vite configuration
├── eslint.config.js         # ESLint configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── index.html               # HTML template
```

### Essential Files (⭐)

You **must** modify these files:

1. **material/Material.ts**: Define size and images for each MaterialType
2. **locators/Locators.ts**: Define positioning for each LocationType
3. **headers/Headers.tsx**: Create headers for each rule
4. **panels/PlayerPanels.tsx**: Display info for each player
5. **translations.json**: Translate all texts (FR + EN minimum)
6. **GameDisplay.tsx**: Adapt global display if necessary
7. **App.tsx**: Configure the application

### Optional Files

- **animations/GameAnimations.ts**: Customize animations
- **dialogs/**: Create help popups
- **theme.ts**: Customize colors

## /docs Folder (Documentation)

```
docs/
├── README.md                # Main index
├── quick-start.md           # Getting started guide
├── working-with-claude.md   # Guide for Claude Code
│
├── patterns/                # Code patterns
│   ├── README.md
│   ├── material-and-location.md
│   ├── game-setup.md
│   ├── rules-and-turns.md
│   └── ...
│
├── examples/                # Code examples
│   └── README.md
│
└── reference/               # Quick reference
    ├── README.md
    ├── checklist.md
    ├── commands.md
    ├── file-structure.md    # This file
    └── conventions.md
```

## Naming Conventions

### TypeScript Files

- **PascalCase** for classes: `MyGameRules.ts`, `PlaceCardRule.ts`
- **PascalCase** for types/enums: `MaterialType.ts`, `PlayerColor.ts`
- **camelCase** for utilities: `scoreHelper.ts`

### React Files (TSX)

- **PascalCase** for components: `GameDisplay.tsx`, `PlayerPanels.tsx`
- One component per file (except internal helpers)

### Images

- **kebab-case**: `card-1.jpg`, `blue-token.png`, `main-board.jpg`
- Organized by type: `/images/cards/`, `/images/boards/`, `/images/tokens/`

### Folders

- **lowercase**: `material/`, `rules/`, `locators/`
- **kebab-case** for multiple words: `step-by-step/`

## Configuration Files

### package.json (root)

Configures Yarn workspace with the 2 subprojects (rules + app).

```json
{
  "name": "@gamepark/my-game",
  "workspaces": ["rules", "app"],
  "scripts": {
    "dev": "yarn --cwd app dev",
    "start": "yarn dev",
    "build": "yarn --cwd rules build && yarn --cwd app build",
    "test": "yarn --cwd rules test",
    "lint": "yarn --cwd rules lint && yarn --cwd app lint",
    "deploy": "yarn build && yarn --cwd app deploy",
    "linkgp": "...",
    "unlinkgp": "..."
  }
}
```

### tsconfig.json

TypeScript configuration (strict mode recommended).

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler"
  }
}
```

### vite.config.ts (app/)

Vite configuration for dev server and build.

```typescript
export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@gamepark/my-game': path.resolve(__dirname, '../rules/src')
    }
  }
})
```

## Generated Files (do not modify)

- `node_modules/`: Installed dependencies
- `rules/dist/`: Compiled rules code
- `app/dist/`: Production build of the app
- `.yarn/`: Yarn cache
- `.pnp.*`: Yarn Plug and Play files

## Git Files

### .gitignore

Ignores generated and sensitive files.

```
node_modules
dist
.env.local
.DS_Store
```

### .git/

Git history (never modify manually).

## Structure After Development

Your project will typically contain:

```
my-game/
├── rules/src/
│   ├── material/
│   │   ├── MaterialType.ts (5-15 types)
│   │   └── LocationType.ts (5-30 locations)
│   ├── rules/
│   │   ├── RuleId.ts (3-20 rules)
│   │   ├── SomeRule.ts
│   │   ├── AnotherRule.ts
│   │   └── helpers/ (0-5 helpers)
│   ├── MyGameRules.ts
│   ├── MyGameSetup.ts
│   └── MyGameOptions.ts
│
└── app/src/
    ├── material/Material.ts
    ├── locators/Locators.ts
    ├── headers/ (3-20 headers)
    ├── panels/PlayerPanels.tsx
    └── translations.json
```

## File Creation Order

1. ✅ **MaterialType.ts** and **LocationType.ts**
2. ✅ **MyGameOptions.ts**
3. ✅ **MyGameSetup.ts**
4. ✅ **RuleId.ts**
5. ✅ **XxxRule.ts** (one by one)
6. ✅ **Material.ts** (after having images)
7. ✅ **Locators.ts**
8. ✅ **Headers.tsx** and individual files
9. ✅ **translations.json**
10. ✅ **PlayerPanels.tsx**

## Typical File Sizes

| File              | Lines (simple) | Lines (complex) |
|-------------------|----------------|-----------------|
| MaterialType.ts   | 10-20          | 30-50           |
| LocationType.ts   | 10-30          | 40-80           |
| Setup.ts          | 50-150         | 200-500         |
| Rule.ts           | 20-80          | 100-300         |
| Material.ts       | 50-150         | 200-400         |
| Locators.ts       | 30-100         | 150-300         |
| translations.json | 20-50          | 100-300         |

## Resources

- [Official Documentation](https://gamepark.github.io)
- [Patterns](../patterns/README.md)
- [Checklist](./checklist.md)
