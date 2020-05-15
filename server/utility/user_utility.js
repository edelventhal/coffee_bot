var UserUtility = module.exports =
{
    //returns an int representing the lowest count any individual has been paired
    //userIds: array of user IDs, we'll search through these users
    //pastPairData: object with user IDs as keys, and integers as values (representing number of times paired)
    //[excludedUsers]: optional object with user IDs as keys, and booleans as values, we ignore these user IDs
    findMinimumPairedCount: function( userIds, pastPairData, excludedUsers )
    {
        excludedUsers = excludedUsers || {};
        
        let lowestCount = -1;
        userIds.forEach( function( userId )
        {
            if ( excludedUsers[userId] )
            {
                return;
            }
            
            const pairedCount = pastPairData[userId] || 0;
            if ( lowestCount < 0 || pairedCount < lowestCount )
            {
                lowestCount = pairedCount;
            }
        });
        return lowestCount;
    },
    
    //returns a list of user IDs that have been paired a number of times within a range
    //userIds: array of user IDs, we'll search through these users
    //pastData: object with user IDs as keys, and integers as values (representing number of times paired)
    //rangeMin: will only return users who have been paired >= this many times
    //rangeMax: will only return users who have been paired <= this many times
    //[excludedUsers]: optional object with user IDs as keys, and booleans as values, we ignore these user IDs
    findUsersPairedWithinRange: function( userIds, pastPairData, rangeMin, rangeMax, excludedUsers )
    {
        excludedUsers = excludedUsers || {};
        rangeMin = rangeMin || 0;
        rangeMax = rangeMax || 0;
        
        const validUsers = [];
        userIds.forEach( function( userId )
        {
            if ( excludedUsers[userId] )
            {
                return;
            }
            
            const pairedCount = pastPairData[userId] || 0;
            if ( pairedCount >= rangeMin && pairedCount <= rangeMax )
            {
                validUsers.push( userId );
            }
        });
        
        return validUsers;
    }
};