/*global module*/
/*global console*/
/*global require*/

var utility = require( "./utility.js" );

//database-related utility functions
var SlackAPI = module.exports =
{
    getUsersList: function( cb )
    {
        utility.getUrlBody( "https://slack.com/api/users.list", cb );
    },
    
    post: function( message, cb )
    {
        utility.httpsPostJson( "slack.com", "api/chat.postMessage", message, cb );
    }
}