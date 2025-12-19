# Code Conventions

Standards and best practices for Game Park game development.

## Naming

### Enums

```typescript
// ✅ Good: PascalCase, starts at 1
export enum MaterialType {
  Card = 1,
  Token,
  Board
}

// ❌ Bad: starts at 0
export enum MaterialType {
  Card = 0  // Never start at 0!
}
```

**Why start at 1?**: To avoid bugs with falsy values (0 == false in JS).

### Classes

```typescript
// ✅ Good: PascalCase
class MyGameSetup extends MaterialGameSetup { }
class PlaceCardRule extends PlayerTurnRule { }
class ScoreHelper { }

// ❌ Bad
class my_game_setup { }
class placeCardRule { }
```

### Files

```typescript
// ✅ Good: Same name as exported class/type
MyGameRules.ts
PlaceCardRule.ts
MaterialType.ts

// ❌ Bad
rules.ts
place-card-rule.ts
material_type.ts
```

### Variables and Functions

```typescript
// ✅ Good: camelCase
const playerHand = this.material(MaterialType.Card)
function calculateScore(player: PlayerColor) { }

// ❌ Bad
const PlayerHand = ...
const player_hand = ...
function CalculateScore() { }
```

### Constants

```typescript
// ✅ Good: camelCase or UPPER_SNAKE_CASE
const maxPlayers = 4
const MAX_PLAYERS = 4

// For config arrays/objects
export const cardValues = [1, 2, 3, 5, 8]
export const bonusScores = { line: 3, column: 2 }
```

## Code Structure

### Import Order

```typescript
// 1. External imports (node_modules)
import { MaterialGameSetup } from '@gamepark/rules-api'
import { shuffle, range } from 'es-toolkit'

// 2. Local imports (project files)
import { MaterialType } from './material/MaterialType'
import { LocationType } from './material/LocationType'
import { PlayerColor } from './PlayerColor'
import { MyGameRules } from './MyGameRules'
```

### Order Within a Class

```typescript
export class PlaceCardRule extends PlayerTurnRule<PlayerColor, MaterialType, LocationType> {
  // 1. Static properties
  static readonly POINTS_PER_CARD = 5

  // 2. Getters
  get cardsInHand() {
    return this.material(MaterialType.Card).player(this.player)
  }

  // 3. Main methods (public API)
  getPlayerMoves() {
    // ...
  }

  afterItemMove(move: ItemMove) {
    // ...
  }

  // 4. Utility methods (private)
  private isValidPlacement(card: MaterialItem): boolean {
    // ...
  }
}
```

## TypeScript

### Types vs Interfaces

```typescript
// ✅ Good: Type for unions and intersections
type Move = PlaceCard | DrawCard | EndTurn
type CardWithLocation = Card & { location: Location }

// ✅ Good: Interface for objects
interface GameState {
  round: number
  activePlayer: PlayerColor
}

// ✅ Both work for simple objects
type CardId = { value: number; suit: string }
interface CardId { value: number; suit: string }
```

### Strict Typing

```typescript
// ✅ Good: Explicit typing
function calculateScore(player: PlayerColor): number {
  return 0
}

// ❌ Bad: any or no type
function calculateScore(player: any) {
  return 0
}
```

### Type Assertions

```typescript
// ✅ Good: Use as with caution
const item = this.material(MaterialType.Card).getItem()
const cardId = item.id as CardId

// ⚠️ Avoid: as any (unless really necessary)
const data = item as any
```

### Optionals

```typescript
// ✅ Good: Use ? for optional properties
interface Location {
  type: LocationType
  player?: PlayerColor  // Can be undefined
  x?: number
  y?: number
}

// ✅ Good: Check before using
if (location.player !== undefined) {
  // Use location.player
}
```

## Code Patterns

### Avoid Repetition

```typescript
// ❌ Bad: Duplicated code
getPlayerMoves() {
  const moves = []
  const cards = this.material(MaterialType.Card).player(this.player)
  for (const card of cards.getItems()) {
    if (card.id.value > 5) {
      moves.push(/* ... */)
    }
  }
  return moves
}

// ✅ Good: Extract to function
getPlayerMoves() {
  return this.getValidCards().moveItems(/* ... */)
}

private getValidCards() {
  return this.material(MaterialType.Card)
    .player(this.player)
    .filter(item => item.id.value > 5)
}
```

### Use Helpers

```typescript
// ❌ Bad: Complex logic in rule
class SomeRule extends PlayerTurnRule {
  afterItemMove(move: ItemMove) {
    // 50 lines of complex score calculation
    let score = 0
    // ...
    return []
  }
}

// ✅ Good: Extract to helper
class SomeRule extends PlayerTurnRule {
  afterItemMove(move: ItemMove) {
    const scoreHelper = new ScoreHelper(this.game)
    scoreHelper.updateScore(this.player)
    return []
  }
}

// In rules/helpers/ScoreHelper.ts
export class ScoreHelper {
  constructor(private game: MaterialGame) {}

  updateScore(player: PlayerColor) {
    // Reusable logic
  }
}
```

### Chain Filters

```typescript
// ✅ Good: Chain methods
const cards = this.material(MaterialType.Card)
  .location(LocationType.Deck)
  .player(PlayerColor.Blue)
  .filter(item => item.id.value > 5)
  .sort(item => item.id.value)

// ❌ Bad: Manual filtering
const allCards = this.material(MaterialType.Card).getItems()
const deckCards = allCards.filter(c => c.location.type === LocationType.Deck)
const playerCards = deckCards.filter(c => c.location.player === PlayerColor.Blue)
```

## Comments

### When to Comment

```typescript
// ✅ Good: Explain WHY, not WHAT
// We shuffle twice because of the game rules (page 5)
deck.shuffle()
deck.shuffle()

// ❌ Bad: Comment the obvious
// Shuffle the deck
deck.shuffle()
```

### JSDoc for Public APIs

```typescript
/**
 * Calculate the final score for a player.
 *
 * @param player - The player to calculate score for
 * @returns The total score including bonuses
 */
calculateScore(player: PlayerColor): number {
  // ...
}
```

### TODO and FIXME

```typescript
// TODO: Implement scoring for special cards
// FIXME: This breaks when deck is empty
// NOTE: This follows the official errata from 2023
```

## Error Handling

### Validation

```typescript
// ✅ Good: Validate inputs
getPlayerMoves() {
  if (!this.player) {
    return []  // No active player
  }

  const cards = this.material(MaterialType.Card).player(this.player)
  if (cards.length === 0) {
    return []  // No cards
  }

  return cards.moveItems(/* ... */)
}
```

### Defensive Programming

```typescript
// ✅ Good: Check edge cases
afterItemMove(move: ItemMove) {
  const deck = this.material(MaterialType.Card).location(LocationType.Deck)

  if (deck.length === 0) {
    // Empty deck: reshuffle discard
    this.material(MaterialType.Card)
      .location(LocationType.Discard)
      .moveItems({ type: LocationType.Deck })
      .shuffle()
  }

  return []
}
```

## Performance

### Avoid Unnecessary Calculations

```typescript
// ❌ Bad: Recalculate each time
getPlayerMoves() {
  for (let i = 0; i < this.material(MaterialType.Card).length; i++) {
    // ...
  }
}

// ✅ Good: Calculate once
getPlayerMoves() {
  const cards = this.material(MaterialType.Card)
  const cardCount = cards.length

  for (let i = 0; i < cardCount; i++) {
    // ...
  }
}
```

### Use Framework Methods

```typescript
// ✅ Good: Use optimized methods
this.material(MaterialType.Card).filter(item => item.id.value > 5)

// ❌ Bad: Manual filtering
this.material(MaterialType.Card).getItems().filter(item => item.id.value > 5)
```

## React / UI

### Functional Components

```typescript
// ✅ Good: Functional component with FC
export const PlayerPanel: FC<{ player: PlayerColor }> = ({ player }) => {
  return <div>{player}</div>
}

// ❌ Bad: Class component (deprecated)
export class PlayerPanel extends Component { }
```

### Hooks

```typescript
// ✅ Good: Use hooks
const material = useMaterial(MaterialType.Card)
const rules = useRules()
const player = usePlayer()

// ✅ Good: Custom hooks
function usePlayerCards(player: PlayerColor) {
  const material = useMaterial(MaterialType.Card)
  return material.location(LocationType.PlayerHand).player(player)
}
```

### CSS-in-JS

```typescript
// ✅ Good: Use css from @emotion/react
import { css } from '@emotion/react'

const cardStyle = css`
  width: 5em;
  height: 7em;
  border-radius: 0.5em;
`

<div css={cardStyle}>...</div>
```

## Git

### Commit Messages

```bash
# ✅ Good: Descriptive and concise
git commit -m "Add PlaceCardRule with validation"
git commit -m "Fix scoring calculation for bonus cards"
git commit -m "Update Material.ts with new card images"

# ❌ Bad
git commit -m "fix"
git commit -m "WIP"
git commit -m "changes"
```

### Branches

```bash
# ✅ Good: feature/xxx or fix/xxx
git checkout -b feature/add-draft-phase
git checkout -b fix/scoring-bug

# ❌ Bad
git checkout -b test
git checkout -b new-branch
```

## Tests

### Naming Tests

```typescript
// ✅ Good: Describe expected behavior
describe('PlaceCardRule', () => {
  it('should allow placing cards in empty spaces', () => {
    // ...
  })

  it('should prevent placing cards on occupied spaces', () => {
    // ...
  })
})

// ❌ Bad
it('test 1', () => { })
it('works', () => { })
```

### Arrange-Act-Assert

```typescript
it('should calculate correct score', () => {
  // Arrange: Prepare state
  const game = setupGame()
  placeCards(game, [1, 2, 3])

  // Act: Execute action
  const score = calculateScore(game, PlayerColor.Blue)

  // Assert: Verify result
  expect(score).toBe(6)
})
```

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Best Practices](https://react.dev/learn)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Airbnb Style Guide](https://github.com/airbnb/javascript)
