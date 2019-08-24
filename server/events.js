/*global require*/
/*global module*/
/*global console*/
/*global process*/

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
            
        }
    }
}