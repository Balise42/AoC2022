import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day01.txt"))
var sum = 0;
var loads = [];

reader.on("line", (l: string) => {
    if ( l.trim() === '' ) {
        loads.push( sum );
        sum = 0;
    } else {
        sum += parseInt( l );
    }
});

reader.on('close', () => {
    loads.push( sum );
    loads.sort( function(a, b){return b-a} );
    console.log( loads[0] );
    console.log( loads[0] + loads[1] + loads[2] );
});