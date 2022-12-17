import * as fs from 'fs';
import * as rd from 'readline'

const reader : rd.Interface = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day17.txt"))

let commands = [];
let grid = [];

function getHighest() : number {
    let y = 2022*5 - 1;
    while( true ) {
        for ( let i = 0; i < 7; i++) {
            if (grid[i][y] === 1) {
                return y;
            }
        }
        y--;
    }
    throw "Didn't find the highest point";
}

function getLine( y: number ) : string {
    if ( y < 0) {
        return '#######';
    }
    let res : string = '';
    for ( let i = 0; i < 7; i++) {
        res = res + (grid[i][y] === 0 ? '.' : '#');
    }
    return res;
}
class Polyomino {
    // Types: -, +, L, I, o
    public type : string;

    // posX, posY, of X in the shape
    // X###     #
    //          #
    //  #       #
    // #X#      X
    //  #
    //
    //   #   ##
    //   #   X#
    // ##X
    public posX : number;
    public posY : number;

    public constructor( type : string ) {
        this.type = type;
        if (this.type === '-') {
            this.posX = 2;
            this.posY = getHighest() + 4;
        }
        else if (this.type === '+') {
           this.posX = 3;
           this.posY = getHighest() + 5;
        } else if ( this.type === 'L' ) {
            this.posX = 4;
            this.posY = getHighest() + 4;
        } else if ( this.type === 'I' ) {
            this.posX = 2;
            this.posY = getHighest() + 4;
        } else if ( this.type === 'o' ) {
            this.posX = 2;
            this.posY = getHighest() + 4;
        }
    }

    public pushLeft() {
        if (this.type === '-') {
            if ( this.posX > 0 && grid[this.posX-1][this.posY] === 0 ) {
                this.posX--;
            }
        }
        else if (this.type === '+') {
            if ( this.posX > 1 && grid[this.posX - 2][this.posY] === 0 && grid[this.posX-1][this.posY-1] === 0 && grid[this.posX-1][this.posY+1] === 0) {
                this.posX--;
            }
        } else if ( this.type === 'L' ) {
            if ( this.posX > 2 && grid[this.posX - 3][this.posY] === 0 && grid[this.posX-1][this.posY+1] === 0 && grid[this.posX-1][this.posY+2] === 0) {
                this.posX--;
            }
        } else if ( this.type === 'I' ) {
            if (this.posX > 0 && grid[this.posX - 1][this.posY] === 0 && grid[this.posX-1][this.posY+1] === 0 && grid[this.posX-1][this.posY+2] === 0 && grid[this.posX-1][this.posY+3] === 0) {
                this.posX--;
            }
        } else if ( this.type === 'o' ) {
            if (this.posX > 0 && grid[this.posX - 1][this.posY] === 0 && grid[this.posX-1][this.posY+1] === 0) {
                this.posX--;
            }
        }
    }

    public pushRight() {
        if (this.type === '-') {
            if ( this.posX < 3 && grid[this.posX+4][this.posY] === 0 ) {
                this.posX++;
            }
        }
        else if (this.type === '+') {
            if ( this.posX < 5 && grid[this.posX + 2][this.posY] === 0 && grid[this.posX + 1][this.posY-1] === 0 && grid[this.posX + 1][this.posY+1] === 0) {
                this.posX++;
            }
        }
        else if ( this.type === 'L' ) {
            if ( this.posX < 6 && grid[this.posX + 1][this.posY] === 0 && grid[this.posX+1][this.posY+1] === 0 && grid[this.posX+1][this.posY+2] === 0) {
                this.posX++;
            }
        } else if ( this.type === 'I' ) {
            if (this.posX < 6 && grid[this.posX + 1][this.posY] === 0 && grid[this.posX+1][this.posY+1] === 0 && grid[this.posX+1][this.posY+2] === 0 && grid[this.posX+1][this.posY+3] === 0) {
                this.posX++;
            }
        } else if ( this.type === 'o' ) {
            if (this.posX < 5 && grid[this.posX + 2][this.posY] === 0 && grid[this.posX+2][this.posY+1] === 0) {
                this.posX++;
            }
        }
    }

    public pushDown() : boolean {
        if (this.type === '-') {
            if ( this.posY > 0 && grid[this.posX][this.posY-1] === 0 && grid[this.posX+1][this.posY-1] === 0 && grid[this.posX+2][this.posY-1] === 0 && grid[this.posX+3][this.posY-1] ===0 ) {
                this.posY--;
                return true;
            } else {
                grid[this.posX][this.posY] = 1;
                grid[this.posX+1][this.posY] = 1;
                grid[this.posX+2][this.posY] = 1;
                grid[this.posX+3][this.posY] = 1;
                return false;
            }
        }
        else if (this.type === '+') {
            if (this.posY > 1 && grid[this.posX][this.posY-2] === 0 && grid[this.posX - 1][this.posY - 1] === 0 && grid[this.posX+1][this.posY-1] === 0) {
                this.posY--;
                return true;
            } else {
                grid[this.posX][this.posY] = 1;
                grid[this.posX][this.posY-1] = 1;
                grid[this.posX][this.posY+1] = 1;
                grid[this.posX-1][this.posY] = 1;
                grid[this.posX+1][this.posY] = 1;
            }
        }
        else if ( this.type === 'L' ) {
            if ( this.posY > 0 && grid[this.posX][this.posY-1] === 0 && grid[this.posX-1][this.posY-1] === 0 && grid[this.posX-2][this.posY-1] === 0) {
                this.posY--;
                return true;
            } else {
                grid[this.posX][this.posY] = 1;
                grid[this.posX][this.posY+1] = 1;
                grid[this.posX][this.posY+2] = 1;
                grid[this.posX-1][this.posY] = 1;
                grid[this.posX-2][this.posY] = 1;
                return false;
            }
        } else if ( this.type === 'I' ) {
            if ( this.posY > 0 && grid[this.posX][this.posY - 1] === 0 ) {
                this.posY--;
                return true;
            } else {
                grid[this.posX][this.posY] = 1;
                grid[this.posX][this.posY+1] = 1;
                grid[this.posX][this.posY+2] = 1;
                grid[this.posX][this.posY+3] = 1;
                return false;
            }
           
        } else if ( this.type === 'o' ) {
            if ( this.posY > 0 && grid[this.posX][this.posY - 1] === 0 && grid[this.posX + 1] [this.posY - 1] === 0) {
                this.posY--;
                return true;
            } else {
                grid[this.posX][this.posY] = 1;
                grid[this.posX+1][this.posY] = 1;
                grid[this.posX+1][this.posY+1] = 1;
                grid[this.posX][this.posY+1] = 1;
            }
        }
    }
}

reader.on("line", (l: string) => {
    commands = [...l];
});

reader.on('close', () => {
    for ( let x = 0; x < 7; x++ ) {
        grid.push([]);
        for ( let y = 0; y < 2022*5; y++ ) {
            grid[x].push(0);
        }
    }
    for ( let x = 0; x < 7; x++) {
        grid[x][0] = 1;
    }

    const types = ['-', '+', 'L', 'I', 'o'];

    let commandIndex = 0;
    let memoIt = new Map<string, number>();
    let memoHeight = new Map<string, number>();
    let cycleStart = -1;
    let cycleLength = -1;
    let heightCycle = -1;
    let heights = [0];
    for ( let i = 1; i <= 2022; i++ ) {
        const rock = new Polyomino( types[(i-1) % 5] );
        while ( true ) {
            let command = commands[commandIndex % commands.length];
            commandIndex++;
            if ( command === '>') {
                rock.pushRight();
            } else if ( command === '<' ) {
                rock.pushLeft();
            }
            if ( !rock.pushDown() ) {
                break;
            }
        }
        var highest = getHighest();
        heights.push( highest );
        var key = '';
        for ( let k = 0; k < 10; k++) {
            key +=  getLine(highest - k);
        }
        key += rock.type;
        key += commandIndex % commands.length;
        
        if ( memoIt.has(key) ) {
            cycleStart = memoIt.get(key);
            cycleLength = i - memoIt.get(key);
            heightCycle = highest - memoHeight.get(key);
            break;
        } else {
            memoIt.set(key, i);
            memoHeight.set(key, highest);
        }
    }

    let heightpart1 = heights[cycleStart];
    let numCycles1 = Math.floor((2022-cycleStart) / cycleLength);
    heightpart1 += numCycles1 * heightCycle;
    let leftoverpart1 = 2022 - cycleStart - cycleLength * numCycles1;
    heightpart1 += heights[(cycleStart + leftoverpart1)] - heights[cycleStart];

    console.log( heightpart1 );

    let height: bigint = BigInt(heights[cycleStart]);
    let numCycles = BigInt(1000000000000-cycleStart) / BigInt(cycleLength);
    height += numCycles * BigInt(heightCycle);

    let leftOverOps =  Number(BigInt(1000000000000) - BigInt( cycleStart ) - BigInt(cycleLength) * numCycles);
    height += BigInt(heights[ (cycleStart + leftOverOps) ] - heights[cycleStart]);

    console.log(height);
});