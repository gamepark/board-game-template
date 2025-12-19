# Game Park Patterns

This section documents common patterns used in Game Park games, extracted from the analysis of 38+ existing games.

## Overview

Patterns are organized by development phase:

### 1. [MaterialType and LocationType](./material-and-location.md)
How to define the materials and locations for your game.

**Estimated time**: 10-20 minutes
**Difficulty**: ⭐ Easy

### 2. [Game Setup](./game-setup.md)
How to initialize the game state, create and place materials.

**Estimated time**: 30-90 minutes
**Difficulty**: ⭐⭐ Medium

### 3. [Rules and Game Turns](./rules-and-turns.md)
How to structure game rules and manage player turns.

**Estimated time**: 2-8 hours
**Difficulty**: ⭐⭐⭐ Advanced

### 4. [Moves and Consequences](./moves.md)
How to define possible actions and their effects.

**Estimated time**: 1-4 hours
**Difficulty**: ⭐⭐⭐ Advanced

### 5. [User Interface](./ui-patterns.md)
How to display material (Material.ts, images, styles).

**Estimated time**: 1-3 hours
**Difficulty**: ⭐⭐ Medium

### 6. [Locators and Animations](./locators-animations.md)
How to position elements and create fluid animations.

**Estimated time**: 1-2 hours
**Difficulty**: ⭐⭐ Medium

## How to Use These Patterns

### For Human Developers

1. Read the pattern corresponding to your development phase
2. Look at code examples from reference games
3. Adapt the pattern to your specific game
4. Test frequently

### For Claude Code

Claude knows all these patterns and can:
- Apply them automatically
- Suggest the appropriate pattern for your situation
- Adapt examples from existing games
- Explain why a pattern is recommended

**Typical prompt**:
```
"Use the [deck/hand/grid/placement] pattern from [game name] to implement [my feature]"
```

## Reference Games by Pattern

### Games with Card Decks
- **Mythologies**: Multiple decks, drafting
- **District Noir**: Simple deck, discard pile
- **Along History**: Deck with replenishment
- **Paper Tales**: Complex draft

### Games with Hand of Cards
- **Mythologies**: Private hand, played card management
- **District Noir**: Visible/hidden hand
- **It's a Wonderful World**: Hand + cards under construction

### Games with Grid/Board
- **Looot**: Dynamic hexagonal grid
- **Les Jardins Suspendus**: Fixed grid placement
- **Architects of Amytis**: 3D grid

### Games with Tokens/Resources
- **Looot**: Resources with quantity
- **Mythologies**: Favor and gem tokens
- **It's a Wonderful World**: Resource production

### Games with Scoring
- **Les Jardins Suspendus**: Complex scoring with conditions
- **Along History**: Progressive scoring
- **Architects of Amytis**: Final scoring

### Games with Simultaneous Rules
- **Mythologies**: Simultaneous draft with draft tokens
- **Paper Tales**: Simultaneous play with reveal

### Games with Effects/Abilities
- **Mythologies**: Numerous and varied card effects
- **It's a Wonderful World**: Production chain effects
- **Arackhan Wars**: Combat abilities

## Advanced Patterns

### Memory System
Used to store temporary information during the turn.

**Games**: Mythologies (pending effects), Along History (temporary cards)

### Custom Moves
For actions that aren't simple item movements.

**Games**: Looot (place viking + score), Mythologies (draft token choice)

### Parent Items
To place items on other items (e.g., tokens on cards).

**Games**: Mythologies (tokens on entity cards), Along History (cubes on cards)

### Hiding Strategies
To hide information from players (hands, shuffled decks).

**Games**: All games with cards or decks

### Location Strategies
To automatically organize items (card fan, pile, grid).

**Games**: Mythologies (hand fan), District Noir (pile), Looot (hex grid)

## Anti-Patterns (to avoid)

### ❌ Too Many MaterialTypes
**Problem**: Creating a MaterialType for each card variation

**Solution**: Use the `id` field to differentiate variations
```typescript
// ❌ Bad
enum MaterialType {
  RedCard, BlueCard, GreenCard, YellowCard
}

// ✅ Good
enum MaterialType {
  Card = 1
}
// And use id: CardColor to differentiate
```

### ❌ Logic in Locators
**Problem**: Putting business logic in Locators (app/)

**Solution**: Locators only do visual positioning. Logic goes in rules/

### ❌ Duplicating Code Between Rules
**Problem**: Copy-pasting the same logic in multiple rules

**Solution**: Create helper classes in rules/helpers/
```typescript
// Example: LandscapeHelper in Looot
class LandscapeHelper {
  // Shared logic accessible by all rules
}
```

### ❌ Ignoring Hiding Strategies
**Problem**: Not masking private information (hand, deck)

**Solution**: Always use hideStrategy for private locations

### ❌ Forgetting Animations
**Problem**: Items appear/disappear instantly

**Solution**: The framework animates automatically if locations are properly defined

## Recommended Reading Order

### For a New Game

1. **Material and Location** → Define structure
2. **Game Setup** → Create initial state
3. **Rules and Turns** → Implement logic
4. **Moves** → Define actions
5. **UI Patterns** → Display the game
6. **Locators** → Position and animate

### For Adding a Feature

1. Identify the similar pattern in an existing game
2. Read the corresponding section
3. Adapt the example to your needs
4. Test

## Contributing to Patterns

If you discover a new pattern or a better approach:

1. Document it with concrete examples
2. Reference the game(s) using it
3. Explain when to use it (and when not to)
4. Add it to this documentation

## Additional Resources

- [Official Game Park Documentation](https://gamepark.github.io)
- [Code Examples](../examples/README.md)
- [API Reference](../reference/README.md)
