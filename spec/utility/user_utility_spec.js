var userUtility = require( "../../server/utility/user_utility.js" );
var userIds;
var pairData;
var individualData;
var excludedUsers;

const DATA =
{
    "timesPaired": {
        "UE629MLQ5": 1,
        "U88PDP37S": 2,
        "UF9CCM39D": 2,
        "UFMHY2S0N": 2,
        "UDE0D03GR": 3,
        "UHZN5FAGK": 2,
        "U8PLM21HN": 1,
        "U6M8F9MJA": 2,
        "UEC380M36": 2,
        "UHK9LL9BQ": 2,
        "ULKC9TZTR": 2,
        "UE6TB4N87": 1,
        "UKH6349CJ": 2,
        "UF8BDMFAP": 2,
        "U6L6E5Q6R": 2,
        "ULT0MD00J": 1,
        "UJPUFLRSB": 2,
        "UDQQY8SN7": 3,
        "UG1SNEJNM": 5,
        "UGWLGLDJA": 1,
        "UMW9F124B": 1,
        "U7C7TKME1": 1,
        "UNP2DHBB3": 3,
        "ULHFN7BQ8": 1,
        "UA9UKQLSH": 1,
        "UKQ572PEX": 2,
        "U6NQVMTQB": 2,
        "UAP9L06MS": 2,
        "UF5BFFS7P": 2,
        "UAY0Y8B42": 1,
        "UPD254SF2": 2,
        "UHHRP92RJ": 1,
        "UF8B37SKC": 3,
        "U8XQZ8CP9": 2,
        "UGQ9X3KHT": 1,
        "UNVESG5B2": 2,
        "UGU9HFG00": 2,
        "UR4NLJA5A": 3,
        "UCZ8QS7QR": 1,
        "UPW2D8E01": 1,
        "UG9UQ0KDZ": 2,
        "U71V12B6C": 2,
        "UJ43FT5MH": 1,
        "UU0C8AXC2": 2,
        "UHKAF78Q2": 2,
        "UPG63LCAW": 1,
        "U0101R3SVS9": 2,
        "UJ5Q0BEPP": 1,
        "UN4H5CRJT": 2,
        "U011G3FU6BW": 2,
        "UAAPBMQCV": 1,
        "UV31E5UUA": 1,
        "U010MMTNPFU": 1,
        "UHY5RUG2X": 2,
        "U0124JUEN6B": 1,
        "UUUEZC5S4": 2,
        "U0116F6NMS7": 1,
        "UFXJ57V8B": 1,
        "UGG8414F6": 1,
        "UBV9AN119": 1,
        "U9BCCJ1A6": 1,
        "UPC8CGE5A": 1,
        "UF8H12Y5B": 1,
        "UMM1ECWK0": 1,
        "UJ0B6BH2N": 1,
        "UNN2EPGSZ": 1,
        "USJUA1QKW": 1,
        "UQQ0ME19V": 1
    },
    "pairs": {
        "UE629MLQ5": 1,
        "U88PDP37S": {
            "UGU9HFG00": 1
        },
        "UF9CCM39D": {
            "UKQ572PEX": 1
        },
        "UFMHY2S0N": {
            "U9BCCJ1A6": 1
        },
        "UDE0D03GR": {
            "UG9UQ0KDZ": 1,
            "UHY5RUG2X": 1
        },
        "UHZN5FAGK": {
            "UAP9L06MS": 1
        },
        "U8PLM21HN": 1,
        "U6M8F9MJA": {
            "U6NQVMTQB": 1
        },
        "UEC380M36": 1,
        "UHK9LL9BQ": {
            "UF5BFFS7P": 1
        },
        "ULKC9TZTR": {
            "UG9UQ0KDZ": 1
        },
        "UE6TB4N87": 1,
        "UKH6349CJ": {
            "UU0C8AXC2": 1
        },
        "UF8BDMFAP": {
            "UNP2DHBB3": 1
        },
        "U6L6E5Q6R": {
            "UJ5Q0BEPP": 1
        },
        "ULT0MD00J": 1,
        "UJPUFLRSB": {
            "UA9UKQLSH": 1
        },
        "UDQQY8SN7": {
            "UMW9F124B": 1,
            "U7C7TKME1": 1
        },
        "UG1SNEJNM": {
            "U0101R3SVS9": 1,
            "UHY5RUG2X": 1,
            "USJUA1QKW": 1,
            "UQQ0ME19V": 1
        },
        "UGWLGLDJA": 1,
        "UMW9F124B": {
            "UDQQY8SN7": 1
        },
        "U7C7TKME1": {
            "UDQQY8SN7": 1
        },
        "UNP2DHBB3": {
            "ULHFN7BQ8": 1,
            "UF8B37SKC": 1,
            "UF8BDMFAP": 1
        },
        "ULHFN7BQ8": {
            "UNP2DHBB3": 1
        },
        "UA9UKQLSH": {
            "UJPUFLRSB": 1
        },
        "UKQ572PEX": {
            "U6NQVMTQB": 1,
            "UF9CCM39D": 1
        },
        "U6NQVMTQB": {
            "UKQ572PEX": 1,
            "U6M8F9MJA": 1
        },
        "UAP9L06MS": {
            "UHZN5FAGK": 1,
            "UR4NLJA5A": 1
        },
        "UF5BFFS7P": {
            "UHK9LL9BQ": 1,
            "U8XQZ8CP9": 1
        },
        "UAY0Y8B42": {
            "UPD254SF2": 1
        },
        "UPD254SF2": {
            "UAY0Y8B42": 1,
            "U0124JUEN6B": 1
        },
        "UHHRP92RJ": {
            "UF8B37SKC": 1
        },
        "UF8B37SKC": {
            "UHHRP92RJ": 1,
            "UNP2DHBB3": 1,
            "UFXJ57V8B": 1
        },
        "U8XQZ8CP9": {
            "UF5BFFS7P": 1,
            "UU0C8AXC2": 1
        },
        "UGQ9X3KHT": {
            "UNVESG5B2": 1
        },
        "UNVESG5B2": {
            "UGQ9X3KHT": 1,
            "U71V12B6C": 1
        },
        "UGU9HFG00": {
            "U88PDP37S": 1,
            "UJ0B6BH2N": 1
        },
        "UR4NLJA5A": {
            "UAP9L06MS": 1,
            "UJ43FT5MH": 1,
            "UN4H5CRJT": 1
        },
        "UCZ8QS7QR": {
            "UPW2D8E01": 1
        },
        "UPW2D8E01": {
            "UCZ8QS7QR": 1
        },
        "UG9UQ0KDZ": {
            "UDE0D03GR": 1,
            "ULKC9TZTR": 1
        },
        "U71V12B6C": {
            "UNVESG5B2": 1,
            "UGG8414F6": 1
        },
        "UJ43FT5MH": {
            "UR4NLJA5A": 1
        },
        "UU0C8AXC2": {
            "UKH6349CJ": 1,
            "U8XQZ8CP9": 1
        },
        "UHKAF78Q2": {
            "UPG63LCAW": 1,
            "UNN2EPGSZ": 1
        },
        "UPG63LCAW": {
            "UHKAF78Q2": 1
        },
        "U0101R3SVS9": {
            "UG1SNEJNM": 1,
            "UV31E5UUA": 1
        },
        "UJ5Q0BEPP": {
            "U6L6E5Q6R": 1
        },
        "UN4H5CRJT": {
            "UR4NLJA5A": 1,
            "U010MMTNPFU": 1
        },
        "U011G3FU6BW": {
            "UAAPBMQCV": 1,
            "UBV9AN119": 1
        },
        "UAAPBMQCV": {
            "U011G3FU6BW": 1
        },
        "UV31E5UUA": {
            "U0101R3SVS9": 1
        },
        "U010MMTNPFU": {
            "UN4H5CRJT": 1
        },
        "UHY5RUG2X": {
            "UG1SNEJNM": 1,
            "UDE0D03GR": 1
        },
        "U0124JUEN6B": {
            "UPD254SF2": 1
        },
        "UUUEZC5S4": {
            "U0116F6NMS7": 1,
            "UMM1ECWK0": 1
        },
        "U0116F6NMS7": {
            "UUUEZC5S4": 1
        },
        "UFXJ57V8B": {
            "UF8B37SKC": 1
        },
        "UGG8414F6": {
            "U71V12B6C": 1
        },
        "UBV9AN119": {
            "U011G3FU6BW": 1
        },
        "U9BCCJ1A6": {
            "UFMHY2S0N": 1
        },
        "UPC8CGE5A": {
            "UF8H12Y5B": 1
        },
        "UF8H12Y5B": {
            "UPC8CGE5A": 1
        },
        "UMM1ECWK0": {
            "UUUEZC5S4": 1
        },
        "UJ0B6BH2N": {
            "UGU9HFG00": 1
        },
        "UNN2EPGSZ": {
            "UHKAF78Q2": 1
        },
        "USJUA1QKW": {
            "UG1SNEJNM": 1
        },
        "UQQ0ME19V": {
            "UG1SNEJNM": 1
        }
    }
};

const NEVER_PAIRED_USERNAME = "NeverPairedUser";
const EXCLUDED_USERNAME = "ExcludedUser";

describe( "User Utility", function()
{
    beforeEach(function()
    {
        userIds = Object.keys( DATA.timesPaired );
        userIds.push( NEVER_PAIRED_USERNAME );
        userIds.push( EXCLUDED_USERNAME );
        
        pairData = JSON.parse( JSON.stringify( DATA.timesPaired ) );
        
        individualData = JSON.parse( JSON.stringify( DATA.pairs ) );
        
        excludedUsers = {};
        excludedUsers[EXCLUDED_USERNAME] = true;
    });
    
    it( "should be able to find the minimum paired count", function()
    {
        const minimumCount = userUtility.findMinimumPairedCount( userIds, pairData, excludedUsers );
        expect(minimumCount).toEqual(0);
        
        userIds.splice( userIds.indexOf( NEVER_PAIRED_USERNAME ), 1 );
        const newMinimumCount = userUtility.findMinimumPairedCount( userIds, pairData, excludedUsers );
        expect(newMinimumCount).toEqual(1);
        
        const emptyCount = userUtility.findMinimumPairedCount( userIds, {}, excludedUsers );
        expect(emptyCount).toEqual(0);
    });
    
    it( "should be able to find the minimum individual match count", function()
    {
        const testUserId = "UG1SNEJNM";
        const minimumCount = userUtility.findMinimumPairedCount( userIds, individualData[testUserId] );
        expect(minimumCount).toEqual(0);
        
        const testUserIds = Object.keys( individualData[testUserId] );
        const minimumCountLimited = userUtility.findMinimumPairedCount( testUserIds, individualData[testUserId] );
        expect(minimumCountLimited).toEqual(1);
    });
    
    it( "should be able to find all users who were never paired", function()
    {
        const testUserId = "UG1SNEJNM";
        const neverPairedUsers = userUtility.findUsersPairedWithinRange( userIds, pairData, 0, 0, excludedUsers );
        expect(neverPairedUsers.length).toEqual(1);
        expect(neverPairedUsers[0]).toEqual(NEVER_PAIRED_USERNAME);
    });
});