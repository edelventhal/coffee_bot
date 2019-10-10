/*global require*/
const slack = require( "../utility/slackApi.js" );
const constants = require( "../constants.js" );
const database = require( "../database.js" );

const EXCLUDED_USERS_KEY = "excludedUsers";

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
                if ( !user.deleted && !user.is_bot && !user.is_app_user && !user.is_restricted && !user.is_ultra_restricted
                    && constants.EXCLUDED_USERS.indexOf(user.name) < 0
                    && ( !constants.USE_VALID_TIMEZONES || constants.VALID_TIMEZONES.indexOf( user.tz ) >= 0 ) )
                {
                    users[user.id] = user.real_name || user.name;
                }
            });
            
            cb( null, users );
        });
    },
    
    getExcludedUsers: function( cb )
    {
        database.get( EXCLUDED_USERS_KEY, function( excludedUsersString )
        {
            const excludedUsers = excludedUsersString ? JSON.parse( excludedUsersString ) : {};
            
            cb( excludedUsers );
        });
    },
    
    setExcludedUsersFromString: function( newExcludedUsersString, cb )
    {
        database.set( EXCLUDED_USERS_KEY, newExcludedUsersString, function( success )
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
    
    setExcludedUsers: function( newExcludedUsersDictionary, cb )
    {
        const newExcludedUsersString = JSON.stringify( newExcludedUsersDictionary );
        
        UsersModel.setExcludedUsersFromString( newExcludedUsersString, cb );
    },
    
    setUserIsExcluded: function( userId, isExcluded, cb )
    {
        UsersModel.getExcludedUsers( function( excludedUsers )
        {
            if ( isExcluded )
            {
                excludedUsers[userId] = true;
            }
            else
            {
                delete excludedUsers[userId];
            }
            
            UsersModel.setExcludedUsers( excludedUsers, cb );
        });
    }
};