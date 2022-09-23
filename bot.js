const { Client, Collection, GatewayIntentBits } = require( 'discord.js' );
const logger = require( 'winston' );
const fs = require( 'fs' );
const path = require( 'path' );
const utils = require( './utils/utils' );
const config = require( `./config/${process.env.NODE_ENV}_config` );

const channelIdList = [
    "1000794418930012212", // Miya大廳
    "1000484428562317392" // Dev大廳
]

const EarthQuakeDetector = require( './models/EarthquakeDetector' );

// Configure logger settings
logger.remove( logger.transports.Console );
logger.add(new logger.transports.Console({
    colorize: true
}));
logger.level = 'debug';

( async () => {
    // Initialize Discord Bot
    const bot = new Client({
        intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions ]  // GatewayIntentBits
    });

    // Load commands
    bot.commands = new Collection();
    const commandsPath = path.join( __dirname, 'commands/' );
    const commandFiles = fs.readdirSync( commandsPath ).filter( file => file.endsWith( '.js' ));

    for ( const file of commandFiles ) {
        const filePath = path.join( commandsPath, file );
        const command = require( filePath );
        bot.commands.set( command.data.name, command );
    }

    bot.on('ready', function ( client ) {
        logger.info('Connected');
        logger.info(`Logged in as: ${bot.user.tag}`);

        // EarthQuake Detect
        EarthQuakeDetector.on( 'newEarthQuake', ( eq ) => {
            const time = eq.reportContent.substring( 0, 11 );
            const title = eq.reportContent.substring( 11 );

            for ( let channelId of channelIdList ) {
                client.channels.cache.get( channelId ).send({
                    content: `@everyone\n《地震速報》\n${time}\n${title}`,
                    files: [ eq.reportImageURI ]
                });
            }
        });
    });

    // Listening on message create event
    bot.on( 'messageCreate', async ( msg ) => {

        const channelId = msg.channelId;
        const userId = msg.author.id;
        const username = msg.author.username;
        logger.info( `ChannelID: ${channelId}` );
        logger.info( `User: ${username}` );
        logger.info( `userID: ${userId}` );
        // console.log( msg )

        // MIYA大廳
        // if ( channelId === '1000794418930012212' ) {
        //     if ( username !== '勾狗' || userId !== '1019616662703571025' ) {
        //         await msg.react( '<:MIYACHU:1019675162603429929>'); // Miya kiss 貼圖
        //         await msg.react( '❤️');
        //     }
        //     // if ( username === "Miya" || userId === '690415091790643251' ) await msg.reply( '太強啦！' );
        //     // if ( username === "Aphasia" || userId === '591617391151284260' ) await msg.reply( '太強啦！' );
        //     // if ( username === "Xar" || userId === '285980293041487873' ) await msg.reply( 'https://imgur.com/a/7QkrWnV' );
        // }

        // 我當你空氣
        // if ( channelId === '1000484428562317392' ) {
        //     if ( username === "BonJu" || userId === '350238150666485762' ) await msg.reply( 'https://imgur.com/a/7QkrWnV' );
        // }

    })

    // Listening on commands
    bot.on( 'interactionCreate', async ( interaction ) => {
        if ( !interaction.isChatInputCommand() ) return;

        const command = interaction.client.commands.get( interaction.commandName );

        if ( !command ) return;

        try {
            await command.execute( interaction );
        } catch ( error ) {
            logger.error( error );
            await interaction.reply( { content: 'There was an error while executing this command!', ephemeral: true });
        }

        // const { commandName } = interaction;
        //
        // if ( commandName === 'ping' ) {
        //     await interaction.reply( 'pong!' );
        // } else if ( commandName === 'server' ) {
        //     await interaction.reply( `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}` );
        // } else if ( commandName === 'user' ) {
        //     await interaction.reply( `Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}` );
        // }
    })

    // 登入 bot
    await bot.login( utils.aesDecode( config.DISCORD_TOKEN ) );
})();