/*global module*/
/*global console*/

const coffee = require( "../models/coffee_model.js" );
const constants = require( "../constants.js" );

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
            const channelId = request.query.channel;
            const dryRun = request.query.dryRun === "true" || (!!request.query.dryRun && request.query.dryRun !== "false");
            const user1Id = request.query.user1 === constants.RANDOM_USER_ID || !request.query.user1 ? null : request.query.user1;
            const user2Id = request.query.user2 === constants.RANDOM_USER_ID || !request.query.user2 ? null : request.query.user2;
            coffee.scheduleCoffee( channelId, dryRun, function( error )
            {
                if ( error )
                {
                    response.status(500).json( { success: false, error: error } );
                }
                else
                {
                    response.status(200).json( { success: true } );
                }
            }, user1Id, user2Id );
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