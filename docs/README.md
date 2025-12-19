# Game Park Template Documentation

This documentation is designed to facilitate the creation of new games on the Game Park platform using this template.

## Who is this documentation for?

- **Human developers**: Complete guide to adapt a board game
- **Claude Code (AI)**: Context and patterns to efficiently assist in game creation
- **Contributors**: Reference of patterns used in 48+ existing games

## Documentation Structure

### 🚀 [Quick Start Guide](./quick-start.md)
Get started quickly with this template: installation, configuration, first launch.

### 🤖 [Working with Claude Code](./working-with-claude.md)
Specific guide for using Claude Code effectively in Game Park game creation.

### 📚 [Patterns and Examples](./patterns/README.md)
Common patterns extracted from existing games:
- [MaterialType and LocationType](./patterns/material-and-location.md)
- [Game Setup](./patterns/game-setup.md)
- [Rules and Turns](./patterns/rules-and-turns.md)
- [Moves and Consequences](./patterns/moves.md)
- [User Interface](./patterns/ui-patterns.md)
- [Locators and Animations](./patterns/locators-animations.md)

### 💡 [Code Examples](./examples/README.md)
Real code snippets from existing games with explanations.

### 📖 [Quick Reference](./reference/README.md)
- [Creation Checklist](./reference/checklist.md)
- [Useful Commands](./reference/commands.md)
- [File Structure](./reference/file-structure.md)
- [Code Conventions](./reference/conventions.md)

## Game Park Technical Documentation

This documentation complements the [official technical documentation](https://gamepark.github.io) which covers:
- Fundamental concepts (Material approach, Items & Locations, etc.)
- Complete step-by-step tutorial
- Advanced features (hiding strategies, location strategies, etc.)
- Troubleshooting

**Important**: Always consult the official documentation for basic concepts and framework features.

## Reference Games

38 games are available as examples. The most relevant for learning:

**Simple games (good for beginners)**:
- `district-noir`: Simple card game, player hand
- `double-seven`: Straightforward rules

**Medium games (intermediate patterns)**:
- `looot`: Tile placement, hexagonal grid
- `les-jardins-suspendus`: Strategic placement, scoring

**Complex games (advanced features)**:
- `mythologies`: Card drafting, multiple effects
- `architects-of-amytis`: Multiple material and location types
- `along-history`: Cards with multiple properties
- `arackhan-wars`: Combat system, numerous rules

## Development Philosophy

### Start Simple
- Start with MaterialType and LocationType
- Implement basic setup
- Add one rule at a time
- Test frequently with console commands

### Reuse Patterns
- Don't reinvent the wheel: get inspired by existing games
- Use framework helper classes
- Follow established conventions

### Iterate Quickly
- The framework allows very fast browser testing
- Use console commands to test specific situations
- Add visuals at the end, focus on rules first

## Next Steps

1. 📖 Read the [Quick Start Guide](./quick-start.md)
2. 🎮 Choose your game to adapt
3. 📋 Follow the [Creation Checklist](./reference/checklist.md)
4. 💻 Start coding with [Claude Code](./working-with-claude.md) help

## Contributing to this Documentation

This documentation evolves with newly created games. If you discover new patterns or best practices, feel free to document them here.
