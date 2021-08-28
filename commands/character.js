const data = require("./data/char.json");
const fs = require("fs");
const {google} = require("googleapis");
const readline = require("readline");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const {options} = require("snekfetch");

module.exports = {
    data : new  SlashCommandBuilder()
        .setName('character')
        .setDescription('Display elements of a character sheet')
        .addSubcommand(sub_commands_setup =>
        sub_commands_setup
            .setName('sub_commands_setup')
            .setDescription('Edit character data')
            .setName('setup')
            .addStringOption(name =>
            name
                .setName('name')
                .setDescription("Enter the name you wish to configure")
                .setRequired(false))
            .addStringOption(url =>
                url
                    .setName('url')
                    .setDescription("Enter the url you wish to configure")
                    .setRequired(false)
            ).addUserOption( user =>
            user.setName('user')
                .setDescription('The user you wish to setup, need admin privilege')
                .setRequired(false)
            )
        ).addSubcommand(sub_commands_show =>
        sub_commands_show
            .setName('show')
            .setDescription('Show a character data')
            .addStringOption(info =>
                info.setName('info')
                    .setDescription('Fetch the given information')
                    .setRequired(true)
                    .addChoice("Skills", 'skills')
                    .addChoice("Know", 'know')
                    .addChoice("Name", 'name')
                    .addChoice("Url", 'url')
                    .addChoice('Recap','recap'))
            .addStringOption(option =>
                option
                    .setName('user')
                    .setDescription('Target user, if left empty you are the target')
            )
        ),
    execute(client, interaction) {

        let command = interaction.options.getSubcommand();
        let user = interaction.user;

        let show_user;
        switch (command) {
            case 'setup':
                if (interaction.member.permissions.has('ADMINISTRATOR')) { //check for administrator privilege if the subcommand setup has been given as well as a user
                    let user_temp = interaction.options.getUser('user');
                    if ( user_temp == null) {
                        show_user = user
                    } else show_user = user_temp;
                } else return interaction.reply('You don\'t have admin privilege and thus can\'t edit someone else\'s profile');
                break;
            case 'show':
                let user_temp = interaction.options.getUser('user');
                if (user_temp == null) {
                    show_user = user;
                }
                else show_user = user_temp;
        }

        let user_id = show_user.id;
        let data = require("./data/char.json");
        let url = interaction.options.getString("url"); //global url needed because I don't know how to pass arguments with Google API

        const Discord = require('discord.js');
        const fs = require('fs');
        const readline = require('readline');
        const {google} = require('googleapis');

        if (command === 'show'){
            if (!data.hasOwnProperty(user_id)) {
                return interaction.reply("This user does not exist, please use `/char setup [name] [url]` to setup a user");
        } else
            if (!validSheet(data[user_id]["sheeturl"])) {
                return interaction.reply("This user has no valid url, please set it up using `/char setup [name] [url]`");
            }
        }

        //const regexChar = /<@!\d*>/g; //used before when if you didn't want to tag a user and wanted to just input them directly, may reuse it later

        // If modifying these scopes, delete token.json.
        const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
        // The file token.json stores the user's access and refresh tokens, and is
        // created automatically when the authorization flow completes for the first
        // time.
        const TOKEN_PATH = 'token.json';

        // Load client secrets from a local file.
        fs.readFile('credentials.json', (err, content) => {
                if (err) return console.log('Error loading client secret file:', err);
                // Authorize a client with credentials, then call the Google Sheets API.

                //Core code
                switch (command) {
                    case "error": //This is legacy code and should never be true
                        return interaction.reply("An error that was not expected happened, if you get that message that's really weird");
                    case 'show': //Calls functions to display the information
                        switch (interaction.options.getString('info')) {
                            case "skills":
                                authorize(JSON.parse(content), skillChar);
                                break;
                            case "know":
                                authorize(JSON.parse(content), connChar);
                                break;
                            case 'name':
                                return interaction.reply("The current name is: "+data[user_id]["name"]);
                            case 'url' :
                                return interaction.reply("The current url is: "+data[user_id]["sheeturl"]);
                            case 'recap' :
                                authorize(JSON.parse(content), recapChar);
                                break;
                        } break;

                    case "setup":
                        let name =interaction.options.getString("name") ;
                        if (name == null &&  url == null){
                            return interaction.reply("You need to provide at least one of `name` oe `reply` in order to proceed with the setup")
                        }
                        if (name != null)
                        {
                            changeName(name);
                        }
                        if (url != null){
                            if (validURL(url) && validSheet(url))
                            {
                                authorize(JSON.parse(content), callChangeUrl);
                            } else {
                                return interaction.reply("This is not a valid google sheet url");
                            }
                        }
                        break;
                    default:
                            interaction.reply('Invalid arguments, but that shouldn\'t be possible');

                }
            }
        );

        /**
         * Create an OAuth2 client with the given credentials, and then execute the
         * given callback function.
         * @param {Object} credentials The authorization client credentials.
         * @param {function} callback The callback to call with the authorized client.
         */
        function authorize(credentials, callback) {
            const {client_secret, client_id, redirect_uris} = credentials.installed;
            const oAuth2Client = new google.auth.OAuth2(
                client_id, client_secret, redirect_uris[0]);

            // Check if we have previously stored a token.
            fs.readFile(TOKEN_PATH, (err, token) => {
                if (err) return getNewToken(oAuth2Client, callback);
                oAuth2Client.setCredentials(JSON.parse(token));
                callback(oAuth2Client);
            });
        }

        /**
         * Get and store new token after prompting for user authorization, and then
         * execute the given callback with the authorized OAuth2 client.
         * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
         * @param {getEventsCallback} callback The callback for the authorized client.
         */
        function getNewToken(oAuth2Client, callback) {
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES,
            });
            console.log('Authorize this app by visiting this url:', authUrl);
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            rl.question('Enter the code from that page here: ', (code) => {
                rl.close();
                oAuth2Client.getToken(code, (err, token) => {
                    if (err) return console.error('Error while trying to retrieve access token', err);
                    oAuth2Client.setCredentials(token);
                    // Store the token to disk for later program executions
                    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                        if (err) return console.error(err);
                        console.log('Token stored to', TOKEN_PATH);
                    });
                    callback(oAuth2Client);
                });
            });
        }

        /**
         * Sanitize a string for a json input
         * @param unsanitized supposedely malicious string
         * @returns {string}
         */
        function sanitizeJSON(unsanitized) {
            return unsanitized.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\f/g, "\\f").replace(/"/g, "\\\"").replace(/'/g, "\\\'").replace(/\&/g, "\\&");
        }

        /**
         * Change the name of an entry in a json, if the entry does not exist, create it.
         */
        function changeName(nameUnsanitized) {
            let name = sanitizeJSON(nameUnsanitized);

            if (data.hasOwnProperty(user_id)) {
                data[user_id]["name"] = name;
            } else {
                data[user_id] = {"sheeturl": "", "name": name,};
            }

            fs.writeFile("./commands/data/char.json", JSON.stringify(data), function (err) {
                    if (err) throw err;
                    console.log('name change complete');
                    return interaction.reply("Your new name is " + data[user_id]["name"])
                }
            );
        }

        /**
         * Check if the url is valid
         * @param str string to check
         * @returns {boolean}
         */
        function validURL(str) {
            let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
            return !!regexp.test(str);
        }

        /**
         * Check if the url is a valid sheet
         * @param str string to check
         * @returns {boolean}
         */
        function validSheet(str) {
            let spread = new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(str);
            if (spread != null) {
                let spreadsheetId = new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(str)[1];
                return spreadsheetId != null && validURL(str)
            }

            return false;
        }

        /**
         * Call the function to change the url
         */
        function callChangeUrl(auth) {
            changeUrl(url, auth); //This has been done in order to use changeUrl independently in other functions
        }

        /**
         * Change the url of an entry in a json, if the entry does not exist, create it.
         * @param urloriginal the given url.
         * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
         * @returns {boolean}
         */
        function changeUrl(urloriginal, auth) {
            const sheets = google.sheets({version: 'v4', auth});
            let spreadsheetId = new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(urloriginal)[1];
            // let urlSan = sanitizeJSON(args[1]);
            let url = sanitizeJSON(urloriginal);

            sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: 'Feuil3!F324',
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);

                const cells = res.data.values;
                if (cells[0][0] !== 'D’une manière ou d’une autre, vous êtes devenu le chouchou du MJ, avec tout ce que ça implique.') {
                    return interaction.reply("The url does not match a fallout sheet, please try again.");
                } else {
                    if (data.hasOwnProperty(user_id)) {
                        data[user_id]["sheeturl"] = url;
                    } else {
                        data[user_id] = {"sheeturl": url, "name": "",};
                    }
                    fs.writeFile("./commands/data/char.json", JSON.stringify(data), function (err) {
                        if (err) throw err;
                        console.log('url change complete');
                        return interaction.reply("Your new url is " + data[user_id]["sheeturl"])
                    });
                }
            });
        }


        /**
         * Returns the skills of a character
         * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
         */
        function skillChar(auth) {
            console.log('I made it!');
            const sheets = google.sheets({version: 'v4', auth});
            let spreadsheetId = new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(data[user_id]["sheeturl"])[1];
            let content = "";
            console.log('I made it too!');
            sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: 'Principale!AK17:AQ34',
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);

                const cells = res.data.values;
                // msg.channel.send("Nom: " + cells[7][21]);

                cells.map((row) => {
                    content += row[0] + ":  **" + row[6] + "**\n";

                })

                if (cells.length) {
                    const Embed = new Discord.MessageEmbed()
                        .setColor('#d78139')
                        .setTitle("Compétences")
                        .setAuthor(data[user_id]["name"] === "" ? user_id : data[user_id]["name"], "", data[user_id]["sheeturl"])
                        .setDescription(content)
                    console.log(Embed);
                    return interaction.reply({ embeds: [Embed] });

                } else {
                    console.log('No data found.');
                }
            });
        }


        /**
         * Returns the different attributes of a given character
         * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
         */
        function recapChar(auth) {
            const sheets = google.sheets({version: 'v4', auth});
            let spreadsheetId = new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(data[user_id]["sheeturl"])[1];
            // sheetId = new RegExp("[#&]gid=([0-9]+)").exec('https://docs.google.com/spreadsheets/d/1lOZlGJ2ovpY_r1tvXVGmiD0yInDWv8CrHXp1rC9-CVE/edit#gid=1380790248')[1];
            sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: 'Principale',
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                const cells = res.data.values;
                if (cells.length) {
                    const Embed = new Discord.MessageEmbed()
                        .setThumbnail(data[user_id]["image"] === "" ? "" : data[user_id]["image"])
                        //TODO: Ajouter l'image provided si elle existe.
                        .setColor('#d78139')
                        .setTitle(cells[7][21])
                        .setAuthor(data[user_id]["name"] === "" ? user_id : data[user_id]["name"], "", data[user_id]["sheeturl"])
                        .setDescription("**" + cells[5][28] + "**" + "\n" +
                            'Strength: **' + cells[3][41] + "**" + "\n" +
                            'Perception: **' + cells[9][41] + "**" + "\n" +
                            'Endurance: **' + cells[5][41] + "**" + "\n" +
                            'Charisma: **' + cells[5][58] + "**" + "\n" +
                            'Intelligence: **' + cells[3][58] + "**" + "\n" +
                            'Agility: **' + cells[7][41] + "**" + "\n" +
                            'Luck: **' + cells[7][58] + "**" + "\n")
                    // .addFields(
                    //     {name: 'Strength: ' + cells[3][41], value: '\u200b'},
                    //     {name: 'Perception: '+cells[9][41], value: '\u200b'},
                    //     {name: 'Endurance: ' + cells[5][41], value:'\u200b' },
                    //     {name: 'Charisma: '+ cells[5][58], value:'\u200b' },
                    //     {name: 'Intelligence: ' + cells[3][58], value:'\u200b' },
                    //     {name: 'Agility: '+cells[7][41], value: '\u200b'},
                    //     {name: 'Luck: '+cells[7][58], value: '\u200b'},
                    // )
                    return interaction.reply({embeds : [Embed]});
                } else {
                    console.log('No data found.');
                }
            });
        }

        /**
         * Concatenate and put in form the knowledge columns
         * @param cells The data from the shett. The function does not cut the data and is required to do prior
         * @param loc The offset for the reading of the data. 0 for the first column, 16 for the second one.
         */
        function checkConn(cells, loc) {
            let content = "";
            let conn = [];
            //if (args[1] === "all") {  //check the bonus
            /*if (false) {  //check the bonus
                conn = ["X", "+0", "+5", "10", "+20", "+40", "+60"]; //TODO:rendre affichable les connaissances non acquises
            } else {*/
                conn = [false, " ", "+5", "10", "+20", "+40", "+60"]
            //}


            cells.map((row) => { //itterate on the cells
                let z = 0;
                let x = row.slice(6 + loc, 12 + loc);
                x.map((y) =>
                    z += y === 'TRUE' ? 1 : 0);
                if (conn[z] && row[0 + loc] !== '') {
                    content += row[0 + loc] + " **" + conn[z] + "**\n";
                }

            })
            return content
        }

        /**
         * Returns the different attributes of a given character
         * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
         */
        function connChar(auth) {

            const sheets = google.sheets({version: 'v4', auth});
            let spreadsheetId = new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(data[user_id]["sheeturl"])[1];
            let content = "";

            sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: 'Principale!AK44:BL69', //69
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);

                const cells = res.data.values;

                content += checkConn(cells, 0);
                content += checkConn(cells, 16); //Offset nécéssaire pour effectuer la deuxième colonne dans l'ordre alphabétique

                if (cells.length) {
                    const Embed = new Discord.MessageEmbed()
                        .setColor('#d78139')
                        .setTitle("Connaissances")
                        // .setURL(data[char]["sheeturl"])
                        .setDescription(content)
                        .setAuthor(data[user_id]["name"] === "" ? user_id : data[user_id]["name"], "", data[user_id]["sheeturl"])
                    return interaction.reply({ embeds: [Embed]});
                } else {
                    console.log('No data found.');
                }
            });
        }

        function setupChar() {
            const user = msg.author;
            let name;
            let url;
            let urlImage;

            user.send("Let's setup your character, " + user.username + "!\rYou can type ``setup abort`` at any moment to quit the process but values already given will already be initialized.\rPlease enter your character's name:");

            const filter = m => m.author.id === user.id;
            const collectorName = msg.channel.createMessageCollector(filter, {time: 60000});

            collectorName.on('collect', m => {
                let content = m.content.trim();
                if (content.length > 500) {
                    msg.channel.send("``" + user.username + ":`` Sorry, that entry is invalid, please type another.");
                    collectorName.resetTimer({time: 60000});
                } else if (content[0] === "!") {
                    msg.channel.send("``" + user.username + ":`` You can't use a command while in setup, the process has been aborted.");
                    collectorName.stop("processRunning");
                } else if (content === "setup abort") {
                    msg.channel.send("``" + user.username + ":`` You aborted the process.");
                    collectorName.stop("abortProcess");
                } else {
                    name = content;
                    collectorName.stop('correctName');
                }
            })

            collectorName.on('end', (m, reason) => {
                if (reason === "correctName") {
                    changeName(name);
                    msg.channel.send("Let's setup now the url of your character sheet, " + user.username + ".\rPlease enter the url:");

                    const collectorUrl = msg.channel.createMessageCollector(filter, {time: 60000});

                    collectorUrl.on('collect', m => {
                        let content = m.content.trim();
                        if (validSheet(content.length)) {
                            msg.channel.send("``" + user.username + ":`` Sorry, this is not a google sheet url, please type another.");
                            collectorUrl.resetTimer({time: 60000});
                        } else if (content[0] === "!") {
                            msg.channel.send("``" + user.username + ":`` You can't use a command while in setup, the process has been aborted.");
                            collectorUrl.stop("processRunning");
                        } else if (content === "setup abort") {
                            msg.channel.send("``" + user.username + ":`` You aborted the process.");
                            collectorUrl.stop("abortProcess");
                        } else {
                            url = content;
                            let result = changeUrl(url, auth);
                            if (result) {
                                collectorUrl.stop('correctUrl');
                            } else {
                                msg.channel.send("``" + user.username + ":`` Sorry, this is not a valid fallout sheet, please type another.");
                                collectorUrl.resetTimer({time: 60000});
                            }
                            collectorUrl.on('end', (m, reason) => {
                                if (reason === "correctUrl") {

                                }
                            })

                        }
                    })
                }
            })
        }
        /**
         * Check if the given string is a valid url of an image
         * @param str str The string to check
         */
        function validURLImage(str) {
            let regex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|svg)/g
            return !!regex.test(str);
        }


        function removeItemAll(arr, value) {
            let i = 0;
            while (i < arr.length) {
                if (arr[i] === value) {
                    arr.splice(i, 1);
                } else {
                    ++i;
                }
            }
            return arr;
        }
    },
};
