# Game Setup Pattern

The Setup is the class that creates the initial game state. It's the first thing that executes when a game starts.

## Principle

```typescript
export class MyGameSetup extends MaterialGameSetup<PlayerColor, MaterialType, LocationType, MyGameOptions> {
  Rules = MyGameRules

  setupMaterial(options: MyGameOptions) {
    // 1. Create materials
    // 2. Place them at correct locations
    // 3. Initialize decks, resources, etc.
  }

  start() {
    // Define the first rule of the game
    this.startRule(RuleId.FirstRule)
  }
}
```

## Typical Structure

### 1. setupMaterial()

This is where you create all game materials.

```typescript
setupMaterial(options: MyGameOptions) {
  this.setupBoards()      // Fixed boards
  this.setupDecks()       // Card decks
  this.setupPlayers()     // Per-player material
  this.setupTokens()      // Tokens and resources
  this.setupMemory()      // Game memory (if needed)
}
```

### 2. start()

Defines which rule starts the game.

```typescript
start() {
  this.startPlayerTurn(RuleId.PlayerTurn, this.players[0])
  // or
  this.startSimultaneousRule(RuleId.DraftPhase)
  // or
  this.startRule(RuleId.SetupPhase)
}
```

## Creating Materials

### createItem() - Single Item

```typescript
this.material(MaterialType.Board).createItem({
  id: BoardType.Main,
  location: { type: LocationType.Table }
})
```

### createItems() - Multiple Items

```typescript
this.material(MaterialType.Card).createItems([
  { id: 1, location: { type: LocationType.Deck } },
  { id: 2, location: { type: LocationType.Deck } },
  { id: 3, location: { type: LocationType.Deck } }
])
```

### With range() and map()

```typescript
import { range } from 'es-toolkit'

// Create 10 cards numbered 1 to 10
this.material(MaterialType.Card).createItems(
  range(1, 11).map(id => ({
    id,
    location: { type: LocationType.Deck }
  }))
)
```

### With shuffle()

```typescript
import { shuffle } from 'es-toolkit'

// Create and shuffle a deck
this.material(MaterialType.Card).createItems(
  shuffle(range(1, 11)).map(id => ({
    id,
    location: { type: LocationType.Deck }
  }))
)
```

## Setup Patterns

### Pattern 1: Simple Deck

```typescript
setupDeck() {
  this.material(MaterialType.Card).createItems(
    shuffle(range(1, 17)).map(id => ({
      id,
      location: { type: LocationType.Deck }
    }))
  )
}
```

**Used in**: Almost all card games

### Pattern 2: Multiple Decks (by id)

```typescript
// Example from Mythologies: 4 god decks (1 per mythology)
for (const mythology of mythologies) {
  this.material(MaterialType.EntityCard).createItems(
    shuffle(range(1, 5)).map(god => ({
      id: { front: mythology * 10 + god, back: { mythology, entityType: EntityType.Divinity } },
      location: {
        type: LocationType.GodsDeck,
        id: mythology  // One deck per mythology
      }
    }))
  )
}
```

**Used in**: Mythologies (4 decks), games with multiple card types

### Pattern 3: Initial Deal

```typescript
// Deal 5 cards to each player
const deck = this.material(MaterialType.Card).location(LocationType.Deck).deck()
for (const player of this.players) {
  deck.deal({ type: LocationType.PlayerHand, player }, 5)
}
```

**Used in**: All games that deal cards at start

### Pattern 4: Tokens with Quantity

```typescript
// Create resource pool (40 gold coins)
this.material(MaterialType.GoldCoin).createItem({
  quantity: 40,
  location: { type: LocationType.TokenStock }
})
```

**Used in**: Looot (resources), Les Jardins Suspendus (coins), games with resources

### Pattern 5: Per-Player Material

```typescript
setupPlayers() {
  for (const player of this.players) {
    // Player board
    this.material(MaterialType.PlayerBoard).createItem({
      location: { type: LocationType.PlayerBoardPlace, player }
    })

    // Initial resources
    this.material(MaterialType.Token).createItem({
      quantity: 3,
      location: { type: LocationType.PlayerTokens, player }
    })
  }
}
```

**Used in**: All games with per-player material

### Pattern 6: Random First Player

```typescript
import { sample } from 'es-toolkit'

setupPlayers() {
  const firstPlayer = sample(this.players)
  this.material(MaterialType.FirstPlayerToken).createItem({
    location: { type: LocationType.FirstPlayerSpot, player: firstPlayer }
  })
}
```

**Used in**: Many games

### Pattern 7: Dynamic Grid/Board

```typescript
// Example from Looot: hexagonal board placement
setupLandscapeBoards() {
  const boards = shuffle(range(1, 5)).slice(0, this.players.length)
  const firstBoardLocation = { type: LocationType.Landscape, x: 0, y: 0, rotation: 0 }

  this.material(MaterialType.LandscapeBoard).createItem({
    id: boards[0],
    location: firstBoardLocation
  })

  // Then place other boards adjacently
  // (complex hexagonal grid logic)
}
```

**Used in**: Looot (hex grid), games with modular boards

## Complete Examples

### Example 1: Mythologies Setup (Simplified)

```typescript
export class MythologiesSetup extends MaterialGameSetup<PlayerColor, MaterialType, LocationType, MythologiesOptions> {
  Rules = MythologiesRules

  setupMaterial(options: MythologiesOptions) {
    // 1. Initialize memory (for pending effects)
    this.memorize(Memory.PendingEffects, [])

    // 2. Place the 4 mythology boards
    this.setupMythologies(this.getMythologies(options))

    // 3. Create player material
    this.setupPlayers()

    // 4. Deal 3 creatures per sanctuary
    this.dealCreatures()

    // 5. Create destiny cards
    this.material(MaterialType.RoundToken).createItem({
      location: { type: LocationType.RoundSpace, id: 1 }
    })
    this.createDestinyCards()
  }

  setupMythologies(mythologies: Mythology[]) {
    // Place boards in 2x2 grid
    this.material(MaterialType.MythologyBoard).createItems(
      shuffle(mythologies).map((mythology, index) => ({
        id: { mythology, side: index % 2 },
        location: {
          type: LocationType.Sanctuary,
          x: index % 2,
          y: Math.floor(index / 2)
        }
      }))
    )

    // Create card decks for each mythology
    for (const mythology of mythologies) {
      // God deck (4 cards)
      this.material(MaterialType.EntityCard).createItems(
        shuffle(range(1, 5)).map(god => ({
          id: { front: mythology * 10 + god, back: { mythology, entityType: EntityType.Divinity } },
          location: { type: LocationType.GodsDeck, id: mythology }
        }))
      )

      // Creature deck (18 cards = 3 copies of 6 creatures)
      this.material(MaterialType.EntityCard).createItems(
        shuffle(Array(3).fill(range(5, 11)).flat()).map((creature: number) => ({
          id: { front: mythology * 10 + creature, back: { mythology, entityType: EntityType.Creature } },
          location: { type: LocationType.CreaturesDeck, id: mythology }
        }))
      )
    }
  }

  setupPlayers() {
    for (const player of this.players) {
      // 3 draft tokens (2 face up, 1 face down)
      this.material(MaterialType.DraftToken).createItems(
        shuffle([true, true, false]).map(front => ({
          id: { front, back: player },
          location: { type: LocationType.PlayerHand, player }
        }))
      )

      // 3 gem tokens on line bonuses
      this.material(MaterialType.GemToken).createItems(
        range(0, 3).map(y => ({
          location: { type: LocationType.PantheonLineBonus, player, y }
        }))
      )

      // 3 favor tokens on column bonuses
      this.material(MaterialType.FavorToken).createItems(
        range(0, 3).map(x => ({
          location: { type: LocationType.PantheonColumnBonus, player, x }
        }))
      )
    }

    // First player token to first player
    this.material(MaterialType.FirstPlayerToken).createItem({
      location: { type: LocationType.FirstPlayerTokenSpot, player: this.players[0] }
    })
  }

  dealCreatures() {
    const mythologyBoards = this.material(MaterialType.MythologyBoard)
    for (const index of mythologyBoards.getIndexes()) {
      const mythology = mythologyBoards.getItem<MythologyBoardId>(index).id.mythology
      const deck = this.material(MaterialType.EntityCard)
        .location(LocationType.CreaturesDeck)
        .locationId(mythology)
        .deck()

      // Deal 3 creatures to this sanctuary
      deck.deal({ type: LocationType.SanctuaryCreatureSpot, parent: index }, 3)
    }
  }

  createDestinyCards() {
    this.material(MaterialType.DestinyCard).createItems(
      shuffle(range(1, 5)).map(id => ({
        id,
        location: { type: LocationType.DestinyDeck }
      }))
    )
  }

  start() {
    this.startSimultaneousRule(RuleId.ChooseDraftToken)
  }
}
```

### Example 2: Looot Setup (Simplified)

```typescript
export class LoootSetup extends MaterialGameSetup<PlayerColor, MaterialType, LocationType, LoootOptions> {
  Rules = LoootRules

  setupMaterial(_options: LoootOptions) {
    this.setupLandscapeBoards()  // Hexagonal boards
    this.setupPlayers()          // Fjord + vikings for each player

    // Create resource tiles
    resources.forEach(resource => {
      this.material(MaterialType.ResourceTile).createItem({
        quantity: 40,  // 40 of each resource
        location: { type: LocationType.ResourceTilesDeck, id: resource },
        id: resource
      })
    })
  }

  setupLandscapeBoards() {
    // 1. Randomly choose which boards to use (based on player count)
    const boards = shuffle(range(1, 5)).slice(0, this.players.length)
    const boardsFace = boards.map(board => (board * 2 - Math.floor(Math.random() * 2)) as LandscapeBoard)

    // 2. Place first board at center
    const firstBoardLocation = this.getLandscapeBoardLocation({ x: 0, y: 0 }, 0)
    this.material(MaterialType.LandscapeBoard).createItem({
      id: boardsFace.pop(),
      location: firstBoardLocation
    })

    // 3. Place other boards adjacently (complex hex grid logic)
    // ...

    // 4. Create building tiles on each board
    this.createBuildingTiles()

    // 5. Place Trophy board and Ocean board on edges
    this.setupTrophyBoard(/* ... */)
    this.setupOceanBoard(/* ... */)
  }

  setupPlayers() {
    for (const player of this.players) {
      // Player's fjord board
      this.material(MaterialType.FjordBoard).createItem({
        id: player,
        location: { type: LocationType.FjordBoard, player }
      })

      // Player's bag
      this.material(MaterialType.Bag).createItem({
        id: player,
        location: { type: LocationType.Bag, player }
      })

      // 10 vikings in the bag
      this.material(MaterialType.Viking).createItems(
        range(0, 10).map(() => ({
          id: player,
          location: { type: LocationType.InsideBag, player }
        }))
      )
    }
  }

  start() {
    this.startPlayerTurn(RuleId.PlaceResource, this.players[0])
  }
}
```

## Common Utilities

### range(start, end)

Create an array of numbers.

```typescript
range(1, 5)  // [1, 2, 3, 4]
range(0, 3)  // [0, 1, 2]
```

### shuffle(array)

Shuffle an array.

```typescript
shuffle([1, 2, 3, 4])  // [3, 1, 4, 2] (random)
```

### sample(array)

Choose a random element.

```typescript
sample([1, 2, 3, 4])  // 3 (random)
```

### sampleSize(array, n)

Choose n random elements.

```typescript
sampleSize([1, 2, 3, 4, 5], 2)  // [3, 1] (random)
```

### getEnumValues(enum)

Get all values of an enum.

```typescript
getEnumValues(PlayerColor)  // [PlayerColor.Blue, PlayerColor.Red, ...]
```

## Memory System

To store global game information:

```typescript
setupMaterial(options: MyGameOptions) {
  // Initialize empty memory
  this.memorize(Memory.PendingEffects, [])
  this.memorize(Memory.CurrentRound, 1)
  // ...
}
```

**Used in**: Mythologies (pending effects), games with temporary state

## Useful Methods

### this.players

Array of players (colors).

```typescript
this.players  // [PlayerColor.Blue, PlayerColor.Red]
```

### this.material(type)

Access materials of a type.

```typescript
this.material(MaterialType.Card)  // MaterialRulesPart<Card>
```

### .deck()

Transform a location into a deck (for deal, shuffle, etc.).

```typescript
const deck = this.material(MaterialType.Card)
  .location(LocationType.Deck)
  .deck()

deck.shuffle()
deck.deal({ type: LocationType.PlayerHand, player }, 5)
```

### .deal(location, count)

Deal cards from a deck.

```typescript
deck.deal({ type: LocationType.PlayerHand, player: PlayerColor.Blue }, 3)
// Moves 3 cards from top of deck to blue player's hand
```

## Common Mistakes

### ❌ Forgetting to Shuffle Decks

```typescript
// Bad: cards always in same order
this.material(MaterialType.Card).createItems(
  range(1, 11).map(id => ({ id, location: { type: LocationType.Deck } }))
)
```

```typescript
// Good: shuffled cards
this.material(MaterialType.Card).createItems(
  shuffle(range(1, 11)).map(id => ({ id, location: { type: LocationType.Deck } }))
)
```

### ❌ Not Using Quantity for Resources

```typescript
// Bad: 100 items in state
this.material(MaterialType.Coin).createItems(
  range(0, 100).map(() => ({ location: { type: LocationType.Bank } }))
)
```

```typescript
// Good: 1 item with quantity
this.material(MaterialType.Coin).createItem({
  quantity: 100,
  location: { type: LocationType.Bank }
})
```

### ❌ Creating Items Without Location

```typescript
// Error: location required!
this.material(MaterialType.Card).createItem({ id: 1 })
```

```typescript
// Good
this.material(MaterialType.Card).createItem({
  id: 1,
  location: { type: LocationType.Deck }
})
```

## Testing the Setup

In the browser console:

```javascript
// Create a new game
game.new()

// Inspect initial state
game.state

// See all items of a type
game.state.items[MaterialType.Card]
```

## With Claude Code

```
Prompt: "Create the setup for my game with these MaterialType and LocationType. At start, it should: [description of initial setup]"
```

Claude will:
1. Create the Setup class
2. Implement setupMaterial() with proper structure
3. Create items and place them correctly
4. Use shuffle, range, etc. as needed
5. Implement start() with the first rule

**Don't forget to test afterward with `yarn start`!**

## Resources

- [Official Documentation - Setup](https://gamepark.github.io/#/step-by-step-example/complete-the-setup)
- [Next Pattern: Rules and Turns](./rules-and-turns.md)
- [Code Examples](../examples/README.md)
