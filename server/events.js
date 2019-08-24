/*global require*/
/*global module*/
/*global console*/
/*global process*/

const global = require( "./models/global_model.js" );

var Events = module.exports =
{
    fire: function( event, payload, cb )
    {
        if ( this.events[event] )
        {
            this.events[event]( payload, cb );
        }
        else
        {
            cb( "There is no event for the key: '" + event + "'." );
        }
    },
    
    events:
    {
        pairUsers: function( payload, cb )
        {
            global.scheduleCoffee( cb );
        }
    }
}