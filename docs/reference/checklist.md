# Game Park Game Creation Checklist

This checklist guides you step-by-step through creating a complete game.

## Phase 0: Preparation (30-60 min)

- [ ] **Choose the game** to adapt
- [ ] **Obtain license agreement** (contact Game Park on Discord)
- [ ] **Read the rules** several times until mastered
- [ ] **Play the game** physically if possible
- [ ] **Identify a similar game** already on Game Park (for inspiration)
- [ ] **Gather images** (scans of cards, boards, etc.)

## Phase 1: Basic Structure (30 min)

- [ ] **Clone the template**
  ```bash
  git clone https://github.com/gamepark/board-game-template.git my-game
  cd my-game
  yarn install
  ```

- [ ] **Rename the project**
  - [ ] Replace `GameTemplate` with `MyGame` in all files
  - [ ] Replace `game-template` with `my-game`
  - [ ] Update package.json files
  - [ ] Rename Rules, Setup, Options files

- [ ] **Define player colors** (PlayerColor.ts)
  - [ ] Adjust according to player count (typically 2-6)

- [ ] **Test that it compiles**
  ```bash
  yarn start
  ```

## Phase 2: MaterialType and LocationType (10-20 min)

- [ ] **List all physical components** of the game
- [ ] **Define MaterialType** (material/MaterialType.ts)
  - [ ] One enum per distinct component type
  - [ ] Start at 1, not 0
  - [ ] Singular names

- [ ] **Identify all possible locations**
- [ ] **Define LocationType** (material/LocationType.ts)
  - [ ] Deck, Hand, Board, etc.
  - [ ] Consider stocks, discards
  - [ ] Per-player locations if necessary

- [ ] **Validate** that each material has at least one location

## Phase 3: Game Setup (30-90 min)

- [ ] **Implement setupMaterial()** (MyGameSetup.ts)
  - [ ] Create fixed boards
  - [ ] Create and shuffle decks
  - [ ] Create per-player material
  - [ ] Create resource/token stocks
  - [ ] Deal initial material if necessary

- [ ] **Implement start()**
  - [ ] Define the first game rule

- [ ] **Test the setup**
  ```javascript
  // In browser console
  game.new()
  game.view
  ```

- [ ] **Verify** that all items are created correctly

## Phase 4: Game Options (15 min) [Optional]

- [ ] **Define options** (MyGameOptions.ts)
  - [ ] Player count
  - [ ] Rule variants
  - [ ] Difficulty level
  - [ ] Expansions

## Phase 5: Game Rules (2-8 hours)

- [ ] **Identify all rules** (game phases)
- [ ] **Define RuleId** (rules/RuleId.ts)
  - [ ] One entry per rule/phase

For each rule:
- [ ] **Create XxxRule.ts file**
- [ ] **Extend PlayerTurnRule or SimultaneousRule**
- [ ] **Implement getPlayerMoves()** (allowed actions)
- [ ] **Handle consequences** of moves
- [ ] **Implement transition** to next rule
- [ ] **Test the rule** before moving to the next

Common rules to implement:
- [ ] Main player turn
- [ ] End of turn
- [ ] Scoring
- [ ] End game
- [ ] (Optional) Additional setup
- [ ] (Optional) Draft/Simultaneous selection

## Phase 6: Material.ts - Display (30-60 min)

- [ ] **Configure Material.ts** (app/src/material/Material.ts)

For each MaterialType:
- [ ] **Define width** (width in cm)
- [ ] **Define height** (height in cm) or ratio
- [ ] **Define images** (path to images)
  - [ ] If single image: `images: { en: '/images/board.jpg' }`
  - [ ] If multiple: function `id => '/images/card-${id}.jpg'`
- [ ] **Define staticItem** (if always only 1) [Optional]

## Phase 7: Images (60-120 min)

- [ ] **Prepare images**
  - [ ] Scan or retrieve visuals
  - [ ] Name according to conventions (card-1.jpg, token-blue.png, etc.)
  - [ ] Optimize size (not too heavy)

- [ ] **Place in app/public/images/**

- [ ] **Verify in browser** that images display

## Phase 8: Locators - Positioning (60-120 min)

- [ ] **Configure Locators.ts** (app/src/locators/Locators.ts)

For each LocationType:
- [ ] **Create appropriate Locator**
  - [ ] DeckLocator for decks/piles
  - [ ] HandLocator for card hands
  - [ ] GridLocator for grids
  - [ ] LineLocator for rows
  - [ ] Or custom Locator with parentItemLocation()

- [ ] **Adjust positions** (x, y, z)
- [ ] **Test visually** in browser
- [ ] **Adjust until satisfied**

## Phase 9: Headers - Game Text (30-60 min)

- [ ] **Create Headers.tsx** (app/src/headers/Headers.tsx)

For each RuleId:
- [ ] **Create XxxHeader.tsx file**
- [ ] **Display text** explaining what's happening
- [ ] **Translate in FR and EN** (translations.json)

- [ ] **Test** that headers display correctly during game

## Phase 10: Animations [Optional] (30-60 min)

- [ ] **Configure GameAnimations.ts** (app/src/animations/GameAnimations.ts)
  - [ ] Custom durations
  - [ ] Special animations (flip, rotation, etc.)

## Phase 11: Player Panels [Optional] (30-60 min)

- [ ] **Customize PlayerPanels.tsx** (app/src/panels/PlayerPanels.tsx)
  - [ ] Display player resources
  - [ ] Display score
  - [ ] Display other relevant info

## Phase 12: Tests and Debug (60-120 min)

- [ ] **Test all game scenarios**
  - [ ] Games with 2, 3, 4 players
  - [ ] All possible move types
  - [ ] Edge cases (empty deck, ties, etc.)

- [ ] **Use console commands**
  ```javascript
  game.new()
  game.view
  game.legalMoves
  game.undo
  ```

- [ ] **Fix found bugs**

- [ ] **Verify rules are enforced**
  - [ ] Impossible to play illegal moves
  - [ ] Scores are correct
  - [ ] End game works

## Phase 13: Tutorial [Optional] (2-4 hours)

- [ ] **Create MyGameTutorial.ts** (rules/src/tutorial/)
- [ ] **Define tutorial steps**
- [ ] **Test complete tutorial**

## Phase 14: Help & Polish (60 min)

- [ ] **Add help cards** (HelpCard MaterialType)
- [ ] **Create help dialogs** (app/src/dialogs/)
- [ ] **Verify all translations**
- [ ] **Optimize performance** if necessary

## Phase 15: Documentation & Delivery (30 min)

- [ ] **Update game README**
  - [ ] Game name
  - [ ] Credits (author, publisher, artist)
  - [ ] Link to official rules

- [ ] **Commit and push** to Git
  ```bash
  git add .
  git commit -m "Initial implementation of MyGame"
  git push
  ```

- [ ] **Notify Game Park** that the game is ready

## Time-Saving Tips

### With Claude Code

Use Claude for:
- ✅ Create MaterialType and LocationType
- ✅ Write complete Setup
- ✅ Generate rule files
- ✅ Create Material.ts and Locators.ts
- ✅ Translate texts

### Frequent Testing

- Test after each major phase
- Don't wait until everything is finished to test
- Use `game.new()` constantly in console

### Get Inspired by Existing Games

- Find a similar game on Game Park
- Copy/adapt patterns that work
- Ask Claude to compare approaches

## Estimated Times

| Simple Game | Medium Game | Complex Game |
|-------------|-------------|--------------|
| 1-2 days    | 3-5 days    | 1-2 weeks    |

**Simple Game**: Few rules, little material (e.g., Love Letter, 6 Nimmt)
**Medium Game**: Standard rules, average material (e.g., Splendor, Ticket to Ride)
**Complex Game**: Many rules, lots of material (e.g., Terraforming Mars, Wingspan)

## If You Get Stuck

1. **Consult official documentation**: https://gamepark.github.io
2. **Look at a similar game** that exists
3. **Ask Claude** to help you
4. **Ask on Discord** Game Park

## Final Validation Checklist

Before declaring the game complete:

- [ ] Game compiles without TypeScript errors
- [ ] No errors in browser console
- [ ] All rules are implemented
- [ ] Illegal moves are blocked
- [ ] Images display correctly
- [ ] Animations are smooth
- [ ] Texts are translated (FR + EN)
- [ ] Scoring is correct
- [ ] End game works
- [ ] Game is playable and enjoyable

Congratulations, your game is ready! 🎉
