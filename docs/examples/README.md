# Code Examples

This section contains real code examples extracted from existing Game Park games.

## Organization

Examples are organized by functionality:

### Basic Patterns

- **Material and Location**: How to define MaterialType and LocationType
- **Setup**: How to initialize the game
- **Simple Rules**: Player turns, basic actions
- **Moves**: Material movements

### Advanced Patterns

- **Draft**: Simultaneous card selection (Mythologies, Paper Tales)
- **Hexagonal Grids**: Hex grid placement (Looot)
- **Card Effects**: Abilities and powers (Mythologies, AracKhan Wars)
- **Production Chains**: Cascading effects (It's a Wonderful World)
- **Complex Scoring**: Point calculations (Les Jardins Suspendus, Along History)

## Examples by Game

### Mythologies

**Complexity**: Medium-High
**Concepts**: Simultaneous draft, card effects, scoring

Key files to study:
- `rules/src/material/`: 11 MaterialType, 27 LocationType
- `rules/src/MythologiesSetup.ts`: Setup with 4 mythologies, multiple decks
- `rules/src/rules/ChooseDraftTokenRule.ts`: Simultaneous draft
- `rules/src/rules/effects/`: 40+ different card effects

### Looot

**Complexity**: Medium
**Concepts**: Hexagonal grid, tile placement, resources

Key files to study:
- `rules/src/material/`: 13 MaterialType, 9 LocationType
- `rules/src/LoootSetup.ts`: Dynamic hex board generation
- `rules/src/rules/PlaceResourceRule.ts`: Placement with constraints
- `rules/src/rules/helpers/LandscapeHelper.ts`: Hex grid management

### Les Jardins Suspendus

**Complexity**: Medium
**Concepts**: Grid placement, scoring, solo mode

Key files to study:
- `rules/src/material/`: 13 MaterialType, 27 LocationType
- `rules/src/LesJardinsSuspendusSetup.ts`: Setup with solo options
- Placement and scoring rules

## Useful Snippets

### Create and shuffle a deck

```typescript
import { shuffle, range } from 'es-toolkit'

// Create 52 shuffled cards
this.material(MaterialType.Card).createItems(
  shuffle(range(1, 53)).map(id => ({
    id,
    location: { type: LocationType.Deck }
  }))
)
```

### Deal cards

```typescript
const deck = this.material(MaterialType.Card)
  .location(LocationType.Deck)
  .deck()

// Deal 5 cards to each player
for (const player of this.players) {
  deck.deal({ type: LocationType.PlayerHand, player }, 5)
}
```

### Move an item

```typescript
// In a PlayerTurnRule
afterItemMove(move: ItemMove) {
  // Card has been moved automatically
  // Add consequences here
  if (move.location.type === LocationType.PlayArea) {
    // Card has been played
    return [this.nextPlayerTurn()]
  }
  return []
}
```

### Check possible moves

```typescript
getPlayerMoves() {
  const cardsInHand = this.material(MaterialType.Card)
    .location(LocationType.PlayerHand)
    .player(this.player)

  // Player can play any card from their hand
  return cardsInHand.moveItems({
    type: LocationType.PlayArea,
    player: this.player
  })
}
```

### Custom move

```typescript
// In rules/CustomMove.ts
export enum CustomMoveType {
  ChooseOption = 1
}

export type ChooseOption = {
  type: CustomMoveType.ChooseOption
  option: number
}

export type CustomMove = ChooseOption

// In a rule
getPlayerMoves() {
  const moves: CustomMove[] = []

  // Offer 3 options
  for (let i = 1; i <= 3; i++) {
    moves.push({
      type: CustomMoveType.ChooseOption,
      option: i
    })
  }

  return moves
}

onCustomMove(move: ChooseOption) {
  // Handle choice
  console.log(`Player chose option ${move.option}`)
  return []
}
```

### Use memory

```typescript
// Define type (in Memory.ts)
export enum Memory {
  PendingEffects = 1,
  CurrentRound
}

// Store a value (in Setup or Rules)
this.memorize(Memory.CurrentRound, 1)

// Read a value (in Rules)
const round = this.remind(Memory.CurrentRound)

// Modify a value
this.memorize(Memory.CurrentRound, round + 1)
```

### Simultaneous rule (all players at once)

```typescript
export class DraftRule extends SimultaneousRule<PlayerColor, MaterialType, LocationType> {

  // Possible moves for a specific player
  getActivePlayerLegalMoves(player: PlayerColor) {
    // Each player chooses a card from their hand
    return this.material(MaterialType.Card)
      .location(LocationType.PlayerHand)
      .player(player)
      .moveItems({ type: LocationType.SelectedCard, player })
  }

  // When all players have played
  onRuleEnd() {
    // Reveal cards and continue
    return [this.startRule(RuleId.RevealCards)]
  }
}
```

### End game with scoring

```typescript
export class EndGameRule extends Rule<PlayerColor, MaterialType, LocationType> {

  onRuleStart() {
    // Calculate scores
    for (const player of this.players) {
      const score = this.calculateScore(player)
      this.memorize(Memory.PlayerScore(player), score)
    }

    // End the game
    return [this.endGame()]
  }

  calculateScore(player: PlayerColor) {
    let score = 0

    // Card points
    const cards = this.material(MaterialType.Card)
      .location(LocationType.PlayerArea)
      .player(player)

    for (const card of cards.getItems()) {
      score += card.id.points || 0
    }

    // Token points
    const tokens = this.material(MaterialType.Token)
      .player(player)
      .length

    score += tokens * 2

    return score
  }
}
```

### Helper class

```typescript
// In rules/helpers/ScoreHelper.ts
export class ScoreHelper {
  constructor(private game: MaterialGame<PlayerColor, MaterialType, LocationType>) {}

  calculateScore(player: PlayerColor): number {
    // Reusable logic
    return this.getCardPoints(player) + this.getBonusPoints(player)
  }

  private getCardPoints(player: PlayerColor): number {
    return this.game.material(MaterialType.Card)
      .player(player)
      .getItems()
      .reduce((sum, card) => sum + (card.id.points || 0), 0)
  }

  private getBonusPoints(player: PlayerColor): number {
    // Complex bonuses
    return 0
  }
}

// Use in a rule
const scoreHelper = new ScoreHelper(this.game)
const score = scoreHelper.calculateScore(this.player)
```

### Parent items (place on another item)

```typescript
// Place a token on a card
this.material(MaterialType.Token).createItem({
  location: {
    type: LocationType.OnCard,
    parent: cardIndex  // Index of the card in game.items[MaterialType.Card]
  }
})

// Get all tokens on a card
const tokensOnCard = this.material(MaterialType.Token)
  .location(LocationType.OnCard)
  .parent(cardIndex)
  .getItems()
```

## Where to Find More Examples

1. **Official Documentation**: https://gamepark.github.io
   - Complete step-by-step tutorial
   - Examples for each feature

2. **Existing Games**: Explore the 38+ games in adjacent folders
   - Find a game similar to yours
   - Study how they implement features

3. **Ask Claude**:
   ```
   "Show me how [game] implements [feature]"
   "Give me an example of [pattern] with code"
   ```

## Contributing

If you develop an interesting pattern, document it here with a complete code example!
