import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("/home/isa/projets/adventofcode/AoC2022/data/day25.txt"))

let sum : number = 0;

reader.on("line", (l: string) => {
    sum += parseSnafu(l);
});

reader.on("close", () => {
    console.log( toSnafu(sum) );
});

function parseSnafu(l : string) : number {
    const digits = [...l].reverse();
    var num = 0;
    for ( let i = 0; i < digits.length; i++) {
        if ( digits[i] === '-' ) {
            num -= Math.pow( 5, i );
        } else if (digits[i] === '=') {
            num -= 2*Math.pow(5, i);
        } else {
            num += parseInt(digits[i]) * Math.pow(5, i);
        }
    }
    return num;
}

function toSnafu( n : number ) : string {
    let i = 0;
    let str = '';
    while (n !== 0) {
        let dig = n % Math.pow(5, i+1) / Math.pow(5, i);
        if ( dig < 3 ) {
            str = dig + str;
            n -= dig * Math.pow(5, i);
        } else if (dig === 3) {
            str = '=' + str;
            n += 2*Math.pow(5, i);
        } else {
            str = '-' + str;
            n += Math.pow(5, i);
        }
        i++;
    }
    return str;
}