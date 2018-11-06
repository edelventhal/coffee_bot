/*global encodeURIComponent*/
/*global XMLHttpRequest*/
/*global alert*/

//can conventiently be used to asynchronously make RESTful server calls
//see the testMyRoute and testUseParameter examples below.
var server =
{
    _sendRequest: function( url, params, cb )
    {
        var fullUrl = url;
        
        if ( params )
        {
            var addedParam = false;
            var key;
            for ( key in params )
            {
                if ( !addedParam )
                {
                    fullUrl += "?";
                    addedParam = true;
                }
                else
                {
                    fullUrl += "&";
                }
            
                fullUrl += encodeURIComponent(key);
                fullUrl += "=";
                fullUrl += encodeURIComponent( params[key] );
            }
        }
        
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", this._loadResponse.bind( this, oReq, cb ) );
        oReq.addEventListener("error", this._loadError.bind( this, oReq, fullUrl, cb ) );
        oReq.open("GET", fullUrl );
        oReq.send();
    },
    
    _loadResponse: function( oReq, cb )
    {
        //TODO - add in error handling and bad statuses and whatnot
        cb( JSON.parse( oReq.responseText ) );
    },
    
    _loadError: function( oReq, url, cb )
    {
        alert( "Failed to load URL: " + url + ".\n" + oReq.responseText );
        cb();
    },
    
    testMyRoute: function( cb )
    {
        this._sendRequest( "test/myRoute", { username: username }, cb );
    },
    
    testUseParameter: function( idParam, cb )
    {
        this._sendRequest( "test/useParameter", { id: idParam }, cb );
    }
};