import * as fs from 'fs';
import { stringify } from 'querystring';
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

    for ( let i = 0; i < 2022; i++ ) {
        const rock = new Polyomino( types[i % 5] );
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
    }

    console.log( getHighest());
});