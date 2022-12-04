import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day04.txt"))
var sum = 0;
var sum2 = 0;
const regex = /(\d+)-(\d+),(\d+)-(\d+)/

reader.on("line", (l: string) => {
    var matches = l.match( regex );
    var a = parseInt(matches[1]);
    var b = parseInt(matches[2]);
    var c = parseInt(matches[3]);
    var d = parseInt(matches[4]);

    if ( ( a <= c && b >= d ) || ( a >= c && b <= d ) ) {
        sum++;
    }
    if ( ( a >= c && a <= d ) || ( b >= c && b <= d ) || ( c >= a && c <= b ) || ( d >= a && d <= b ) ) {
        sum2++;
    }
});

reader.on('close', () => {
   console.log( sum );
   console.log( sum2 );
});