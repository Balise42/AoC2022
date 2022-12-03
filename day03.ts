import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day03.txt"))
var sumPrioRucksacks = 0;
var sumBadges = 0;
var currSacks = [];
var numElves = 0;

reader.on("line", (l: string) => {
    sumPrioRucksacks += computeRucksackPriority( l );
    numElves++;
    currSacks.push(l);
    if ( numElves === 3 ) {
        var badge = computeBadge( currSacks );
        sumBadges += badge;
        currSacks = [];
        numElves = 0;
    }
});

reader.on('close', () => {
    console.log( sumPrioRucksacks );
    console.log( sumBadges );
});

function computeRucksackPriority( l: string ): number {
    var elements = new Map();
    for ( var i = 0; i < l.length / 2; i++ ) {
        elements.set(l[i], true);
    }
    for ( var i = l.length / 2; i < l.length; i++) {
        if (elements.has(l[i])) {
            return getRucksackElementPrio( l.charCodeAt(i) );
        }
    }
    throw 'Invalid input';
}

function getRucksackElementPrio( n: number ): number {
    var prio = n;
    if ( prio >= 97 ) { // small case a
        prio -= 96;
    }
    else {
        prio -= 65;
        prio += 27;
    }
    return prio;
}

function computeBadge( currSacks: Array<string> ): number {
    var elements = new Map();
    for ( var i = 0; i < currSacks[0].length; i++ ) {
        if ( !elements.has(currSacks[0][i]) ) {
            elements.set(currSacks[0][i], 1);
        }
    }
    for ( var i = 0; i < currSacks[1].length; i++ ) {
        if ( elements.has(currSacks[1][i]) ) {
            elements.set(currSacks[1][i], 2);
        }
    }
    for (var i = 0; i < currSacks[2].length; i++ ) {
        if ( elements.get(currSacks[2][i]) === 2) {
            return getRucksackElementPrio(currSacks[2].charCodeAt(i))
        }
    }
    throw 'Invalid input';
}