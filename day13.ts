import * as fs from 'fs';
import * as rd from 'readline'

const reader = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day13.txt"))

let index = 1;
let a = null;
let b = null;
let sum = 0;

let packets = [];

reader.on("line", (l: string) => {
    if ( l.trim() === '' ) {
        index++;
        a = null;
        b = null;
    } else if ( a === null ) {
        a = JSON.parse( l );
    } else {
        b = JSON.parse( l );
    }
    if ( b !== null ) {
        packets.push( a );
        packets.push( b );
        const inOrder =  packetsInOrder( a, b );
        if ( inOrder === 0 ) {
            throw "Shouldn't happen";
        }
        if( inOrder === 1 ) {
            sum += index;
        }
    }
});

function packetsInOrder(a: object, b: object) : number {
    if ( a instanceof Array && b instanceof Array ) {
        for ( let i = 0; i < a.length; i++ ) {
            if ( i > b.length - 1 ) {
                return -1;
            }
            const res = packetsInOrder( a[i], b[i] );
            if ( res !== 0 ) {
                return res;
            }
        }
        if ( a.length < b.length) {
            return 1;
        }
    } else if ( a instanceof Array ) {
        return packetsInOrder( a, [b] );
    } else if ( b instanceof Array ) {
        return packetsInOrder( [a], b );
    } else {
        if ( a < b ) {
            return 1;
        } else if ( a > b ) {
            return -1;
        }
    }
    return 0;
}

reader.on('close', () => {
    console.log( sum );
    const sep1 = [[2]];
    const sep2 = [[6]];
    packets.push(sep1);
    packets.push(sep2);
    packets = packets.sort( (a, b) => packetsInOrder(b, a) );
    console.log( (packets.indexOf(sep1)+1) * (packets.indexOf(sep2)+1));
});