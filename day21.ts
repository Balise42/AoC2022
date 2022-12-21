import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day21.txt"))

const regex = /([a-z]{4}): (?:(\d+)|([a-z]{4}) ([+\-\/*]) ([a-z]{4}))/

class Symbol {
    public value : number;
    public variable : string;
    public op1 : Symbol;
    public op2 : Symbol;
    public op : string;
}

const vars = new Map<string, number>()
const symbVars = new Map<string, Symbol>();
const insts = new Map<string, [ string, string, string ]>();

reader.on("line", (l: string) => {
    const groups = l.match(regex);
    if ( groups[2] !== undefined ) {
        vars.set( groups[1], parseInt(groups[2]));
        let val = new Symbol();
        val.value = parseInt(groups[2]);
        symbVars.set( groups[1], val);
    } else {
        insts.set( groups[1], [groups[3], groups[4], groups[5]]);
    }
});

function getMonkeyValue( monkey : string ) : number {
    if ( vars.has(monkey) ) {
        return vars.get(monkey);
    } else {
        const op =  insts.get(monkey)[1];
        const m1 = insts.get(monkey)[0];
        const m2 = insts.get(monkey)[2];
        let val = -1;
        if ( op === '+' ) {
            val = getMonkeyValue(m1) + getMonkeyValue(m2);
        } else if ( op === '-' ) {
            val =  getMonkeyValue(m1) - getMonkeyValue(m2);
        } if ( op === '*' ) {
            val = getMonkeyValue(m1) * getMonkeyValue(m2);
        } else if ( op === '/' ) {
            val = getMonkeyValue(m1) / getMonkeyValue(m2);
        }
        vars.set( monkey, val );
        return val;
    }
}

function getSymbolicMonkeyValue( monkey : string) : Symbol {
    if ( monkey === 'root' ) {
        let equation = new Symbol();
        equation.op = '=';
        equation.op1 = getSymbolicMonkeyValue( insts.get(monkey)[0]);
        equation.op = insts.get(monkey)[1];
        equation.op2 = getSymbolicMonkeyValue( insts.get(monkey)[2]);
    } else if ( monkey === 'humn' ) {
        let human = new Symbol();
        human.variable = 'humn';
        return human;
    }
    if ( symbVars.has(monkey) ) {
        return symbVars.get(monkey);
    } else {
        const op =  insts.get(monkey)[1];
        const m1 = insts.get(monkey)[0];
        const m2 = insts.get(monkey)[2];
        let val = null;
        
        let valM1 = getSymbolicMonkeyValue(m1);
        let valM2 = getSymbolicMonkeyValue(m2);
        
        val = new Symbol();
        if ( valM1.value === undefined || valM2.value === undefined ) {
            
            val.op = op;
            val.op1 = valM1;
            val.op2 = valM2;
        } else {
           if ( op === '+' ) {
                val.value = getSymbolicMonkeyValue(m1).value + getSymbolicMonkeyValue(m2).value;
            } else if ( op === '-' ) {
                val.value = getSymbolicMonkeyValue(m1).value - getSymbolicMonkeyValue(m2).value;
            } if ( op === '*' ) {
                val.value = getSymbolicMonkeyValue(m1).value * getSymbolicMonkeyValue(m2).value;
            } else if ( op === '/' ) {
                val.value = getSymbolicMonkeyValue(m1).value / getSymbolicMonkeyValue(m2).value;
            }
        }
        symbVars.set( monkey, val );
        return val;
    }
}

reader.on('close', () => {
    console.log(getMonkeyValue('root'));
    let equation = getSymbolicMonkeyValue('root');
    // assumptions: the equation has only one humn and the right hand side is always a single number
    // so i can always do operations on numbers and be done with it
    while ( equation.op1.variable === undefined ) {
        let left = equation.op1;
        if ( left.op === '+' ) {
            if ( left.op1.value !== undefined ) {
                equation.op2.value -= left.op1.value;
                equation.op1 = left.op2;
            } else {
                equation.op2.value -= left.op2.value;
                equation.op1 = left.op1;
            }
        } else if ( left.op === '*' ) {
            if ( left.op1.value !== undefined ) {
                equation.op2.value /= left.op1.value;
                equation.op1 = left.op2;                
            } else {
                equation.op2.value /= left.op2.value;
                equation.op1 = left.op1;

            }
        } else if ( left.op === '-' ) {
            if ( left.op1.value !== undefined ) {
                equation.op2.value = left.op1.value - equation.op2.value;
                equation.op1 = left.op2;
            } else {
                equation.op2.value += left.op2.value;
                equation.op1 = left.op1;
            }
        } else if ( left.op === '/' ) {
            if ( left.op1.value !== undefined ) {
                equation.op2.value = left.op1.value / equation.op2.value;
                equation.op1 = left.op2;
            } else {
                equation.op2.value *= left.op2.value;
                equation.op1 = left.op1;
            }
        }
    }
    console.log(equation.op2.value);
});