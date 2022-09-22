const config = require( `../config/${process.env.NODE_ENV}_config` );
const EventEmitter = require( 'events' );
const axios = require( 'axios' );
const fs = require( 'fs' );
const path = require( 'path' );

const filePath = path.join( __dirname, '../data/earthquake.json' );

class EarthquakeDetector extends EventEmitter {
    baseUrl = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/E-A0015-001';
    data = {};

    constructor() {
        super();
        this.#loadEarthQuake();
        this.on( 'save', ( data ) => this.#saveEarthQuake( data ) );
        setInterval( () => this.#fetchAPI(), 5000 );
    }

    #fetchAPI() {
        let newEarthQuake = [];
        let newEarthQuakeDetail;
        axios.get( this.baseUrl, {
            params: {
                "Authorization": config.CWB_TOKEN,
                "limit": 5,
                "format": "JSON",
                "areaName": "臺北市",
            }
        }).then( res => {
            const earthquakeInfos = res.data.records;
            for ( let v of earthquakeInfos.earthquake ) {
                if ( !this.data[ v.earthquakeNo ] ) {
                    this.data[ v.earthquakeNo ] = v;
                    newEarthQuake.push( 1 );
                    newEarthQuakeDetail = v;
                } else {
                    newEarthQuake.push( 0 );
                }
            }

            if ( newEarthQuake.some( v => v === 1 ) ) {
                this.emit( 'newEarthQuake', newEarthQuakeDetail );
                this.emit( 'save', earthquakeInfos );
            }
        }).catch( console.error );
    }

    #saveEarthQuake( data ) {
        console.log( 'save earthquake...' );
        try {
            fs.writeFileSync(
                filePath,
                JSON.stringify( data, null, 4 )
            );
        } catch ( e ) {
            console.error( e );
        }
    }

    #loadEarthQuake() {
        const history = JSON.parse( fs.readFileSync( filePath ).toString() );
        history.earthquake.forEach( ( v, idx, _ ) => {
            this.data[ v.earthquakeNo ] = v;
        })
    }

}


module.exports = new EarthquakeDetector();