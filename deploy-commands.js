const utils = require( './utils/utils' );
const config = require( `./config/${process.env.NODE_ENV}_config` );


const { REST, Routes } = require( 'discord.js' );
const path = require( 'path' );
const fs = require( 'fs' );
const [ clientId, guildId, token ] = [ config.CLIENT_ID, config.GUILD_ID, utils.aesDecode( config.DISCORD_TOKEN ) ];


// const commands = [
//     new SlashCommandBuilder().setName( 'ping' ).setDescription( 'Replies with pong!' ),
//     new SlashCommandBuilder().setName( 'server' ).setDescription( 'Replies with server info!' ),
//     new SlashCommandBuilder().setName( 'user' ).setDescription( 'Replies with user info!' ),
// ].map( command => command.toJSON() );

const commands = [];
const commandsPath = path.join( __dirname, 'commands' );
const commandFiles = fs.readdirSync( commandsPath ).filter( file => file.endsWith( '.js' ));

for ( const file of commandFiles ) {
    const filePath = path.join( commandsPath, file );
    const command = require( filePath );
    commands.push( command.data.toJSON() );
}

const rest = new REST({ version: '10' }).setToken( token );

// Add commands
rest.put( Routes.applicationGuildCommands( clientId, guildId ), { body: commands } )
    .then( ( data ) => console.log( `Successfully registered ${data.length} application commands.` ))
    .catch( console.error );


// Delete guild-based commands
// rest.delete( Routes.applicationGuildCommands( clientId, guildId, `1022385408329383938` ) )
//     .then( () => console.log( `Successfully deleted guild command` ))
//     .catch( console.error );

// rest.delete( Routes.applicationGuildCommands( clientId, guildId ), { body: [] } )
//     .then( () => console.log( `Successfully deleted all guild commands` ))
//     .catch( console.error );

// Delete global commands
// rest.delete( Routes.applicationCommands( clientId, `1022385408329383938` ) )
//     .then( () => console.log( `Successfully deleted application command` ))
//     .catch( console.error );

// rest.delete( Routes.applicationCommands( clientId ), { body: [] } )
//     .then( () => console.log( `Successfully deleted all application commands` ))
//     .catch( console.error );