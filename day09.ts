import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day09.txt"))

class RopeKnot {
    public h = 0;
    public v = 0;

    public follow( other : RopeKnot ) {
        if ( Math.abs(other.h - this.h) <= 1 && Math.abs(other.v - this.v) <= 1 ) {
            return;
        }
    
        if ( other.v !== this.v) {
            this.v += (other.v - this.v)/Math.abs(other.v - this.v);
        }
        if ( other.h !== this.h ) {
            this.h += (other.h - this.h)/Math.abs(other.h - this.h);    
        }
    }

    public toString(): string {
        return this.h + ' # ' + this.v;
    }
}

class Rope {
    public knots = new Array<RopeKnot>();
    public posTails = new Set<String>();

    public constructor( numKnots : number ) {
        for ( var i = 0; i < numKnots; i++ ) {
            this.knots.push(new RopeKnot());
        }
        this.posTails.add( this.knots[numKnots - 1].toString() );
    }

    public moveHead( dir : string ) {
        if ( dir === 'U' ) {
            this.knots[0].v -= 1;
        } else if ( dir === 'D' ) {
            this.knots[0].v += 1;
        } else if ( dir === 'L' ) {
            this.knots[0].h -= 1;
        } else if (dir === 'R' ) {
            this.knots[0].h +=1;
        }
        for ( var i = 1; i < this.knots.length; i++ ) {
            this.knots[i].follow(this.knots[i-1]);
        }
        this.posTails.add( this.knots[this.knots.length - 1].toString());
    }
}

var ropePart1 = new Rope(2);
var ropePart2 = new Rope(10);

reader.on("line", (l: string) => {
    const toks = l.split(' ');
    const dir = toks[0];
    const amount = parseInt(toks[1]);

    for ( var i = 0; i < amount; i++ ) {
        ropePart1.moveHead( dir );
        ropePart2.moveHead( dir );
    }
});


reader.on('close', () => {
    console.log(ropePart1.posTails.size);
    console.log(ropePart2.posTails.size);
});