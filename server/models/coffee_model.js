/*global module*/
/*global console*/
/*global require*/

const database = require( "../database.js" );
const slack = require( "../utility/slackApi.js" );
const users = require( "./users_model.js" );
const constants = require( "../constants.js" );
const userUtility = require( "../utility/user_utility.js" );

const HISTORY_KEY = "history";
const MESSAGE_KEY = "message";

//handles hanging onto global stuff
const CoffeeModel = module.exports =
{
    //schedules coffee between 2 people by pinging Slack
    //channelId: a Slack channel ID to post the result.
    //dryRun: If true, we won't actually @ users (useful for testing)
    //cb: Callback once complete
    //[user1Id]: If provided, will force the first user to have this ID
    //[user2Id]: If provided, will force the second user to have this ID
    scheduleCoffee: function( channel, dryRun, cb, user1Id, user2Id )
    {
        database.get( HISTORY_KEY, function( historyString )
        {
            const pastData = historyString ? JSON.parse( historyString ) : { timesPaired: {}, pairs: {} };
            
            users.getUsers( function( error, userData )
            {
                if ( error )
                {
                    cb( error );
                    return;
                }
                
                const userIds = Object.keys( userData );
                
                if ( userIds.length < 2 )
                {
                    cb( "There needs to be at least 2 users!" );
                    return;
                }
                
                users.getExcludedUsers( function( excludedUsers )
                {
                    //find the lowest count of times any users has gotten coffee
                    const lowestCoffeeCount = userUtility.findMinimumPairedCount( userIds, pastData.timesPaired, excludedUsers );
                
                    //find the users that have had coffee the least number of times so we can choose one of them
                    const lowestCountUsers = userUtility.findUsersPairedWithinRange( userIds, pastData.timesPaired, 0, lowestCoffeeCount, excludedUsers );
                
                    //now that we know which users have had coffee the least times, choose a user to have coffee
                    const primaryUserIndex = Math.floor( Math.random() * lowestCountUsers.length );
                    const primaryUserId = user1Id || lowestCountUsers[primaryUserIndex];
                    
                    //we don't want to consider the first user as an option to pair with
                    lowestCountUsers.splice( primaryUserIndex, 1 );
                
                    //and then choose a partner for that user by finding the lowest pair count among them and other users
                    //...this weird ternary below is to deal with an existing bug where we stored numbers in the db instead of objects
                    const primaryPairs = typeof( pastData.pairs[primaryUserId] ) === 'object' ? pastData.pairs[primaryUserId] : {};
                    const lowestPartnerCount = userUtility.findMinimumPairedCount( lowestCountUsers, primaryPairs, excludedUsers );
                
                    //find all partners that fit this range
                    const validPartners = userUtility.findUsersPairedWithinRange( lowestCountUsers, primaryPairs, 0, lowestPartnerCount, excludedUsers );
                
                    //finally, choose their partner
                    const partnerUserId = user2Id || validPartners[Math.floor( Math.random() * validPartners.length )];
                    const partnerPairs = pastData.pairs[partnerUserId] || {};
                
                    database.get( MESSAGE_KEY, function( message )
                    {
                        message = message || constants.DEFAULT_MESSAGE;
                        message = message.replace( /PRIMARY/g, ( dryRun ? userData[primaryUserId] : `<@${primaryUserId}>` ) );
                        message = message.replace( /SECONDARY/g, ( dryRun ? userData[partnerUserId] : `<@${partnerUserId}>` ) );
                    
                        //have the Slackbot post the pairs
                        slack.post( message, channel, function( error, payload )
                        {
                            if ( !error )
                            {
                                //update the data to be written to the DB
                                if ( !dryRun )
                                {
                                    pastData.timesPaired[primaryUserId] = ( pastData.timesPaired[primaryUserId] || 0 ) + 1;
                                    pastData.timesPaired[partnerUserId] = ( pastData.timesPaired[partnerUserId] || 0 ) + 1;
                                    pastData.pairs[primaryUserId] = typeof(pastData.pairs[primaryUserId]) === 'object' ? pastData.pairs[primaryUserId] : {};
                                    pastData.pairs[partnerUserId] = typeof(pastData.pairs[partnerUserId]) === 'object' ? pastData.pairs[partnerUserId] : {};
                                    pastData.pairs[primaryUserId][partnerUserId] = ( pastData.pairs[primaryUserId][partnerUserId] || 0 ) + 1;
                                    pastData.pairs[partnerUserId][primaryUserId] = ( pastData.pairs[partnerUserId][primaryUserId] || 0 ) + 1;
                                }

                                //write the result to the db
                                database.set( HISTORY_KEY, JSON.stringify( pastData ), function( dbSuccess )
                                {
                                    if ( !dbSuccess )
                                    {
                                        cb( "Failed to write to database." );
                                    }
                                    else
                                    {
                                        cb();
                                    }
                                });
                            }
                            else
                            {
                                cb( error );
                            }
                        });
                    });
                });
            });
        });
    },
    
    updateMessage: function( newMessage, cb )
    {
        database.set( MESSAGE_KEY, newMessage || constants.DEFAULT_MESSAGE, function( success )
        {
            if ( !success )
            {
                cb( "Failed to write to database." );
            }
            else
            {
                cb();
            }
        });
    },
    
    clearPairs: function( cb )
    {
        database.set( HISTORY_KEY, JSON.stringify( { timesPaired: {}, pairs: {} } ), function( success )
        {
            if ( !success )
            {
                cb( "Failed to write to database." );
            }
            else
            {
                cb();
            }
        });
    },
    
    getMessage: function( cb )
    {
        database.get( MESSAGE_KEY, function( message )
        {
            cb( message || constants.DEFAULT_MESSAGE );
        });
    }
};