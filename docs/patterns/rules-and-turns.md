# Rules and Game Turns Pattern

Game rules define the game flow, player actions, and turn management in Game Park.

## Core Principle

Every game is composed of **Rules** that define what players can do and when. Rules are state machines that transition from one to another.

```typescript
export class MyGameRules extends MaterialRules<PlayerColor, MaterialType, LocationType> {
  rules = {
    [RuleId.PlaceCard]: PlaceCardRule,
    [RuleId.DrawCard]: DrawCardRule,
    [RuleId.EndTurn]: EndTurnRule,
    [RuleId.EndGame]: EndGameRule
  }
}
```

## Rule Types

### 1. PlayerTurnRule (Sequential)

One player plays at a time. Most common rule type.

```typescript
export class PlaceCardRule extends PlayerTurnRule<PlayerColor, MaterialType, LocationType> {

  // Define what moves the active player can make
  getPlayerMoves(): Move[] {
    const hand = this.material(MaterialType.Card)
      .location(LocationType.PlayerHand)
      .player(this.player)

    return hand.moveItems({ type: LocationType.PlayArea, player: this.player })
  }

  // Handle consequences after a move
  afterItemMove(move: ItemMove) {
    // Card was played, now draw a new one
    if (move.location.type === LocationType.PlayArea) {
      return [
        this.material(MaterialType.Card)
          .location(LocationType.Deck)
          .deck()
          .dealOne({ type: LocationType.PlayerHand, player: this.player }),
        this.nextPlayerTurn()
      ]
    }
    return []
  }
}
```

### 2. SimultaneousRule (All Players Play Together)

All players play at the same time. Used for drafting, simultaneous action selection, etc.

```typescript
export class DraftCardRule extends SimultaneousRule<PlayerColor, MaterialType, LocationType> {

  // Moves available for a specific player
  getActivePlayerLegalMoves(player: PlayerColor): Move[] {
    return this.material(MaterialType.Card)
      .location(LocationType.PlayerHand)
      .player(player)
      .moveItems({ type: LocationType.SelectedCard, player })
  }

  // Called when all players have played
  onRuleEnd() {
    // Reveal cards and continue
    return [this.startRule(RuleId.ResolveCards)]
  }
}
```

### 3. Rule (Automatic Rule)

No player interaction, executes automatically. Used for game phases, scoring, setup steps.

```typescript
export class DrawPhaseRule extends Rule<PlayerColor, MaterialType, LocationType> {

  onRuleStart() {
    const moves: Move[] = []

    // Draw 3 cards for each player
    const deck = this.material(MaterialType.Card).location(LocationType.Deck).deck()
    for (const player of this.players) {
      moves.push(deck.deal({ type: LocationType.PlayerHand, player }, 3))
    }

    // Then start player turns
    moves.push(this.startPlayerTurn(RuleId.PlayerTurn, this.players[0]))

    return moves
  }
}
```

## Starting Rules

### From Setup

```typescript
export class MyGameSetup extends MaterialGameSetup {
  start() {
    // Start with first player's turn
    this.startPlayerTurn(RuleId.PlayerTurn, this.players[0])

    // Or start with simultaneous rule
    this.startSimultaneousRule(RuleId.DraftPhase)

    // Or start with automatic rule
    this.startRule(RuleId.SetupPhase)
  }
}
```

### Transitioning Between Rules

```typescript
this.startRule(RuleId.OtherRule)  // Start new rule with the same active player
this.startPlayerTurn(RuleId.SomeRule, player)  // Change the active player
this.startSimultaneousRule(RuleId.DraftPhase)  // All players play
this.startSimultaneousRule(RuleId.DraftPhase, playersToActivate)  // All playersToActivate play
```

## Common Patterns

### Pattern 1: Simple Turn Rotation

```typescript
export class SomePlayerTurnRule extends PlayerTurnRule {
  getPlayerMoves() {
    // Return possible moves
  }

  afterItemMove(move: ItemMove) {
    // After player plays, go to next player
    return [this.startPlayerTurn(RuleId.SameRule, this.nextPlayer)]
  }
}
```

**Used in**: Most card games, simple board games

### Pattern 2: Action Selection that is not a movement of material

```typescript
// Step 1: Player chooses action
export class ChooseActionRule extends PlayerTurnRule {
  getPlayerMoves() {
    return [
      this.customMove(CustomMoveType.Pass),
      this.customMove(CustomMoveType.ChoosePlayer, somePlayer)
    ]
  }

  onCustomMove(move: CustomMove) {
    if (move.type === CustomMoveType.Pass) {
      return [this.startRule(RuleId.ResolveAction)]
    }
    return []
  }
}
```

**Used in**: most games

### Pattern 3: Round System

```typescript
export class RoundStartRule extends Rule {
  onRuleStart() {
    const round = this.remind(Memory.CurrentRound) || 1

    if (round > 10) {
      // Game ends after 10 rounds
      return [this.startRule(RuleId.EndGame)]
    }

    // Start new round
    return [
      this.material(MaterialType.RoundToken).moveItem({
        type: LocationType.RoundTrack,
        id: round
      }),
      this.startPlayerTurn(RuleId.PlayerTurn, this.players[0])
    ]
  }
}

export class RoundEndRule extends Rule {
  onRuleStart() {
    const round = this.remind(Memory.CurrentRound) || 1
    this.memorize(Memory.CurrentRound, round + 1)

    return [this.startRule(RuleId.RoundStart)]
  }
}
```

**Used in**: Games with distinct rounds

### Pattern 4: Simultaneous Draft (All Players Choose)

```typescript
export class DraftRule extends SimultaneousRule {
  getActivePlayerLegalMoves(player: PlayerColor) {
    return this.material(MaterialType.Card)
      .location(LocationType.PlayerHand)
      .player(player)
      .moveItems({ type: LocationType.SelectedCard, player })
  }
  
  afterItemMove(move: ItemMove) {
    if (...) {
      const player = ...
      return this.endPlayerTurn(player)
    }
    return []
  }

  getMovesAfterPlayersDone() {
    // When all players selected, reveal and resolve
    return [this.startRule(RuleId.RevealCards)]
  }
}
```

**Used in**: Mythologies, drafting games

### Pattern 5: Conditional Turn Order

```typescript
export class PlayerTurnRule extends PlayerTurnRule {
  afterItemMove(move: ItemMove) {
    // If player draws last card, they play again
    const deck = this.material(MaterialType.Card).location(LocationType.Deck)
    if (deck.length === 0) {
      return []  // Same player plays again
    }

    // Otherwise next player
    return [this.startPlayerTurn(RuleId.SomeRule, this.nextPlayer)]
  }
}
```

**Used in**: Games where turn order can change

### Pattern 6: End Game Detection

```typescript
export class PlayerTurnRule extends PlayerTurnRule {
  afterItemMove(move: ItemMove) {
    // Check end game condition
    if (this.isGameOver()) {
      return [this.endGame()]
    }

    return [this.nextPlayerTurn()]
  }

  private isGameOver(): boolean {
    // Example: Game ends when deck is empty
    return this.material(MaterialType.Card).location(LocationType.Deck).length === 0

    // Or: Game ends when a player reaches 10 points
    // return this.players.some(p => this.getScore(p) >= 10)
  }
}
```

**Used in**: Almost all games

## Complete Example: Card Game

```typescript
// RuleId.ts
export enum RuleId {
  DealCards = 1,
  PlayerTurn,
  DrawCard,
  EndGame
}

// DealCardsRule.ts - Automatic setup phase
export class DealCardsRule extends Rule {
  onRuleStart() {
    const deck = this.material(MaterialType.Card).location(LocationType.Deck).deck()
    const moves: Move[] = []

    // Deal 5 cards to each player
    for (const player of this.players) {
      moves.push(deck.deal({ type: LocationType.PlayerHand, player }, 5))
    }

    // Start first player's turn
    moves.push(this.startPlayerTurn(RuleId.PlayerTurn, this.players[0]))

    return moves
  }
}

// PlayerTurnRule.ts - Main game turn
export class PlayerTurnRule extends PlayerTurnRule {
  getPlayerMoves() {
    // Player can play any card from hand
    return this.material(MaterialType.Card)
      .location(LocationType.PlayerHand)
      .player(this.player)
      .moveItems({ type: LocationType.PlayArea, player: this.player })
  }

  afterItemMove(move: ItemMove) {
    // After playing, draw a card
    const deck = this.material(MaterialType.Card).location(LocationType.Deck)

    if (deck.length === 0) {
      // Game ends when deck is empty
      return [this.startRule(RuleId.EndGame)]
    }

    return [
      deck.deck().dealOne({ type: LocationType.PlayerHand, player: this.player }),
      this.nextPlayerTurn()
    ]
  }
}

// EndGameRule.ts - Calculate winner
export class EndGameRule extends Rule {
  onRuleStart() {
    // Calculate scores
    for (const player of this.players) {
      const score = this.calculateScore(player)
      this.memorize(Memory.Score(player), score)
    }

    // End the game
    return [this.endGame()]
  }

  private calculateScore(player: PlayerColor): number {
    return this.material(MaterialType.Card)
      .location(LocationType.PlayArea)
      .player(player)
      .getItems()
      .reduce((sum, card) => sum + card.id.value, 0)
  }
}
```

## Custom Moves

When item moves aren't enough, create custom moves.

```typescript
// CustomMove.ts
export enum CustomMoveType {
  ChooseAction = 1,
  ConfirmSelection,
  SkipTurn
}

export type ChooseAction = {
  type: CustomMoveType.ChooseAction
  action: ActionType
}

export type CustomMove = ChooseAction | ConfirmSelection | SkipTurn

// In a rule
export class ChooseActionRule extends PlayerTurnRule {
  getPlayerMoves(): Move[] {
    return [
      { type: CustomMoveType.ChooseAction, action: ActionType.Draw },
      { type: CustomMoveType.ChooseAction, action: ActionType.Play }
    ]
  }

  onCustomMove(move: ChooseAction) {
    switch (move.action) {
      case ActionType.Draw:
        return [/* draw card */, this.nextPlayerTurn()]
      case ActionType.Play:
        return [this.startPlayerTurn(RuleId.PlayCard, this.player)]
    }
  }
}
```

## Memory System

Store temporary game state.

```typescript
// Memory.ts
export enum Memory {
  CurrentRound = 1,
  FirstPlayer,
  ChosenAction,
  PendingEffects
}

// Usage in rules
export class SomeRule extends Rule {
  onRuleStart() {
    // Read memory
    const round = this.remind(Memory.CurrentRound) || 1

    // Write memory
    this.memorize(Memory.CurrentRound, round + 1)

    // Clear memory
    this.forget(Memory.ChosenAction)

    return []
  }
}
```

## Testing Rules

```typescript
import { describe, it, expect } from 'vitest'
import { setupGame } from './test-utils'

describe('PlayerTurnRule', () => {
  it('should allow playing cards from hand', () => {
    const game = setupGame()
    const rule = new PlayerTurnRule(game)

    const moves = rule.getPlayerMoves()
    expect(moves.length).toBeGreaterThan(0)
  })

  it('should transition to next player after move', () => {
    const game = setupGame()
    const rule = new PlayerTurnRule(game)

    const consequences = rule.afterItemMove(/* move */)
    expect(consequences).toContainEqual(
      expect.objectContaining({
        type: MoveType.StartRule,
        player: PlayerColor.Red  // Next player
      })
    )
  })
})
```

## Common Mistakes

### ❌ Forgetting to Return Moves

```typescript
// Bad: No return value
onRuleStart() {
  this.startPlayerTurn(RuleId.PlayerTurn, this.players[0])
}

// Good: Return array of moves
onRuleStart() {
  return [this.startPlayerTurn(RuleId.PlayerTurn, this.players[0])]
}
```

### ❌ Returning Empty Array When Rule Should Transition

```typescript
// Bad: Rule ends without transitioning
afterItemMove(move: ItemMove) {
  // Do something
  return []  // Game is stuck!
}

// Good: Always transition
afterItemMove(move: ItemMove) {
  return [this.nextPlayerTurn()]
}
```

### ❌ Not Handling All Move Types

```typescript
// Bad: Only handles ItemMove
afterItemMove(move: ItemMove) {
  return [this.nextPlayerTurn()]
}
// Custom moves won't work!

// Good: Also implement onCustomMove if needed
onCustomMove(move: CustomMove) {
  // Handle custom moves
  return [this.nextPlayerTurn()]
}
```

## With Claude Code

```
Prompt: "Create a PlayerTurnRule where players can [describe action]. After playing, [describe consequence]. Then it's the next player's turn."
```

Claude will:
1. Create the Rule file with proper structure
2. Implement getPlayerMoves() with correct filters
3. Implement afterItemMove() with consequences
4. Handle turn transition properly

## Resources

- [Official Documentation - Rules](https://gamepark.github.io/#/concepts/rules)
- [Game Setup Pattern](./game-setup.md)
- [Moves and Consequences](./moves.md) *(Coming soon)*
- [Examples](../examples/README.md)
