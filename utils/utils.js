const crypto = require( 'crypto' );
const config = require( `../config/${process.env.NODE_ENV}_config` );

class Utils {
    constructor() {
    }

    aesEncode( data ) {
        let cipherChunks = [];
        let cipher = crypto.createCipheriv( 'aes-128-ecb', config.SECRET_KEY.substring( 0, 16 ), '' );
        cipher.setAutoPadding( true );
        cipherChunks.push( cipher.update( data, 'utf8', 'base64' ));
        cipherChunks.push( cipher.final( 'base64' ));

        return cipherChunks.join('');
    }

    aesDecode( data ) {
        let cipherChunks = [];
        let decipher = crypto.createDecipheriv( 'aes-128-ecb', config.SECRET_KEY.substring( 0, 16 ), '' );
        decipher.setAutoPadding( true );
        cipherChunks.push( decipher.update( data, 'base64', 'utf8' ));
        cipherChunks.push( decipher.final( 'utf8' ));

        return cipherChunks.join( '' );
    }
}


module.exports = new Utils();