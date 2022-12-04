import * as fs from 'fs';
import * as rd from 'readline'

const reader : rd.Interface = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day04.txt"))
var sum : number = 0;
var sum2 : number = 0;
const regex : RegExp = /(\d+)-(\d+),(\d+)-(\d+)/

reader.on("line", (l: string) => {
    const matches : RegExpMatchArray = l.match( regex );
    const a : number = parseInt(matches[1]);
    const b : number = parseInt(matches[2]);
    const c : number = parseInt(matches[3]);
    const d : number = parseInt(matches[4]);

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