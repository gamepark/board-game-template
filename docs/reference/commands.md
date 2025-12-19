# Useful Commands

## Yarn Commands

### Development

```bash
# Start the development server (recommended)
yarn start

# Or in dev mode (equivalent)
yarn dev

# The game automatically opens at http://localhost:3000
```

### Build

```bash
# Compile the project (rules + app)
yarn build

# Production build and preview
yarn build
yarn preview
```

### Tests

```bash
# Run unit tests
yarn test

# Tests in watch mode (re-test on each change)
yarn test --watch
```

### Linting

```bash
# Check code with ESLint
yarn lint

# Automatically fix ESLint errors
yarn lint --fix
```

### Dependency Management

```bash
# Install dependencies
yarn install

# Add a dependency
yarn add <package>

# Add a dev dependency
yarn add -D <package>

# Update dependencies
yarn upgrade
```

### Local Links (framework development)

```bash
# Link local Game Park packages
yarn linkgp

# Unlink packages
yarn unlinkgp
```

### Deployment

```bash
# Build + deployment via rclone (production)
yarn deploy
```

### Publish rules to npm

```bash
# Publish the new version of rules
yarn publish
```

## Browser Console Commands

Open the browser console (F12) and use the global `game` object.

### Game Management

```javascript
// Create a new game (2 players by default)
game.new

// Create a game with a specific number of players
game.new(3)  // 3-player game
game.new(4)  // 4-player game
game.new({player: [{id: 1}, {id: 4}]})  // 2-player game with non-random player ids

```

### State Inspection

```javascript
// View the complete game state
game.state

// View items of a specific type
game.state.items[MaterialType.Card]

// View active rule
game.state.rule

// View players
game.state.players
```

### Moves

```javascript
// All moves played since the game started
game.moves

// Undo the last move
game.undo
```

## Git Commands

### Branch Management

```bash
# Create a new branch
git checkout -b feature/my-feature

# Switch branch
git checkout main

# View branches
git branch
```

### Commits

```bash
# Add all modified files
git add .

# Add specific files
git add rules/src/MyRule.ts

# Commit
git commit -m "Add MyRule implementation"

# Commit with Claude as co-author
git commit -m "Add MyRule implementation

🤖 Generated with Claude Code
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### Push and Pull

```bash
# Push to remote
git push

# First time (create remote branch)
git push -u origin my-branch

# Fetch latest changes
git pull
```

### Status and History

```bash
# View current status
git status

# View history
git log

# View differences
git diff
```

## NPM Commands (alternative to Yarn)

If you prefer npm:

```bash
npm install          # Install dependencies
npm run dev          # Start in dev mode
npm run build        # Production build
npm test            # Run tests
npm run lint        # Lint the code
```

## IDE Shortcuts (WebStorm / VS Code)

### WebStorm

- `Ctrl/Cmd + B`: Go to definition
- `Ctrl/Cmd + Alt + L`: Reformat code
- `Ctrl/Cmd + P`: Parameter info
- `Shift + Shift`: Search everywhere
- `Ctrl/Cmd + E`: Recent files
- `Alt + Enter`: Quick fix / suggestions

### VS Code

- `F12`: Go to definition
- `Shift + Alt + F`: Reformat code
- `Ctrl/Cmd + Space`: Suggestions
- `Ctrl/Cmd + P`: Search for a file
- `Ctrl/Cmd + Shift + F`: Search in files
- `Ctrl/Cmd + .`: Quick fix

## Custom Scripts (package.json)

You can add your own scripts in `package.json`:

```json
{
  "scripts": {
    "test:watch": "vitest --watch",
    "lint:fix": "eslint --fix",
    "build:rules": "cd rules && yarn build",
    "clean": "rm -rf node_modules */node_modules"
  }
}
```

Then run them with:

```bash
yarn test:watch
yarn lint:fix
```

## Debugging

### In the Browser

1. Open DevTools (F12)
2. "Sources" tab
3. Find your file in `webpack://` or `src/`
4. Set a breakpoint (click on line number)
5. Play the game, execution stops at breakpoint

### In WebStorm

1. Create a "JavaScript Debug" configuration
2. URL: `http://localhost:3000`
3. Launch in debug mode
4. Set breakpoints in the code
5. Debug directly in the IDE

## Environment Variables

Create a `.env.local` file in `app/`:

```bash
VITE_PLATFORM_URI=http://localhost:8080
VITE_PUSHER_KEY=your-key
```

Access in code:

```typescript
import.meta.env.VITE_PLATFORM_URI
```

## Tips

### Auto Reload

The Vite server automatically reloads on each change. If it doesn't work:

```bash
# Stop the server (Ctrl+C)
# Restart
yarn start
```

### Clear Cache

If you see old data:

1. Clear localStorage: `localStorage.clear()`
2. Reload: `Ctrl/Cmd + Shift + R`

### Performance

To measure performance:

```javascript
// In the console
console.time('test')
game.new()
console.timeEnd('test')
```

### Export for Analysis

```javascript
// Export current state
JSON.stringify(game.state, null, 2)

// Copy to clipboard
copy(game.state)
```

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [Yarn Documentation](https://yarnpkg.com/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
