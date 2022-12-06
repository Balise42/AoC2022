import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day06-test.txt"))
var sum = 0;
var loads = [];

reader.on("line", (l: string) => {
    console.log( computeMarkerPlace( l, 4 ) );
    console.log( computeMarkerPlace( l, 14) );
});

function computeMarkerPlace( l : string, k : number ) : number {
    let numDiffs = 0;
    for ( let i = 0; i < k - 1; i++ ) {
        for ( let j = i+1; j < k; j++) {
            numDiffs += Number( l[i] !== l[j] );
        }
    }

    if ( numDiffs === (k * (k-1) ) / 2 ) {
        return k+1;
    }

    for ( let i = k; i < l.length; i++ ) {
        for ( let j = 1; j < k; j++ ) {
            numDiffs += Number(l[i] !== l[i-j]);
            numDiffs -= Number(l[i-k] !== l[i-j]);
        }
        if ( numDiffs === (k * (k-1) ) / 2 ) {
            return i + 1;
        }
    }
    throw("No solution");
}