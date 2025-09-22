# How to adapt a game for Game Park!

Welcome, developer! This documentation will guide you if you would like to adapt a game for [Game Park](https://game-park.com/).

First, make sure you have an agreement with us about the game you are going to adapt.

Then, let's code 🙂

## 1. Create a new project

You must install [Git](https://git-scm.com/) on your computer, and create an account on [GitHub](https://github.com/) if you do not have one.

Then, you need a repository for you game. You can either wait for us to create one, or
use [our template on GitHub](https://github.com/gamepark/game-template)
to [create a new repository](https://docs.github.com/fr/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)

We recommend to use this syntax to name the repository: "name-of-your-game"

## 2. Start the game

Use [Visual Studio Code](https://code.visualstudio.com/), [Webstorm](https://www.jetbrains.com/fr-fr/webstorm/) or any IDE you like to open the code on you
computer.

You must also install [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/)

The project has dependencies, which you can find inside [/app/package.json](/app/package.json) and [/rules/package.json](/rules/package.json).

You must install the dependencies using Yarn. Run this command line in the project's folder: `yarn install`

Now, you should be able to start the game on your computer: `yarn start`

It should open a browser window on http://localhost:3000 and display the first version of your game. It is a debug session: if you change something in the code,
it will automatically apply the changes!

This version does not interact with Game Park servers. It is 100% local. Inside the console of this browser window, you can run those commands:

- Start a new game with X players: `game.new(X)` (default is 2)
- Have the other players play automatically random moves: `game.monkeyOpponents(true)`
- Undo the last move: `game.undo()`

## 3. The code

Every game on Game Park has 2 parts: ["rules"](/rules) and ["app"](/app).

The rules part contains the code that will run on Game Park servers once the game is deployed. Here we enforce the rules and the lifecycle of the game.

The app part contains a [React](https://react.dev/) application, that will create static files and call the Game Park API to interact with other players in
real-time.

### 3.0 Rename the default values in the template

Search and replace in **every file**:

- `Game Template` => `Name of your Game`
- `GameTemplate` => `NameOfYourGame`
- `game-template` => `name-of-your-game`

### 3.1 The Material

Board game have Material, made of cards, boards, tokens...

The file [MaterialType.ts](/rules/src/material/MaterialType.ts) lists the types of Material in the game.

_Tips: add you material types one by one. If you have different kinds of boards, cards or token that never mix together, use a different type for each of them._

Example:

```
export enum MaterialType {
  Card = 1
}
```

When you add a new MaterialType in the rules, you have to describe how it looks like in the app, inside [Material.ts](/app/src/material/Material.ts).

Example:

```
import back from '../images/cards/back.jpg'
import card1 from '../images/cards/card-1.jpg'
import card2 from '../images/cards/card-2.jpg'
import card3 from '../images/cards/card-3.jpg'

export const Material: Record<MaterialType, MaterialDescription> = {
  [MaterialType.Card]: myCardDescription,
}

class MyCardDescription extends CardDescription {
  backImage: back
  images: {
    [TheCardEnumId.SomeId1]: card1,
    [TheCardEnumId.SomeId2]: card2,
    [TheCardEnumId.SomeId3]: card3
  }
}

export const myCardDescription = new MyCardDescription()
```

### 3.2 The Locations

In a board game, most material move around different places: the table, the player hand...

This concept is name "Location".

The file [LocationType.ts](/rules/src/material/LocationType.ts) lists the types of locations in the game.

_Tips: add you location types one by one. Locations are used to position the Material on the screen._

When you add a new LocationType in the rules, you have to create a new "Locator" in the app, inside [Locators.ts](/app/src/locators/Locators.ts).

Example:

```
export const Locators: Record<LocationType, Locator<PlayerColor, MaterialType, LocationType>> = {
  [LocationType.Hand]: new PlayerHandLocator(),
}

export class PlayerHandLocator extends HandLocator<PlayerColor, MaterialType, LocationType> {
  coordinates = { x: 5, y: 20 }
}
```

### 3.3 The setup

Once you have one Material type and one Location type, you can start to setup a new game in [GameTemplateRules.ts](/rules/src/GameTemplateRules.ts)

You can easily create and manipulate the material in the setup:

```
  setup() {
    this.setupMaterial(MaterialType.Card).createItems([
      {id: TheCardEnumId.SomeId1, location: { type: LocationType.Hand }},
      {id: TheCardEnumId.SomeId2, location: { type: LocationType.Hand }},
      {id: TheCardEnumId.SomeId3, location: { type: LocationType.Hand }},
    ])
  }
```

Now, you can run `yarn start`, then `game.new()` in the browser console, and you should see the 3 cards in you hand!

### 3.4 The Rules Parts

Example in [ExpeditionRules](https://github.com/gamepark/expedition/blob/master/rules/src/ExpeditionRules.ts#L34): `get rules()`

### 3.5 Automatically order the Material

Example in [ExpeditionRules](https://github.com/gamepark/expedition/blob/master/rules/src/ExpeditionRules.ts#L54): `get locationsStrategies()`

### 3.6 Hiding stuff to players

Example in [ExpeditionRules](https://github.com/gamepark/expedition/blob/master/rules/src/ExpeditionRules.ts#L45): `get hidingStrategies()`

## 4. Deploy on Game Park

The rules part will always be deployed by Game Park team (contact us for any new version)

You can however deploy the React application, using [rclone](https://rclone.org/)

Download rclone, and make it executable (add rclone.exe in the PATH env variable on Windows)

We will provide you with an **access_key_id** and a **secret_access_key** (keep it absolutely safe!)

Then, run:

```
rclone config
> n (For "New remote)
name> game-template
Storage> s3 (Amazon S3 Compliant Storage Provider)
provider> Other
env_auth> false
access_key_id> [Enter your access key id here - Never commit that on Git!]
secret_access_key> [Enter you secret access key here - Never commit that on Git!]
region> [Leave empty]
endpoint> cellar-c2.services.clever-cloud.com
location_constraint> [Leave empty]
acl> public-read
Edit advanced config> n
```

This configuration is only required once per game.

Now you can deploy a new version of the React application with this command:

```
yarn deploy
```
