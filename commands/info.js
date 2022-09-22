const { SlashCommandBuilder } = require( "discord.js" );

module.exports = {
    data: new SlashCommandBuilder().setName( 'info' ).setDescription( 'Miya\'s info' ),

    async execute( interaction ) { await interaction.reply( `
        Miya的Twitch         https://www.twitch.tv/miyachuang
Miya的Instagram      https://www.instagram.com/miyachuang
姐妹共同IG            https://www.instagram.com/fm51.5ters
姐妹共同YT            https://www.youtube.com/channel/UCZ7ej84jwziz8RpgCEIlaUg
        `)
    },
};