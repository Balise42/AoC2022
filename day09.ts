import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day09.txt"))

var th = 0;
var tv = 0;
var hh = 0;
var hv = 0;

var posTail = new Set<String>();

reader.on("line", (l: string) => {
    const toks = l.split(' ');
    const dir = toks[0];
    const amount = parseInt(toks[1]);

    for ( var i = 0; i < amount; i++ ) {
        if ( dir === 'U' ) {
            tv -= 1;
        } else if ( dir === 'D' ) {
            tv += 1;
        } else if ( dir === 'L' ) {
            th -= 1;
        } else if (dir === 'R' ) {
            th +=1;
        }

        updateTail();
    }
});

function updateTail() {
    if ( Math.abs(th - hh) <= 1 && Math.abs(tv - hv) <= 1 ) {
        return;
    }

    if ( tv !== hv) {
        hv += (tv - hv)/Math.abs(tv - hv);
    }
    if ( th !== hh ) {
        hh += (th - hh)/Math.abs(th - hh);    
    }


    posTail.add( hh + ' # ' + hv );
}

reader.on('close', () => {
    posTail.add('0 # 0');
    console.log(posTail.size);
});