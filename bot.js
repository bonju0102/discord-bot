// const CLIENT_ID = "1019616662703571025";
// const url = `https://discordapp.com/oauth2/authorize?&client_id=${CLIENT_ID}&scope=bot&permissions=412317190208`

const Discord = require( 'discord.js' );
const logger = require( 'winston' );
const utils = require( './utils/utils' );
const config = require( `./config/${process.env.NODE_ENV}_config` );


// Configure logger settings
logger.remove( logger.transports.Console );
logger.add(new logger.transports.Console({
    colorize: true
}));
logger.level = 'debug';

// Initialize Discord Bot
const bot = new Discord.Client({
    intents: [ 1, 512, 1024 ]
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info(`Logged in as: ${bot.user.tag}`);
});

// Listening on message create event
bot.on( 'messageCreate', async ( msg ) => {

    const channelId = msg.channelId;
    const userId = msg.author.id;
    const username = msg.author.username;
    console.log( `ChannelID: ${channelId}` );
    console.log( `User: ${username}` );
    console.log( `userID: ${userId}` );
    // console.log( msg )

    // MIYA大廳
    if ( channelId === '1000794418930012212' ) {
        if ( username !== '勾狗' || userId !== '1019616662703571025' ) {
            await msg.react( '<:MIYACHU:1019675162603429929>'); // Miya kiss 貼圖
            await msg.react( '❤️');
        }
        // if ( username === "Miya" || userId === '690415091790643251' ) await msg.reply( '太強啦！' );
        // if ( username === "Aphasia" || userId === '591617391151284260' ) await msg.reply( '太強啦！' );
        // if ( username === "Xar" || userId === '285980293041487873' ) await msg.reply( 'https://imgur.com/a/7QkrWnV' );
    }
    // if ( username === "BonJu" || userId === '350238150666485762' ) await msg.reply( 'https://imgur.com/a/7QkrWnV' );

})

// 登入 bot
bot.login( utils.aesDecode(config.DISCORD_TOKEN) );