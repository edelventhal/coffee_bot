/*global module*/
/*global console*/
/*global require*/

var database = require( "../database.js" );
var slack = require( "../utility/slackApi.js" );
const HISTORY_KEY = "history";

//handles hanging onto global stuff
var GlobalModel = module.exports =
{
    scheduleCoffee: function( cb )
    {
        database.get( HISTORY_KEY, function( historyString )
        {
            const pastData = historyString ? JSON.parse( historyString ) : { timesPaired: {}, pairs: {} };
            
            slack.getUsersList( function( error, userData )
            {
                if ( error || !userData.members )
                {
                    cb( "Failed to get users from Slack: " + JSON.stringify( userData ) );
                    return;
                }
                
                const usernames = [];
                let lowestCoffeeCount = -1;
                Object.keys( userData.members ).forEach( function( userKey )
                {
                    const user = userData.members[userKey];
                    if ( !user.deleted && !user.is_bot && user.name !== "slackbot" ) //why isn't slackbot a bot?
                    {
                        usernames.push( user.name );
                    }
                    
                    //we want the user(s) who have had coffee the least number of times
                    if ( lowestCoffeeCount < 0 || ( pastData.timesPaired[user.name] && pastData.timesPaired[user.name] < lowestCoffeeCount ) )
                    {
                        lowestCoffeeCount = pastData.timesPaired[user.name] || 0;
                    }
                });
                
                if ( usernames.length < 2 )
                {
                    cb( "There needs to be at least 2 users!" );
                    return;
                }
                
                //find the users that have had coffee the least number of times so we can choose one of them
                const lowestCountUsers = [];
                
                usernames.forEach( function( username )
                {
                    if ( ( pastData.timesPaired[username] || 0 ) <= lowestCoffeeCount )
                    {
                        lowestCountUsers.push( username );
                    }
                });
                
                //now that we know which users have had coffee the least times, choose a user to have coffee
                const primaryUserIndex = Math.floor( Math.random() * lowestCountUsers.length );
                const primaryUsername = lowestCountUsers[primaryUserIndex];
                lowestCountUsers.splice( primaryUserIndex, 1 );
                
                //and then choose a partner for that user by finding the lowest pair count among them and other users
                const primaryPairs = pastData.pairs[primaryUsername] || {};
                let lowestPartnerCount = -1;
                usernames.forEach( function( username )
                {
                    if ( username !== primaryUsername && ( lowestPartnerCount < 0 || ( ( primaryPairs[username] || 0 ) < lowestCoffeeCount ) ) )
                    {
                        lowestPartnerCount = primaryPairs[username] || 0;
                    }
                });
                
                const validPartners = [];
                usernames.forEach( function( username )
                {
                    const pairCount = ( primaryPairs[username] || 0 );
                    if ( username !== primaryUsername && pairCount <= lowestPartnerCount )
                    {
                        validPartners.push( username );
                    }
                });
                
                //finally, choose their partner
                const partnerUsername = validPartners[Math.floor( Math.random() * validPartners.length )];
                const partnerPairs = pastData.pairs[partnerUsername] || {};
                
                //have the Slackbot post the pairs
                slack.post( "It's coffee time! Today it's @" + primaryUsername + " and @" + partnerUsername + "!", function( success, error )
                {
                    if ( success )
                    {
                        //update the data to be written to the DB
                        pastData.timesPaired[primaryUsername] = ( pastData.timesPaired[primaryUsername] || 0 ) + 1;
                        pastData.timesPaired[partnerUsername] = ( pastData.timesPaired[partnerUsername] || 0 ) + 1;
                        pastData.pairs[primaryUsername] = ( primaryPairs[partnerUsername] || 0 ) + 1;
                        pastData.pairs[partnerUsername] = ( partnerPairs[primaryUsername] || 0 ) + 1;

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
    }
};