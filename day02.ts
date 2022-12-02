import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day02.txt"))
var score = 0;
var score2 = 0;

reader.on("line", (l: string) => {
    var game = l.split( ' ' );
    if ( game[1] === 'X' ) {
        score +=1;
        if ( game[0] === 'A' ) {
            score += 3;
            score2 += 3;
        } else if ( game[0] === 'B' ) {
            score2 += 1;
        } else if ( game[0] === 'C' ) {
            score += 6;
            score2 += 2;
        }
    } else if ( game[1] === 'Y' ) {
        score += 2;
        score2 += 3;
        if ( game[0] === 'A' ) {
            score += 6;
            score2 += 1;
        } else if ( game[0] === 'B' ) {
            score += 3;
            score2 += 2;
        } else if ( game[0] === 'C' ) {
            score2 += 3;
        }
    } else if ( game[1] === 'Z' ) {
        score +=3;
        score2 += 6;
        if ( game[0] === 'A') {
            score2 += 2;
        } else if ( game[0] === 'B' ) {
            score += 6;
            score2 += 3;
        } else if ( game[0] === 'C' ) {
            score += 3;
            score2 += 1;
        }
    }
});

reader.on('close', () => {
    console.log( score );
    console.log( score2 );
});