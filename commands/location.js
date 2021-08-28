const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('location')
        .setDescription('Gives the location of a hit')
        .addStringOption(option =>
            option.setName('body_part')
                .setDescription("The dice you want to roll")
                .setRequired(false)
                .addChoice("Body","body")
                .addChoice("Head","head")
                .addChoice("Right Torso","torso_right")
                .addChoice("Left Torso","torso_left")
                .addChoice("Arm","arm")
                .addChoice("Leg","leg")
        ),
    async execute(client, interaction) {
        let loc = interaction.options.getString('body_part');
        if (loc == null) loc = "body";
        switch (loc) {
            case "body":
                let resb = Math.floor(Math.random() * 100) + 1
                if (0 < resb && resb <= 4) return interaction.reply("```Front \nresistance : 20```");
                else if (4 < resb && resb <= 5) return interaction.reply("```Œil droit \nresistance : 7```")
                else if (5 < resb && resb <= 6) return interaction.reply("```Œil gauche \nresistance : 7```")
                else if (6 < resb && resb <= 8) return interaction.reply("```Nez \nresistance : 18```")
                else if (8 < resb && resb <= 12) return interaction.reply("```Menton \nresistance : 20```")
                else if (12 < resb && resb <= 15) return interaction.reply("```Cou \nresistance : 20```")
                else if (15 < resb && resb <= 30) return interaction.reply("```Cage thoracique \nresistance : 45```")
                else if (30 < resb && resb <= 31) return interaction.reply("```Cœur \nresistance : 10```")
                else if (31 < resb && resb <= 36) return interaction.reply("```Estomac \nresistance : 15```")
                else if (36 < resb && resb <= 47) return interaction.reply("```Ventre \nresistance : 40```")
                else if (47 < resb && resb <= 48) return interaction.reply("```Foie \nresistance : 10```")
                else if (48 < resb && resb <= 56) return interaction.reply("```Bras gauche \nresistance : 40```")
                else if (56 < resb && resb <= 59) return interaction.reply("```Main gauche \nresistance : 15```")
                else if (59 < resb && resb <= 67) return interaction.reply("```Bras droit \nresistance : 40```")
                else if (67 < resb && resb <= 70) return interaction.reply("```Main droite \nresistance : 15```")
                else if (70 < resb && resb <= 78) return interaction.reply("```Hanches \nresistance : 35```")
                else if (78 < resb && resb <= 86) return interaction.reply("```Jambe gauche \nresistance : 40```")
                else if (86 < resb && resb <= 89) return interaction.reply("```Pied gauche \nresistance : 15```")
                else if (89 < resb && resb <= 97) return interaction.reply("```Jambe droite \nresistance : 40```")
                else if (97 < resb && resb <= 100) return interaction.reply("```Pied droit \nresistance : 15```")
                break;
            case "head":
                let resh = Math.floor(Math.random() * 20) + 1
                if (0 < resh && resh <= 5) return interaction.reply("```Front \nresistance : 20```")
                else if (5 < resh && resh <= 7) return interaction.reply("```Œil droit \nresistance : 7```")
                else if (7 < resh && resh <= 9) return interaction.reply("```Œil gauche \nresistance : 7```")
                else if (9 < resh && resh <= 12) return interaction.reply("```Nez \nresistance : 18```")
                else if (12 < resh && resh <= 17) return interaction.reply("```Menton \nresistance : 20```")
                else if (17 < resh && resh <= 20) return interaction.reply("```Cou \nresistance : 20```")
                break;
            case "torso_right":
                let restr = Math.floor(Math.random() * 10) + 1
                if (0 < restr && restr <= 5) return interaction.reply("``Cage thoracique \nresistance : 45```")
                else if (5 < restr && restr <= 6) return interaction.reply("```Foie \nresistance : 10```")
                else if (6 < restr && restr <= 10) return interaction.reply("```Ventre \nresistance : 40```")
                break;
            case "torso_left":
                let restl = Math.floor(Math.random() * 12) + 1
                if (0 < restl && restl <= 5) return interaction.reply("```Cage thoracique \nresistance : 45```")
                else if (5 < restl && restl <= 7) return interaction.reply("```Cœur \nresistance : 10```")
                else if (7 < restl && restl <= 8) return interaction.reply("```Estomac \nresistance : 15```")
                else if (8 < restl && restl <= 12) return interaction.reply("```Ventre \nresistance : 40```")
                break;
            case "arm":
                let resa = Math.floor(Math.random() * 10) + 1
                if (0 < resa && resa <= 8) return interaction.reply("```Bras \nresistance : 40```")
                else if (8 < resa && resa <= 10) return interaction.reply("```Main \nresistance : 15```")
                break;
            case "leg":
                let resl = Math.floor(Math.random() * 10) + 1
                if (0 < resl && resl <= 8) return interaction.reply("```Jambe \nresistance : 40```")
                else if (8 < resl && resl <= 10) return interaction.reply("```Pied \nresistance : 15```")
                break;
            default:
                return interaction.reply("Invalid argument, please choose among [body, head, torso_right, torso_left, arm, leg]");
        }
    },
};
