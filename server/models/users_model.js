/*global require*/
const slack = require( "../utility/slackApi.js" );
const constants = require( "../constants.js" );

const UsersModel = module.exports =
{
    getUsers: function( cb )
    {
        slack.getUsersList( function( error, userData )
        {
            if ( error || !userData.members )
            {
                cb( "Failed to get users from Slack:\n" + error + "\n" + JSON.stringify( userData ), [] );
                return;
            }
            
            const users = {};
            Object.keys( userData.members ).forEach( function( userKey )
            {
                const user = userData.members[userKey];
                if ( !user.deleted && !user.is_bot && !user.is_app_user
                    && constants.EXCLUDED_USERS.indexOf(user.name) < 0
                    && ( !constants.USE_VALID_TIMEZONES || constants.VALID_TIMEZONES.indexOf( user.tz ) >= 0 ) )
                {
                    users[user.id] = user.name;
                }
            });
            
            cb( null, users );
        });
    }
};