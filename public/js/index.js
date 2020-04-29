var index =
{
    messageChanged: function( messageTextId, messageButtonId, currentMessage )
    {
        const messageText = document.getElementById( messageTextId );
        const messageButton = document.getElementById( messageButtonId );
        messageButton.disabled = messageText.value === currentMessage;
    },
    
    updateMessage: function( messageTextId )
    {
        const messageText = document.getElementById( messageTextId );
        server.updateMessage( messageText.value, this._showResult );
    },
    
    scheduleCoffee: function( channelSelectId, dryRunCheckboxId, user1SelectId, user2SelectId )
    {
        const channelSelect = document.getElementById( channelSelectId );
        const dryRunCheckbox = document.getElementById( dryRunCheckboxId );
        const user1Select = document.getElementById( user1SelectId );
        const user2Select = document.getElementById( user2SelectId );
        server.scheduleCoffee( channelSelect.options[channelSelect.selectedIndex].value,
                               dryRunCheckbox.checked,
                               user1Select.options[user1Select.selectedIndex].value,
                               user2Select.options[user2Select.selectedIndex].value,
                               this._showResult );
    },
    
    clearPairs: function()
    {
        const message = "This is a destructive action that will permanently erase all stored pairing data. Are you sure you want to do this?";
        if ( window.confirm( message ) )
        {
            server.clearPairs( this._showResult );
        }
    },
    
    removeSelectedExcludedUser: function( addExcludedUsersSelectId, removeExcludedUsersSelectId, allUsersString, sortedUserKeysString )
    {
        const removeExcludedUsersSelect = document.getElementById( removeExcludedUsersSelectId );
        if ( removeExcludedUsersSelect.selectedIndex > 0 )
        {
            server.removeExcludedUser( removeExcludedUsersSelect.options[removeExcludedUsersSelect.selectedIndex].value,
                this._showUpdatedExcludedUsersResult.bind( this, addExcludedUsersSelectId, removeExcludedUsersSelectId,
                    JSON.parse(allUsersString), JSON.parse(sortedUserKeysString) ) );
        }
    },
    
    addSelectedExcludedUser: function( addExcludedUsersSelectId, removeExcludedUsersSelectId, allUsersString, sortedUserKeysString )
    {
        const addExcludedUsersSelect = document.getElementById( addExcludedUsersSelectId );
        if ( addExcludedUsersSelect.selectedIndex > 0 )
        {
            server.addExcludedUser( addExcludedUsersSelect.options[addExcludedUsersSelect.selectedIndex].value,
                this._showUpdatedExcludedUsersResult.bind( this, addExcludedUsersSelectId, removeExcludedUsersSelectId,
                    JSON.parse(allUsersString), JSON.parse(sortedUserKeysString) ) );
        }
    },
    
    //this is the worst thing ever, maybe?
    refreshExcludedUserSelects: function( addExcludedUsersSelectId, removeExcludedUsersSelectId, excludedUsers, allUsers, sortedUserKeys )
    {
        const addExcludedUsersSelect = document.getElementById( addExcludedUsersSelectId );
        const removeExcludedUsersSelect = document.getElementById( removeExcludedUsersSelectId );
                
        let removeHTML = '<option value="">Select User To Remove</option>';
        Object.keys( excludedUsers ).forEach( function( userId )
        {
            removeHTML += '<option value="' + userId + '">' + ( allUsers[userId] ? allUsers[userId] : userId ) + '</option>';
        });
        removeExcludedUsersSelect.innerHTML = removeHTML;
        
        let addHTML = '<option value="">Select User To Add</option>';
        for (let keyIndex = 0; keyIndex < sortedUserKeys.length; keyIndex++)
        {
            const userId = sortedUserKeys[keyIndex];
            if (keyIndex > 0 && !excludedUsers[userId])
            {
                addHTML += '<option value="' + userId + '">' + ( allUsers[userId] ? allUsers[userId] : userId ) + '</option>';
            }
        };
        addExcludedUsersSelect.innerHTML = addHTML;
    },
    
    _showUpdatedExcludedUsersResult: function( addExcludedUsersSelectId, removeExcludedUsersSelectId, allUsers, sortedUserKeys, result )
    {
        if ( result.success )
        {
            this.refreshExcludedUserSelects( addExcludedUsersSelectId, removeExcludedUsersSelectId, result.excludedUsers, allUsers, sortedUserKeys );
        }
        this._showResult( result );
    },
    
    _showResult: function( result )
    {
        var resultStr = result;
        if ( typeof(result) === 'object' )
        {
            resultStr = JSON.stringify( result );
        }
        document.getElementById('result').innerHTML = resultStr;
    }
};