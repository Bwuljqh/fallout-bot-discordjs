# Fallout-bot-discordjs

Hey! This bot started as a dice bot for a french fallout ttrpg (https://fallout-rpg.com/) and is also used to display stats from Google Sheets via Google API. This bot is also a great skeleton for any discord bot made in js.


## Dependencies 

Node 16 or greater ;
npm 7 or greater ;
discord 13 or greater


## Setup slash commands
To setup slash commands use:

    node deploy-commands.js
This currently deploy the commands to a server only, to deploy them globally, got the abovementionned file, line 19 and 20

    //Routes.applicationCommands(clientId), //Global command deployment
    Routes.applicationGuildCommands(clientId, guildId), //Server command deployment  
Uncomment the first and comment or delete the second one. **Do your test in a server only**, it will take up to an hour to deploy the commands globally.

## Launch

To launch the server locally, use:

    node index.js
This exact code is hosted on heroku, the configuration is already done if you wish to host it there, you just have to input the bot Token in the settings.

## Warning
You can't have two instances of the same bot react on one interaction, maybe if you change something in event handler and use `Followup` instead of `Reply` but that's something I'll do later on.

# Credits
This bot has been made with the help of https://discordjs.guide and videos from https://link.kestrels-and-roses.rocks/youtubelyxcode