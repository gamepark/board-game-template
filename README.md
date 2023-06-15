# How to adapt a game for Game Park!

Welcome, developer! This documentation will guide you if you would like to adapt a board game on Game Park.

First, make sure you have an agreement with us about the game you are going to adapt.

Then, let's code 🙂

## Architecture of the games

Every game on Game Park has 2 parts: "rules" and "app".

The rules part contains the code that will run on Game Park server once the game is deployed. Here we enforce the rules and the lifecycle of the game, and we secure any private information

The app part contains a React application, that will create static files and call the Game Park API to interact with other players in real-time.

## How to run the project

### 1. Git repository
You must install Git on your computer, and create an account on Github if you do not have one.

Then, you need a repository for you game. You can either wait for us to create one, or follow this documentation: https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/duplicating-a-repository

### 2. Start a debug session
Use VSCode, Webstorm or any IDE you like to open the code on you computer.

You must also install Node.js (https://nodejs.org/) and Yarn (https://yarnpkg.com/)

Now you can install all the dependencies of the project using Yarn. Run this command in the project's folder:
```
yarn install
```
Then you should be able to start the game on your computer:
```
yarn start
```
It should open a browser window on http://localhost:3000 and display the first version of your game!

## A. Starting a new game

### 1. Design the game state

#### What is the game state?

Each game has a state. That the minimum amount of data you need to save and restore a game if you stop it at any point.

We need to describe how the game state look like in this file: [Game.ts](/rules/src/Game.ts)

That's a Typescript type. It will enforce the game state follow a precise structure.

It must be serializable as JSON into the database and across the internet, so never use any function / Map / Set or other structured type in here!

#### Guidelines for a good game state

A board game played on a table also has a state. It consists in 2 things:
1. The material (cards, tokens...) on the table, and the location of every piece - obviously;
2. The player's brains: indeed, most games requires the players to memorize some information for a short period of time, like: "who's turn it is?"

We need both for a complete game state.

### 2. The Rules API: constructor

Each game must implement the "Rules" API to run on Game Park.

This is done inside this file: [MyBoardGame.ts](/rules/src/GameRules.ts) (Rename it after you game, for example "ChessRules.ts")

It is a class that implement the Rules abstract class that comes from an external dependency: @gamepark/rules-api

Have a look at the comments in the file for an overview of the API.

After designing the Game State, we need to update the class constructor to create the correct data when a new game is started.

At any time you can test that the rules compiles: go to "/rules" and run this command line: `yarn build`

After it compiles, you can run the React application again - however, it will most likely be broken every time you change the game state, because an old game state is stored in the local storage of your browser! Open your browser console and run `game.new(2)` to start a new game with 2 players (which is the default value).

Now, you can display the initial state of the game before implement any further rules!

## B. Displaying the game

### 1. General guidelines

The game must work for computers, tablets and mobile phone.

The easier way is the ["letterbox scale mode"](https://felgo.com/doc/felgo-different-screen-sizes/)

This is already implemented in this file `/app/src/GameDisplay.tsx`: see the "Letterbox" component here.

With this in mind, you can imagine a layout that will display all the game material inside a 16:9 zone,
that will scale from a mobile display up to a computer screen.

Everything must be big enough to read on a mobile phone, or have some way to "zoom-in" later on!

*Feel free to remove the letterbox approach for something else if you think there is something better to do for your game ☺*

#### Use percentage everywhere
For the content to scale up and down inside the letterbox, we have a trick: we use the `em` unit. With a media query inside [index.tsx](/app/src/index.tsx), we made sure that 1em is 1% of the height of the letterbox.

*This is usually a bad practice on the web, however our use case is very specific, and it is very convenient to use em unit this way.*

Always use `em` unit to size and position the material inside the letterbox!

#### Use numbers sparingly
An interface full of numbers can frighten a novice player! Try to use number only when you have no other choice,
or when the player have more than 4 or 5 similar items, for example.

When there is a victory points track, it can be replaced by a number to save some space however!

#### Animations
Do not worry too much about the animations: they can be added later on.

One advice though: it is much easier to animate the elements if they all are a direct child of the letterbox component!

### 4. Display the initial state
**Your game always has a state, and the React application always displays the game state.**

Open [GameDisplay.tsx](/app/src/GameDisplay.tsx) and write react components to display the game state the way you want.

## C. The moves

### The Command pattern
On Game Park, we want to be able to replay games or undo moves easily. We use the Command design pattern for that.

A "Move" (aka Command) is a small data structure that contains all the information we need to replay something that happened during the game.

Moves are also used to animate the material in the user interface.

Moves are store in the database and sent on the network, so they must serialize into JSON and be as light as possible.

### Legal moves
In [MyBoardGame.ts](/rules/src/GameRules.ts), you must implement either `isLegalMove` or `getLegalMoves` to secure what players can do at any state.

*Use `getLegalMoves` if the number of legal moves is not to big: this way, you won't have to implement a robot to replace missing players.*

### Playing moves
The only way the game state can change during the game is by playing a move. Implement the `play` function in the rules to update the game state accordingly.

### Guidelines for designing the moves
Keep moves as light as you can: one movement of a card, shuffling a deck, adding X coin in this spot, flip a card...: those make convenient moves for animations later on.

Moves can be movement of material, or a change in the rules step: a new round, changing the active player...

Most game have "automatic moves": stuff that must be done because the rules dictates it, not because a player choose to do it.
Use the `automaticMoves` property, or `getAutomaticMoves` function, to run automatic moves after another move, or when the game has some specific state.

## D. Animations for the moves
Do not worry too much about the animations: they can be added later on.

One advice though: it is much easier to animate the elements if they all are a direct child of the letterbox component!

## E. Deploy on Game Park
**First, the rules must be deployed by Game Park (contact us for any new version).**

To deploy the application, first you must configure rclone (https://rclone.org/).

Download rclone, and make it executable (add rclone.exe in the PATH env variable on Windows)

We will provide you with an access_key_id and a secret_access_key (keep it absolutely safe!)

Then, run:

```
rclone config
> n (For "New remote)
name> [code of the game]
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

This configuration is only required once.
Now, to deploy a new version of the board game, you have 2 command lines to run:

```
yarn build
rclone sync app/build [code-of-the-game]:[code-of-the-game].game-park.com --progress --s3-acl=public-read
```

More details about this deployment method here: https://www.clever-cloud.com/blog/engineering/2020/06/24/deploy-cellar-s3-static-site/
