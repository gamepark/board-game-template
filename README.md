# Game Park - Board Game Template

Template to adapt board games for [Game Park](https://game-park.com/).

## Documentation

**Full documentation: [gamepark.github.io](https://gamepark.github.io)**

## Prerequisites

- Agreement with Game Park for the game to adapt
- [Git](https://git-scm.com/) and [GitHub](https://github.com/) account
- [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/)

## Quick Start

```bash
yarn install
yarn start
```

The game opens at http://localhost:3000.

### Console commands (browser)

```javascript
game.new(2)               // New game (2 players)
game.monkeyOpponents(true) // Opponents play automatically
game.undo()               // Undo last move
```

## Project Setup

Search and replace in all files:

- `Game Template` → `Your Game Name`
- `GameTemplate` → `YourGameName`
- `game-template` → `your-game-name`

## Deployment

Rules are deployed by the Game Park team.

To deploy the React app, install [rclone](https://rclone.org/) then configure:

```
rclone config
> n
name> game-template
Storage> s3
provider> Other
env_auth> false
access_key_id> [your key - do not commit!]
secret_access_key> [your secret - do not commit!]
region> [empty]
endpoint> cellar-c2.services.clever-cloud.com
location_constraint> [empty]
acl> public-read
Edit advanced config> n
```

Then deploy with:

```bash
yarn deploy
```
