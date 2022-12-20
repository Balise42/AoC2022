import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day20.txt"))

class NumberRef {
    constructor( num : bigint) {
        this.num = num;
    }
    
    public num: bigint;
}

const initOrder = [];
var zero = null;

reader.on("line", (l: string) => {
    const num = parseInt( l );
    const elem = new NumberRef( BigInt(num) );
    initOrder.push( elem );
    if ( num === 0 ) {
        zero = elem;
    }
});

function mixList( mixed ) {
    for ( let i = 0; i < initOrder.length; i++ ) {
        var item = initOrder.at(i);
        var currPos = mixed.indexOf( item );
    
        var newPos : bigint = BigInt(currPos) + item.num;
        
        newPos = newPos % BigInt(mixed.length - 1);
        if (newPos < BigInt(0)) {
            newPos += BigInt(mixed.length - 1);
        }
        
        let newPosInt = Number(newPos)

        mixed.splice( currPos, 1 );
        mixed = [ ...mixed.slice( 0, newPosInt ), item, ...mixed.slice(newPosInt)];
    }
    return mixed;
}

reader.on('close', () => {
    var mixed = initOrder.slice();
    mixed = mixList(mixed);

    let var0 = mixed.indexOf( zero );
    
    console.log( mixed[ (var0 + 1000) % mixed.length].num + mixed[(var0 + 2000) % mixed.length ].num + mixed[ (var0 + 3000) % mixed.length].num );

    
    for ( let i = 0; i < initOrder.length; i++ ) {
        initOrder[i].num *= BigInt(811589153);
    }
    let mixed2 = initOrder.slice();
    for ( let i = 0; i < 10; i++ ) {
        mixed2 = mixList(mixed2);
    }

    var0 = mixed2.indexOf( zero );
    
    console.log( mixed2[ (var0 + 1000) % mixed2.length].num + mixed2[(var0 + 2000) % mixed2.length ].num + mixed2[ (var0 + 3000) % mixed2.length].num );
});