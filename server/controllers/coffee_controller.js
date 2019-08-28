/*global module*/
/*global console*/

const coffee = require( "../models/coffee_model.js" );

module.exports =
{
    updateMessage: function( request, response )
    {
        if ( !request.query.message )
        {
            response.status(500).json( { success: false, error: "message is a required parameter." } );
        }
        else
        {
            coffee.updateMessage( request.query.message, function( error )
            {
                if ( error )
                {
                    response.status(500).json( { success: false, error: error } );
                }
                else
                {
                    response.status(200).json( { success: true } );
                }
            });
        }
    },
    
    scheduleCoffee: function( request, response )
    {
        if ( !request.query.channel )
        {
            response.status(500).json( { success: false, error: "channel is a required parameter." } );
        }
        else
        {
            console.log( "in controller with dry run: " + request.query.dryRun );
            coffee.scheduleCoffee( request.query.channel, !!request.query.dryRun, function( error )
            {
                if ( error )
                {
                    response.status(500).json( { success: false, error: error } );
                }
                else
                {
                    response.status(200).json( { success: true } );
                }
            });
        }
    },
    
    clearPairs: function( request, response )
    {
        coffee.clearPairs( function( error )
        {
            if ( error )
            {
                response.status(500).json( { success: false, error: error } );
            }
            else
            {
                response.status(200).json( { success: true } );
            }
        });
    }
};