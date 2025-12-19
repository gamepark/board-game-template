# Working with Claude Code

This guide explains how to use Claude Code (AI) effectively to create a Game Park game.

## Why Claude Code?

Claude Code knows:
- ✅ The Game Park framework (@gamepark/rules-api, @gamepark/react-game)
- ✅ This documentation and patterns from existing games
- ✅ TypeScript, React, and best practices
- ✅ The 38+ Game Park games as reference

## Prerequisites for Claude

### Information to provide

For Claude to help you effectively, make sure to provide:

1. **The game name** you want to adapt
2. **The game rules** (link to BoardGameGeek or explanation)
3. **The game material** (cards, tokens, board, etc.)
4. **The objective**: "Create a complete game" or "Add a specific feature"

### Example of an effective prompt

```
I want to adapt the game [Game Name] on Game Park.

Rules: [BGG link or description]

Material:
- X cards of type A
- Y tokens of type B
- 1 board with Z spaces

The game is played in turns: [quick description]

Can you help me create this game? Start by defining MaterialType and LocationType.
```

## Recommended Workflow with Claude

### Phase 1: Analysis and planning (with Claude)

```
Prompt: "Analyze the game [Name] and propose a structure for MaterialType, LocationType and main rules."
```

Claude will:
1. Analyze the rules
2. Identify materials (MaterialType)
3. Identify locations (LocationType)
4. Propose a rules structure (RuleId)
5. Suggest similar games as reference

**Validate this structure before continuing!**

### Phase 2: Setup implementation (with Claude)

```
Prompt: "Create the GameSetup with these MaterialType and LocationType. Get inspired by [similar game] if necessary."
```

Claude will:
1. Create the Setup class
2. Implement setupMaterial()
3. Create items with createItem() / createItems()
4. Place them in the right locations
5. Initialize decks if needed (shuffle, deal, etc.)

**Test with `yarn start` and `game.new()` in the console!**

### Phase 3: Rules implementation (iterative with Claude)

For each rule:

```
Prompt: "Implement the [RuleName] rule: [description of what the rule does]"
```

Claude will:
1. Create the XxxRule.ts file
2. Extend PlayerTurnRule or SimultaneousRule
3. Implement getPlayerMoves() (allowed moves)
4. Implement move consequences
5. Handle transition to next rule

**Test each rule before moving to the next!**

### Phase 4: User interface (with Claude)

```
Prompt: "Create the interface to display the material. Here's what [material] looks like: [description or image]"
```

Claude will:
1. Configure Material.ts (sizes, images)
2. Create Locators (positioning)
3. Add Headers (text during the game)
4. Configure animations if needed

**Test visually in the browser!**

### Phase 5: Finishing touches (with Claude)

```
Prompt: "Add FR/EN translations and create headers for all rules"
```

Claude will:
1. Complete translations.json
2. Create all missing headers
3. Add help dialogs if necessary

## Patterns Claude Knows

Claude can automatically get inspired by existing games. Here's how:

### Reference a similar game

```
Prompt: "Implement card drafting like in Mythologies"
```

Claude will search in Mythologies code and adapt the pattern.

### Ask for examples

```
Prompt: "Show me how to handle a hand of cards like in District Noir"
```

Claude will show you the relevant code and explain it.

### Compare multiple approaches

```
Prompt: "Compare how Looot and Les Jardins Suspendus handle tile placement"
```

Claude will analyze both approaches and recommend the best for your case.

## What Claude does particularly well

### ✅ Excellent Claude help

- **Write boilerplate code** (MaterialType, LocationType, Rules structure)
- **Implement standard patterns** (deck, hand, draft, scoring)
- **Find and adapt code** from existing games
- **Debug TypeScript errors** and logic issues
- **Explain framework concepts**
- **Optimize code** and suggest improvements

### ⚠️ Limited Claude help

- **Graphic design**: Claude can code positions but not create images
- **Ambiguous rules**: If you're not clear, Claude can't guess
- **Complex edge cases**: Some rule interactions require your game expertise
- **Balance**: Claude can't judge if the game is well-balanced

## Useful Commands to give Claude

### Exploration

```
"Show me the structure of the Mythologies game"
"How does Looot handle hexagonal grids?"
"Search for examples of games with complex card effects"
```

### Implementation

```
"Create MaterialType and LocationType for [my game]"
"Implement the game setup"
"Add the rule for [specific action]"
"Fix this TypeScript error"
```

### Refactoring

```
"Simplify this code"
"Extract this logic into a helper class"
"Make this rule more readable"
```

### Documentation

```
"Explain how this rule works"
"Comment this complex code"
"Create a README for this game"
```

## Tips for Effective Collaboration

### 1. Iterate in small steps

❌ "Create the entire game"
✅ "Create MaterialType and LocationType, then we'll test"

### 2. Test frequently

After each major step:
```bash
yarn start
# In console: game.new()
```

### 3. Be specific

❌ "The game doesn't work"
✅ "I have a TypeScript error line 45: Property 'id' does not exist"

### 4. Use examples

❌ "How to make a deck?"
✅ "Show me how Mythologies creates and shuffles card decks"

### 5. Validate structure before continuing

Don't start coding rules before validating MaterialType and LocationType!

## Debugging with Claude

When something doesn't work:

1. **Copy the complete error** (from console or terminal)
2. **Show the relevant code** (Claude can read it directly)
3. **Explain what you expected**

Example:

```
I have this error in the console:
[copy error]

In file PlaceCardRule.ts line 23.
I want the player to be able to place a card from their hand on the board.
What should I fix?
```

## Access to Resources

Claude can access:

- ✅ **This documentation** (`docs/`)
- ✅ **Your code** (this project)
- ✅ **Game Park games** (if in adjacent folders or on GitHub)
- ✅ **Official Game Park documentation**
- ✅ **The framework** (@gamepark/rules-api, @gamepark/react-game)

To reference a game:

```
"Look at the code in ../mythologies to see how they handle effects"
"Compare with the along-history game"
```

## Limitations and Precautions

### Claude cannot

- Access external images or assets
- Test the game in a browser (that's your role!)
- Know undocumented rules of your game
- Guess your implementation preferences

### Always verify

- Game rules are correctly implemented
- TypeScript code compiles without error
- The game behaves as expected in the browser
- Illegal moves are properly blocked

## Example of a Complete Session

Here's an example of a typical conversation to create a simple game:

```
You: "I want to create the Love Letter game on Game Park"

Claude: "Love Letter is an excellent choice! It's a simple card game with..."
         [analyzes and proposes a structure]

You: "Perfect, start with MaterialType and LocationType"

Claude: [creates the files]

You: "Test. Ok it compiles. Now create the setup"

Claude: [implements GameSetup]

You: "I have an error: [copies error]"

Claude: [fixes it]

You: "Ok the setup works. Now implement the draw rule"

Claude: [implements DrawCardRule]

... etc
```

## Resources

- [Official Game Park Documentation](https://gamepark.github.io)
- [Code Patterns](./patterns/README.md)
- [Creation Checklist](./reference/checklist.md)
- [Code Examples](./examples/README.md)

## Summary

Claude Code is a **development partner** that:
- Speeds up boilerplate code writing
- Guides you through framework patterns
- Finds and adapts examples
- Debugs with you

But **you remain in control**:
- You know the game rules
- You test and validate
- You decide on structure
- You ensure quality

**Together, you can create a Game Park game in hours or days!**
