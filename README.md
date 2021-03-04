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
