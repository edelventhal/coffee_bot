/*global module*/
/*global console*/
/*global require*/

var database = require( "../database.js" );
var http = require( "http" );

//database-related utility functions
var Utility = module.exports =
{
    //returns a dump of the entire redis db, helps for debugging
    getDatabaseDump: function( cb )
    {
        database.getAllKeys( function( keys )
        {
            var result = {};
            var resultsRemaining = keys.length;
            
            var resultFunc = function( key, dump )
            {
                result[ key ] = dump;
                resultsRemaining--;
                
                if ( resultsRemaining <= 0 )
                {
                    cb( result );
                }
            };
            
            var keyIndex;
            for ( keyIndex = 0; keyIndex < keys.length; keyIndex++ )
            {
                database.dump( keys[ keyIndex ], resultFunc.bind(this,keys[keyIndex]));
            }
            
            if ( keys.length <= 0 )
            {
                cb( {} );
            }
        }.bind(this));
    },
    
    //for saving and restoring the redis db
    restoreDatabaseFromDump: function( dump, cb )
    {
        if ( typeof( dump ) === "string" )
        {
            try { dump = JSON.parse( dump ); } catch (err) {}
        }
        database.delAll( function( success )
        {
            var keysRemaining = 0;
        
            var key;
            for ( key in dump )
            {
                keysRemaining++;
            }
                
            var restoreFunc = function( success )
            {
                keysRemaining--;
            
                if ( keysRemaining <= 0 )
                {
                    cb( true );
                }
            }.bind(this);
            
            if ( keysRemaining <= 0 )
            {
                cb( true );
            }
            else
            {
                for ( key in dump )
                {
                    database.restore( key, dump[ key ], restoreFunc );
                }
            }
        }.bind(this));
    },
    
    //fetches a URL and returns the body to the callback
    getUrlBody: function( url, cb )
    {
        if ( url.indexOf( "://" ) < 0 )
        {
            url = "http://" + url;
        }
        
        http.get( url, function(res)
        {
            var body = "";
            
            res.on( "data", function(chunk)
            {
                body += chunk;
            });
            
            res.on( "end", function()
            {
                try
                {
                    let data = body;
                    
                    if ( typeof( data ) === "string" )
                    {
                        data = JSON.parse( data );
                    }
                    
                    cb( true, data );
                }
                catch(err)
                {
                    cb( false, "Couldn't parse JSON: " + body );
                }
                
            });
        }).on( "error", function(e)
        {
            cb( false, e.message );
        });
    },
    
    httpsPostJson: function( hostname, path, body, cb )
    {
        const options = {
          hostname: hostname,
          path: path,
          method: "POST",
          auth: "",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": body.length
          }
        }

        const request = https.request( options, function( response )
        {
            response.on( "data", function( d )
            {
                let data = d;
                
                if ( typeof( data ) === "string" )
                {
                    data = JSON.parse( data );
                }
                
                cb( true, data );
            });
        })

        request.on( "error", function( error )
        {
            cb( false, error );
        });

        request.write( body );
        request.end();
    }
};