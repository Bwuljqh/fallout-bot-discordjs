const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll dice given in input')
        .addStringOption(option =>
            option.setName('input')
                .setDescription("The dice you want to roll")
                .setRequired(true)),
    async execute(client, interaction) {

        const args = interaction.options.getString('input');
        let slices = args.split(/(?=[+-])|(?<=[+-])/);


        console.log(slices);

        let result = 0
        let sign = 1;
        for (let slice_number in slices) {
            let slice = slices[slice_number];
            if (slice === "-") {
                sign = -1;
            } else if (slice === '+') {
                sign = 1
            } else {
                if ( slice.match(/[-+]/)) sign = -1;
                console.log(slice);
                let small_slices = slice.split("d");
                console.log(small_slices);
                let length = small_slices.length;
                if (length === 1) {
                    result += sign * small_slices[0];
                } else
                {
                    let numbers = small_slices[1].split(/(?=[+-])|(?<=[+-])/);
                    let boucle = small_slices[0].substr(1);
                    if (boucle === "") boucle = 1;
                    for (let i = 0; i < boucle; i++) {
                        result += sign * (Math.floor(Math.random() * numbers[0]) + 1)
                    }
                }
            }
        }

        return interaction.reply('`' + interaction.options.getString('input') + ": " + result + '`') ;
    }
}