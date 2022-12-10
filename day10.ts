import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day10.txt"))
var xValues = [1];
var xValue = 1;

reader.on("line", (l: string) => {
    const toks = l.split( ' ' );
    if (toks[0] === 'noop' ) {
        xValues.push(xValue);
    } else if ( toks[0] === 'addx' ) {
        xValues.push(xValue);
        xValues.push(xValue);
        xValue += parseInt(toks[1]);
    }
});

reader.on('close', () => {
    console.log( xValues[20] * 20 + xValues[60] * 60 + xValues[100] * 100 + xValues[140] * 140 + xValues[180] * 180 + xValues[220] * 220);
    for ( var i = 0; i < 6; i++ ) {
        var line = '';
        for ( var j = 0; j < 40; j++ ) {
            if ( xValues[i*40+j+1] === j || xValues[i*40+j+1] === j-1 || xValues[i*40+j+1] == j+1 ) {
                line += '#';
            } else {
                line += '.';
            }
        }
        console.log(line);
    }
});