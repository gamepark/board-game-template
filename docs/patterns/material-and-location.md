# MaterialType and LocationType

The two most important enums in your game. They define **WHAT** (materials) and **WHERE** (locations).

## Core Principle

In Game Park, every game element (card, token, board, etc.) is a **Material** that exists at a **Location**.

```typescript
type MaterialItem = {
  location: Location  // WHERE is this item
  id?: any           // Which variation of this item (e.g., color, value)
  quantity?: number  // How many (for resources that stack)
}
```

## MaterialType

### Definition

`MaterialType` is an enum that lists all physical material types in the game.

```typescript
export enum MaterialType {
  Card = 1,        // Start at 1, not 0
  Token,           // Auto-incremented to 2
  Board,           // Auto-incremented to 3
  Meeple
}
```

### Naming Rules

✅ **Good**: Singular, descriptive names
- `Card`, `Token`, `Board`, `PlayerMat`, `DiceToken`

❌ **Bad**: Plural or too generic
- `Cards`, `Tokens`, `Thing`, `Item`

### How to Identify MaterialTypes

Look at the physical game and list **each distinct component type**:

#### Example: Mythologies

```typescript
export enum MaterialType {
  MythologyBoard = 1,    // Mythology board (4 in game)
  EntityCard,            // Entity cards (gods + creatures)
  PantheonBoard,         // Pantheon board (1 per player)
  DraftToken,            // Draft tokens (3 per player)
  GemToken,              // Gem tokens
  FavorToken,            // Favor tokens
  FirstPlayerToken,      // First player token
  RoundCounterBoard,     // Round counter board
  RoundToken,            // Round token
  DestinyCard,           // Destiny cards
  HelpCard               // Help cards
}
```

**Analysis**:
- 11 distinct material types
- Even though EntityCard represents 2 card types (gods/creatures), it's a single MaterialType
- Variations are handled with the `id` field

#### Example: Looot

```typescript
export enum MaterialType {
  LandscapeBoard = 1,    // Landscape boards
  OceanBoard,            // Ocean board
  TrophyBoard,           // Trophy board
  BuildingTile,          // Building tiles
  TrophyTile,            // Trophy tiles
  LongshipTile,          // Longship tiles
  ResourceTile,          // Resource tiles
  Bag,                   // Bag (1 per player)
  FjordBoard,            // Fjord board (1 per player)
  Shield,                // Shields (for scoring)
  Viking,                // Vikings (meeples)
  ConstructionSiteTile,  // Construction site tiles
  ScorePad               // Score pad
}
```

**Analysis**:
- 13 types including several tile variants
- Each tile type is separate because visuals differ
- Bag and FjordBoard are per-player components

#### Example: Les Jardins Suspendus

```typescript
export enum MaterialType {
  GameBoard = 1,         // Main board
  MiniBoard,             // Mini board (1 per player)
  GardenCard,            // Garden cards
  EnhancementTile,       // Enhancement tiles
  ObjectiveTile,         // Objective tiles
  IrrigationCard,        // Irrigation cards (1 per player)
  Gardener,              // Gardeners (meeples)
  ObjectiveMarker,       // Objective markers
  FirstPlayerMarker,     // First player marker
  GoldCoin,              // Gold coins
  Tool,                  // Tools
  ScorePad,              // Score pad
  AutomaCard             // Automa cards (solo)
}
```

**Analysis**:
- 13 well-organized types
- AutomaCard separate as it's only used in solo mode
- Resources (GoldCoin, Tool) are distinct MaterialTypes

### Common Patterns

#### Pattern 1: Board per Player
```typescript
enum MaterialType {
  PlayerBoard = 1,  // One board per player
  // ...
}
```
**Used in**: Mythologies (PantheonBoard), Looot (FjordBoard, Bag)

#### Pattern 2: Tokens with Quantity
```typescript
enum MaterialType {
  GoldCoin = 1,  // Will use quantity to count
  // ...
}
```
**Used in**: Mythologies (GemToken, FavorToken), Looot (ResourceTile)

#### Pattern 3: Multiple Card Types
```typescript
enum MaterialType {
  Card = 1,  // Single MaterialType, differentiated by id
  // ...
}
```
**Used in**: Mythologies (EntityCard = gods + creatures differentiated by id)

#### Pattern 4: Help Cards and Scorepads
```typescript
enum MaterialType {
  HelpCard = ...,   // Always present in games
  ScorePad = ...    // Optional, for scoring
}
```
**Used in**: All complex games

## LocationType

### Definition

`LocationType` is an enum that lists all possible locations for materials.

```typescript
export enum LocationType {
  Deck = 1,
  PlayerHand,
  Table,
  Discard
}
```

### Naming Rules

✅ **Good**: Descriptive place names
- `Deck`, `PlayerHand`, `Table`, `BoardSpace`, `TokenStock`

❌ **Bad**: Too vague names
- `Location1`, `Place`, `Here`

### How to Identify LocationTypes

Ask yourself: **Where can each material be during the game?**

#### Example: Mythologies

```typescript
export enum LocationType {
  Sanctuary = 1,              // Central sanctuary (4 boards)
  GodsDeck,                   // Gods deck (1 per mythology)
  CreaturesDeck,              // Creatures deck (1 per mythology)
  PantheonBoardSpot,          // Spot on pantheon board
  PlayerHand,                 // Player's hand (draft tokens)
  SanctuaryCreatureSpot,      // Creature spot in sanctuary
  SanctuaryGodSpot,           // God spot in sanctuary
  FavorTokensStock,           // Favor tokens stock
  GemTokensStock,             // Gem tokens stock
  PantheonLineBonus,          // Line bonus (pantheon)
  PantheonColumnBonus,        // Column bonus (pantheon)
  FirstPlayerTokenSpot,       // First player token spot
  RoundCounterBoardSpot,      // Round counter board spot
  RoundSpace,                 // Space for round token
  DestinyDeck,                // Destiny deck
  CurrentDestiny,             // Current destiny card
  PlayedTokenSpot,            // Played token spot
  OnEntityCard,               // On an entity card (parent)
  Pantheon,                   // In the pantheon (general)
  PlayerGems,                 // Player's gems
  PlayerFavor,                // Player's favor
  PlayerDiscard,              // Player's discard
  PlayerSelectedCards,        // Selected cards
  GameHelpArea,               // Help area
  CardsCount                  // Cards counter
}
```

**Analysis**:
- 27 locations! (complex game)
- Some locations use `player` (PlayerHand, PlayerGems...)
- Some use `id` (GodsDeck.id = mythology)
- Some use `parent` (OnEntityCard)
- Helper function `isInSanctuary()` to group locations

#### Example: Looot

```typescript
export enum LocationType {
  Landscape = 1,           // Position on landscape (x, y, rotation)
  InsideBag,               // Inside bag (hidden)
  ResourceTilesDeck,       // Resource tiles deck
  Bag,                     // On the bag (visible)
  FjordBoard,              // On fjord board
  FjordBoardHexSpace,      // Hex space on fjord (x, y)
  PlayerVikingPile,        // Player's viking pile
  ScorePadPlace,           // Score pad placement
  ScorePadBox              // Box on score pad
}
```

**Analysis**:
- Only 9 locations (medium game)
- Uses coordinates (x, y) for Landscape and FjordBoardHexSpace
- Distinction InsideBag (hidden) vs Bag (visible on bag)

#### Example: Les Jardins Suspendus

```typescript
export enum LocationType {
  GameBoardPlace = 1,      // Main board placement
  MiniBoardPlace,          // Mini board placement
  GardenCardsDeck,         // Garden cards deck
  GameBoardSpace,          // Space on main board
  EnhancementPile,         // Enhancements pile
  ObjectiveTileSpace,      // Space for objective tile
  PlayerIrrigationCard,    // Player's irrigation card
  PlayerGardeners,         // Player's gardeners
  PlayerObjectiveMarkers,  // Player's objective markers
  FirstPlayerMarkerPlace,  // First player marker placement
  GoldCoinsStock,          // Gold coins stock
  PlayerGoldCoins,         // Player's gold coins
  ToolsStock,              // Tools stock
  PlayerTools,             // Player's tools
  PlayerGarden,            // Player's garden
  GardenerSpace,           // Space for gardener
  EmptyGarden,             // Empty garden
  ObjectiveSpace,          // Objective space
  ScorePadPlace,           // Score pad placement
  ScorePadBox,             // Box on score pad
  AutomaDeck,              // Automa deck
  AutomaGardeners,         // Automa gardeners
  AutomaObjectiveMarkers,  // Automa objective markers
  AutomaDiscard,           // Automa discard
  GardenCardsDiscard,      // Garden cards discard
  EnhancementDiscard       // Enhancements discard
}
```

**Analysis**:
- 27 locations (complex game)
- Clear pattern: Stock vs Player (GoldCoinsStock vs PlayerGoldCoins)
- Separate Automa locations for solo mode
- Multiple discards based on material type

### Common Patterns

#### Pattern 1: Deck + Discard
```typescript
enum LocationType {
  Deck = 1,
  Discard,
  // ...
}
```
**Required** for card games

#### Pattern 2: Stock + Player
```typescript
enum LocationType {
  TokenStock = 1,     // General stock
  PlayerTokens,       // Player's tokens
  // ...
}
```
**Used in**: Mythologies, Les Jardins Suspendus

#### Pattern 3: Board + Spaces
```typescript
enum LocationType {
  Board = 1,          // The board itself
  BoardSpace,         // A spot on the board (with x, y)
  // ...
}
```
**Used in**: Almost all games with boards

#### Pattern 4: Parent Location
```typescript
enum LocationType {
  OnCard = 1,         // On a card (uses parent: index)
  // ...
}
```
**Used in**: Mythologies (OnEntityCard), to place tokens on cards

### Location Properties

A Location can have several properties:

```typescript
type Location = {
  type: LocationType    // REQUIRED
  id?: any             // Identifier (e.g., color, number)
  player?: Player      // Owner player
  parent?: number      // Index of another item
  rotation?: any       // Rotation (for tiles)
  x?: number          // X coordinate
  y?: number          // Y coordinate
  z?: number          // Z coordinate (rare)
}
```

#### When to Use Each Property

**player**: When the location belongs to a player
```typescript
{ type: LocationType.PlayerHand, player: PlayerColor.Blue }
```

**id**: When there are multiple instances of this location
```typescript
{ type: LocationType.Deck, id: Mythology.Greek }  // One deck per mythology
```

**x, y**: For grids or boards with coordinates
```typescript
{ type: LocationType.BoardSpace, x: 2, y: 3 }
```

**parent**: To place an item on another item
```typescript
{ type: LocationType.OnCard, parent: 5 }  // On card at index 5
```

**rotation**: For tiles that can rotate
```typescript
{ type: LocationType.Landscape, x: 0, y: 0, rotation: 2 }
```

## Definition Process

### Step 1: List Physical Materials

Take the game box and list:
- Cards (how many types?)
- Tokens (how many types?)
- Boards
- Meeples
- Dice
- Other components

### Step 2: Define MaterialType

One MaterialType per **visually distinct** component type.

### Step 3: Identify Where Each Material Goes

For each MaterialType, list **all places** where it can be:
- At setup
- During play
- At game end

### Step 4: Define LocationType

Create one LocationType for each unique location.

### Step 5: Validate

Verify that:
- ✅ Each material has at least one possible location
- ✅ Locations cover all game phases
- ✅ No duplication (two LocationTypes for the same thing)

## Complete Examples

### Simple Game: Love Letter (Hypothetical)

```typescript
// 1 deck of 16 cards, 1 token per player
enum MaterialType {
  Card = 1,
  PlayerToken
}

enum LocationType {
  Deck = 1,
  PlayerHand,
  PlayedCards,
  Discard,
  TableCenter  // For active player token
}
```

### Medium Game: Splendor (Hypothetical)

```typescript
enum MaterialType {
  DevelopmentCard = 1,
  NobleCard,
  GemToken,
  GoldToken,
  PlayerBoard
}

enum LocationType {
  DevelopmentDeck = 1,      // 3 decks (id: level 1-3)
  DevelopmentDisplay,       // 12 visible cards
  NobleDeck,
  NobleDisplay,
  GemStock,
  GoldStock,
  PlayerGems,
  PlayerCards,
  PlayerBoard,
  PlayerNobles
}
```

## Common Mistakes

### ❌ Too Many MaterialTypes

```typescript
// Bad: one type per card
enum MaterialType {
  GuardCard = 1,
  PriestCard,
  BaronCard,
  // ... 16 card types
}
```

```typescript
// Good: one type, id to differentiate
enum MaterialType {
  Card = 1
}
// And in items: id: CardType.Guard
```

### ❌ Locations Too Generic

```typescript
// Bad
enum LocationType {
  OnTable = 1,
  InFront,
  Somewhere
}
```

```typescript
// Good
enum LocationType {
  Deck = 1,
  PlayerHand,
  PlayArea,
  Discard
}
```

### ❌ Forgetting Stocks

```typescript
// Bad: no stock for tokens
enum LocationType {
  PlayerTokens = 1  // Where do they come from?
}
```

```typescript
// Good: stock + player
enum LocationType {
  TokenStock = 1,
  PlayerTokens
}
```

## With Claude Code

Claude can help you define MaterialType and LocationType:

```
Prompt: "Here are my game components: [list]. Define MaterialType and LocationType"
```

Claude will:
1. Analyze the components
2. Propose relevant MaterialTypes
3. Identify necessary locations
4. Create enums with proper conventions

**Then validate yourself** by checking nothing was missed!

## Resources

- [Official Documentation - Items and Locations](https://gamepark.github.io/#/concepts/items-and-locations)
- [Code Examples](../examples/README.md)
- [Next Pattern: Game Setup](./game-setup.md)
