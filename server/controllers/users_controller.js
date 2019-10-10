/*global module*/
/*global console*/

const users = require( "../models/users_model.js" );
const constants = require( "../constants.js" );

const UsersController = module.exports =
{
    exclusions:
    {
        add: function( request, response )
        {
            UsersController._setSingleUserExclusion( true, request, response );
        },
    
        remove: function( request, response )
        {
            UsersController._setSingleUserExclusion( false, request, response );
        },
    
    
        set: function( request, response )
        {
            if ( !request.query.users )
            {
                response.status(500).json( { success: false, error: "users is a required parameter." } );
            }
            else
            {
                users.setExcludedUsersFromString( request.query.users, function( error )
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
        }
    },
    
    _setSingleUserExclusion: function( isExcluded, request, response )
        {
            if ( !request.query.user )
            {
                response.status(500).json( { success: false, error: "user is a required parameter." } );
            }
            else
            {
                users.setUserIsExcluded( request.query.user, isExcluded, function( error )
                {
                    if ( error )
                    {
                        response.status(500).json( { success: false, error: error } );
                    }
                    else
                    {
                        users.getExcludedUsers( function( excludedUsers )
                        {
                            response.status(200).json( { success: true, excludedUsers: excludedUsers } );
                        });
                    }
                });
            }
        }
};