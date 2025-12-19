# Quick Start Guide

This guide helps you get started quickly with the Game Park template.

## Prerequisites

- Node.js (version 18+)
- Yarn (version 4+)
- An IDE (recommended: WebStorm, VS Code)
- Git

For installation details, see [Set up your computer](https://gamepark.github.io/#/step-by-step-example/set-up-your-computer) in the official documentation.

## Installation

### 1. Create a new project from the template

```bash
# Clone the template
git clone https://github.com/gamepark/board-game-template.git my-game
cd my-game

# Install dependencies
yarn install
```

### 2. Rename the project

The template uses generic names that need to be replaced:

**Files to rename**:
- `rules/src/GameTemplateRules.ts` → `rules/src/MyGameRules.ts`
- `rules/src/GameTemplateSetup.ts` → `rules/src/MyGameSetup.ts`
- `rules/src/GameTemplateOptions.ts` → `rules/src/MyGameOptions.ts`

**Text to replace** (search and replace across the entire project):
- `GameTemplate` → `MyGame`
- `game-template` → `my-game`
- `@gamepark/game-template` → `@gamepark/my-game`

**In package.json files**:
- Update `name` in `rules/package.json`
- Update `name` in `app/package.json`
- Update dependency references

**Tip**: Claude Code can do all of this automatically if you ask "Rename this project from GameTemplate to MyGame".

### 3. Start the development server

```bash
yarn start
# or
yarn dev
```

The game automatically opens in your browser at `http://localhost:3000`.

## Verify everything works

You should see:
- An empty interface with the game name
- No errors in the browser console
- The player panel

### Useful console commands

Open the browser console (F12) and test:

```javascript
// Start a new game
game.new

// Create a 2-player game
game.new(2)

// View game state
game.view

// View possible moves
game.legalMoves
```

For more commands, see [Console Commands](https://gamepark.github.io/#/features/console-commands).

## Project Structure

```
my-game/
├── rules/                  # Game logic (server-side)
│   ├── src/
│   │   ├── material/      # Material definitions
│   │   │   ├── MaterialType.ts
│   │   │   └── LocationType.ts
│   │   ├── rules/         # Game rules
│   │   │   ├── RuleId.ts
│   │   │   └── ...Rule.ts
│   │   ├── MyGameRules.ts
│   │   ├── MyGameSetup.ts
│   │   └── MyGameOptions.ts
│   └── package.json
│
├── app/                    # User interface (React)
│   ├── public/
│   │   └── images/        # Game images (cards, boards, etc.)
│   ├── src/
│   │   ├── material/      # Visual descriptions
│   │   │   └── Material.ts
│   │   ├── locators/      # Element positioning
│   │   │   └── Locators.ts
│   │   ├── headers/       # Text displayed during game
│   │   │   └── Headers.tsx
│   │   ├── panels/        # Player panels
│   │   │   └── PlayerPanels.tsx
│   │   ├── animations/    # Custom animations
│   │   │   └── GameAnimations.ts
│   │   ├── translations.json
│   │   ├── GameDisplay.tsx
│   │   └── App.tsx
│   └── package.json
│
├── docs/                   # This documentation
├── package.json           # Workspace configuration
└── README.md              # Main documentation
```

## Next Steps

Now that your environment is ready:

1. **Identify your game**: Which game do you want to adapt?
2. **Analyze the material**: What are the game elements? → [Material Patterns](./patterns/material-and-location.md)
3. **Define locations**: Where do these elements go? → [Location Patterns](./patterns/material-and-location.md)
4. **Set up rules**: How does the game flow? → [Rules Patterns](./patterns/rules-and-turns.md)
5. **Create the interface**: How to display the game? → [UI Patterns](./patterns/ui-patterns.md)

### Recommended Resources

- 📖 [Official Documentation - Step by step](https://gamepark.github.io/#/step-by-step-example/choose-a-game)
- 📋 [Creation Checklist](./reference/checklist.md)
- 🤖 [Working with Claude Code](./working-with-claude.md)
- 💡 [Common Patterns](./patterns/README.md)

## Typical Development Workflow

1. **Define MaterialType and LocationType** (5-15 min)
2. **Create Setup**: place initial material (30-60 min)
3. **Implement rules** one by one (2-8h depending on complexity)
4. **Display material**: Material.ts and locators (1-3h)
5. **Add images** and adjust positions (1-2h)
6. **Write headers** and translations (30-60 min)
7. **Test and debug** (1-2h)
8. **Create tutorial** (optional) (2-4h)

**Total for a simple game**: 1-2 days
**Total for a medium game**: 3-5 days
**Total for a complex game**: 1-2 weeks

These times are indicative and assume you already know the framework and game rules well.
