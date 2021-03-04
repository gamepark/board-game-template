# How to adapt a game for Game Park!

Welcome, developer! This documentation will guide you if you would like to adapt a board game on Game Park.

First, make sure you have an agreement with us about the game you are going to adapt.

Then, let's code 🙂

## 1. Mirror this repository
You must install Git on your computer, and create an account on Github if you do not have one.

Then, execute the following git commands (make sure to replace "your-game-code" with you real game code provided by Game Park):
```
git clone --bare https://github.com/gamepark/board-game-template your-game-code
```
Go into the folder that was created:
```
cd your-game-code
```
Finally, push the project on your own Github repository (create it first):
```
git push --mirror https://github.com/your-github-username/your-game-code.git
```

## 2. Run the project
Use VSCode, Webstorm or any IDE you like to open the code on you computer.

You must also install Node Package Manager (https://www.npmjs.com/) and Yarn (https://yarnpkg.com/)

Now you can install all the dependencies of the project using Yarn. Run this command in the project's folder:
```
yarn install
```
Then you should be able to start the game on your computer:
```
yarn start
```
It should open a browser window on http://localhost:3000 and display the first version of your game!

## 3. Design the user experience

### Layout the game material

#### The letterbox scale mode

The game must work for computers, tablets and mobile phone.

The easier way is the ["letterbox scale mode"](https://felgo.com/doc/felgo-different-screen-sizes/)

This is already implemented in this file `/app/src/GameDisplay.tsx`: see the "Letterbox" component here.

With this in mind, you can imagine a layout that will display all the game material inside a 16:9 zone,
that will scale from a mobile display up to a computer screen.

Everything must be big enough to read on a mobile phone, or have some way to "zoom-in" later on!

*Feel free to remove the letterbox approach for something else if you think there is something better to do for your game ☺*

#### Use percentage everywhere
For the content to scale up and down inside the letterbox, you should only use `%` and `em` units in your CSS code.

### Use numbers sparingly
An interface full of numbers can frighten a novice player! Try to use number only when you have no other choice,
or when the player have more than 4 or 5 similar items, for example.

When there is a victory points track, it can be replaced by a number to save some space however!

### Animations
Do not worry too much about the animations: they can be added later on.

One advice though: it is much easier to animate the elements if they all are a direct child of the letterbox component!

## 42. Deploy on Game Park
**First, the rules must be deployed by Game Park (contact us for any new version).**

To deploy the application, first you must configure rclone (https://rclone.org/).

Download rclone, and make it executable (add rclone.exe in the PATH env variable on Windows)

We will provide you with an access_key_id and a secret_access_key (keep it absolutely safe!)

Then, run:

```
rclone config
> n (For "New remote)
name> [code of the game]
Storage> 4 (Amazon S3 Compliant Storage Provider)
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
