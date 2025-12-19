# Quick Reference

Reference documentation for Game Park game development.

## Contents

### [Creation Checklist](./checklist.md)
Complete list of steps to create a game from A to Z.

### [Useful Commands](./commands.md)
Console commands, yarn scripts, and debugging tips.

### [File Structure](./file-structure.md)
File organization and naming conventions.

### [Code Conventions](./conventions.md)
Code standards and best practices.

## Quick Links

### Official Documentation
- [Game Park Docs](https://gamepark.github.io)
- [Step-by-step tutorial](https://gamepark.github.io/#/step-by-step-example/choose-a-game)
- [Core concepts](https://gamepark.github.io/#/concepts/core-concepts)

### Framework
- [@gamepark/rules-api](https://www.npmjs.com/package/@gamepark/rules-api) - Game logic
- [@gamepark/react-game](https://www.npmjs.com/package/@gamepark/react-game) - React interface
- [@gamepark/react-client](https://www.npmjs.com/package/@gamepark/react-client) - Game Park client

### External Resources
- [TypeScript](https://www.typescriptlang.org/docs/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)

## Quick Cheat Sheet

### Create a new item

```typescript
this.material(MaterialType.Card).createItem({
  id: 1,
  location: { type: LocationType.Deck }
})
```

### Move an item

```typescript
this.material(MaterialType.Card)
  .id(cardId)
  .moveItem({ type: LocationType.PlayerHand, player })
```

### Get items at a location

```typescript
const cards = this.material(MaterialType.Card)
  .location(LocationType.Deck)
  .getItems()
```

### Shuffle a deck

```typescript
this.material(MaterialType.Card)
  .location(LocationType.Deck)
  .shuffle()
```

### Deal cards

```typescript
this.material(MaterialType.Card)
  .location(LocationType.Deck)
  .deck()
  .deal({ type: LocationType.PlayerHand, player }, 5)
```

### Move to next rule

```typescript
return [this.startRule(RuleId.NextRule)]
```

### Move to next player

```typescript
return [this.startPlayerTurn(RuleId.PlayerTurn, this.nextPlayer)]
```

### Memorize information

```typescript
this.memorize(Memory.SomeData, value)
const data = this.remind(Memory.SomeData)
```

## Main Types

### MaterialItem

```typescript
type MaterialItem = {
  location: Location
  id?: any
  quantity?: number
  selected?: boolean | number
}
```

### Location

```typescript
type Location = {
  type: LocationType
  id?: any
  player?: Player
  parent?: number
  rotation?: any
  x?: number
  y?: number
  z?: number
}
```

### Move

```typescript
type Move = {
  kind: number
  type?: MaterialType
  // ... other properties depending on move type
}
```

## Main Classes

### MaterialGameSetup

```typescript
class MyGameSetup extends MaterialGameSetup<Player, MaterialType, LocationType, Options> {
  Rules = MyGameRules

  setupMaterial(options: Options) {
    // Create initial material
  }

  start() {
    this.startRule(RuleId.FirstRule)
  }
}
```

### MaterialRules

```typescript
class MyGameRules extends MaterialRules<Player, MaterialType, LocationType> {
  rules = {
    [RuleId.SomeRule]: SomeRule
  }
}
```

### PlayerTurnRule

```typescript
class SomeRule extends PlayerTurnRule<Player, MaterialType, LocationType> {
  getPlayerMoves() {
    // Return possible moves
    return []
  }

  afterItemMove(move: ItemMove) {
    // Handle consequences
    return []
  }
}
```

### SimultaneousRule

```typescript
class DraftRule extends SimultaneousRule<Player, MaterialType, LocationType> {
  getActivePlayerLegalMoves(player: Player) {
    // Moves for this player
    return []
  }
}
```

## Using Claude Code

### Effective Prompts

```
"Create MaterialType and LocationType for [my game]"
"Implement the game setup"
"Add the [RuleName] rule that does [description]"
"How does [existing game] handle [feature]?"
"Debug this error: [error]"
```

### Test Commands

```javascript
// Browser console
game.new()              // New game
game.new(3)            // 3-player game
game.view              // View game state
game.legalMoves        // View possible moves
game.undo              // Undo last move
game.rematch           // Restart game
```

## Keyboard Shortcuts (in browser)

- `Ctrl/Cmd + Shift + I`: Open DevTools
- `F5`: Reload page
- `Ctrl/Cmd + R`: Reload page
- `Ctrl/Cmd + Shift + R`: Hard reload (clear cache)

## Pattern Links

- [MaterialType and LocationType](../patterns/material-and-location.md)
- [Game Setup](../patterns/game-setup.md)
- [Rules and Turns](../patterns/rules-and-turns.md)
- [User Interface](../patterns/ui-patterns.md)
