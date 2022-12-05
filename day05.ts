import { reverse } from 'dns';
import * as fs from 'fs';
import * as rd from 'readline'

let reader = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day05.txt"))

let crates : Array<Array<String>> = [];
let crates2 : Array<Array<String>> = [];
const crateRowRegex : RegExp = /(?<crate>\s{3}|\[[A-Z]\])(?:\s|$)/g;
const crateRegex : RegExp = /\[([A-Z])\]/;
const moveRegex : RegExp = /move (?<n>\d+) from (?<from>\d) to (?<to>\d)/;

reader.on("line", (l: string) => {
    if ( l.startsWith( ' 1' ) ) {
        crates2 = JSON.parse(JSON.stringify(crates));
        return;
    } else if ( l.startsWith('m') ) {
        moveCrates( l );
    } else {
        parseCrates( l );
    }
});

function moveCrates( l : String ) {
    const inst = l.match( moveRegex );
    const n = parseInt( inst.groups['n'] );
    const from = parseInt( inst.groups['from'] ) - 1;
    const to = parseInt( inst.groups['to'] ) - 1;
    for ( let i = 0; i < n; i++ ) {
       crates[to].unshift(crates[from].shift());
    }
    const toAdd = crates2[from].slice(0, n).reverse();
    for ( const a of toAdd ) {
        crates2[to].unshift(a);
    }
    crates2[from] = crates2[from].slice(n);
}

function parseCrates( l : String) {
    const row = l.matchAll( crateRowRegex );
    let i = 0;
    for ( const c of row ) {
        if (i > crates.length - 1 ) {
            crates.push( new Array<String> );
        }
        i++;
        if (c[0].startsWith(' ') ) {
            continue;
        }
        else {
            var crate = c[0].match(crateRegex);
            var letter = crate[1];
            crates[i-1].push( letter );
        }
    }
}

reader.on('close', () => {
    for ( let crate of crates ) {
        process.stdout.write( crate[0].toString() );
    }
    console.log();
    for ( let crate of crates2 ) {
        process.stdout.write( crate[0].toString() );
    }
    console.log();
});