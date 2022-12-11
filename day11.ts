import * as fs from 'fs';
import * as rd from 'readline'

const reader = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day11.txt"))

class Monkey {
    public id : number;
    public holding : Array<number> = [];
    public opType : string;
    public operand : number;
    public divisible : number;
    public ifTrue : number;
    public ifFalse : number;
    public inspected : number = 0;

    public throwItem( part1 : boolean) : Array<number> {
        this.inspected++;
        let item = this.holding.pop();
        if ( this.opType === 'square' ) {
            item = item * item;
        } else if ( this.opType === '*' ) {
            item = item * this.operand;
        } else if ( this.opType === '+' ) {
            item = item + this.operand;
        }
        if (part1) {
            item = Math.floor(item / 3);
        }
        if ( item % this.divisible === 0 ) {
            return [ item % sit.globalTest, this.ifTrue ];
        } else {
            return [ item % sit.globalTest, this.ifFalse ];
        }
    }
}

class MonkeySituation {
    public monkeys : Array<Monkey> = [];
    public globalTest = 1;

    public doRound( part1 ) {
        for ( let i = 0; i < this.monkeys.length; i++ ) {
            while ( this.monkeys[i].holding.length > 0 ) {
                const thrown = this.monkeys[i].throwItem( part1 );
                this.monkeys[thrown[1]].holding.push(thrown[0]);
            }
        }
    }
}

let sit = new MonkeySituation();

reader.on("line", (l: string) => {
    const toks = l.split( ':' );
    if ( toks[0].startsWith('Monkey')) {
        let monkey = new Monkey();
        monkey.id = sit.monkeys.length;
        sit.monkeys.push( monkey );
    } else {
        let monkey = sit.monkeys[sit.monkeys.length - 1];
        if ( toks[0].endsWith('Starting items')) {
            const items = toks[1].split(', ');
            for ( let item of items ) {
                monkey.holding.push(parseInt(item));
            }
        } else if ( toks[0].endsWith('Operation')) {
            if ( toks[1] === ' new = old * old' ) {
                monkey.opType = 'square';
            } else {
                const groups = l.match( /old ([+|*]) (\d+)/ );
                monkey.opType = groups[1];
                monkey.operand = parseInt(groups[2]);
            }
        } else if ( toks[0].endsWith('Test')) {
            monkey.divisible = parseInt(l.match( /\d+/ )[0]);
            sit.globalTest *= monkey.divisible;
        } else if ( toks[0].endsWith('If true')) {
            monkey.ifTrue = parseInt(l.match( /\d+/ )[0]);
        } else if ( toks[0].endsWith('If false')) {
            monkey.ifFalse = parseInt(l.match( /\d+/ )[0]);
        }
    }
});

reader.on('close', () => {
    for ( let i = 0; i < 10000; i++ ) {
        sit.doRound( false );
    }

    let sortedMonkeys = sit.monkeys.slice();
    sortedMonkeys = sit.monkeys.sort( function(a, b) {return b.inspected - a.inspected});
    console.log(sortedMonkeys[0].inspected * sortedMonkeys[1].inspected);
});