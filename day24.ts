import * as fs from 'fs';
import * as rd from 'readline'

var Heap = require('heap');

class Config {
    public line : number;
    public col : number;
    public time : number;
    public endLine : number;
    public endCol : number;
    public parent : Config;

    constructor( line : number, col : number, time : number, endLine: number, endCol :number) {
        this.line = line;
        this.col = col;
        this.time = time;
        this.endLine = endLine;
        this.endCol = endCol;
    }

    public est() :number{
        return this.time + (this.endLine - this.line) + (this.endCol - this.col);
    }

    public toString() :string{
        return "Time: " + this.time + " line: " + this.line + " col: " + this.col;
    }

    public isArrived() : boolean {
        return this.line === this.endLine && this.col === this.endCol;
    }
}


var reader = rd.createInterface(fs.createReadStream("/home/isa/projets/adventofcode/AoC2022/data/day24.txt"))

let grid = [];
let visited = new Set();

reader.on("line", (l: string) => {
    grid.push([...l].slice(1, l.length - 1));
});

reader.on('close', () => {
    grid = grid.slice(1, grid.length - 1);
    const endLine = grid.length;
    const endCol = grid[0].length - 1;
    let pos = new Config( -1, 0, 0, endLine, endCol);

    var heap = new Heap(function(a : Config, b : Config) {
        return a.est() - b.est();
    });
    heap.push( pos );

    let numPaths = 0;

    while ( !heap.empty() ) {
        let elem = heap.pop();
        if ( elem.isArrived() ) {
            console.log( elem.time );
            numPaths++;
            if ( numPaths === 3 ) {
                return;
            }
            heap = new Heap(function(a : Config, b : Config) {
                return a.est() - b.est();
            });
            if ( numPaths === 1 ) {
                elem.endLine = -1;
                elem.endCol = 0;
            } else {
                elem.endLine = endLine;
                elem.endCol = endCol;
            }
            heap.push(elem);
        }
        if ( visited.has(elem.toString() ) ) {
            continue;
        }

        if ( isValid(elem.line, elem.col, elem.time + 1, elem.endLine, elem.endCol)) {
            const pause = new Config( elem.line, elem.col, elem.time + 1, elem.endLine, elem.endCol );
            pause.parent = elem;
            heap.push(pause);
        }
        if ( isValid( elem.line + 1, elem.col, elem.time+1, elem.endLine, elem.endCol ) ) {
            const south = new Config( elem.line + 1, elem.col, elem.time + 1, elem.endLine, elem.endCol );
            heap.push( south );
            south.parent = elem;            
        }
        if ( isValid( elem.line, elem.col + 1, elem.time+1, elem.endLine, elem.endCol ) ) {
            const east = new Config( elem.line, elem.col + 1, elem.time + 1, elem.endLine, elem.endCol );
            heap.push( east );
            east.parent = elem;
        }
        if ( isValid( elem.line - 1, elem.col, elem.time+1, elem.endLine, elem.endCol ) ) {
            const north = new Config( elem.line - 1, elem.col, elem.time + 1, elem.endLine, elem.endCol );
            heap.push( north );
            north.parent = elem;
        }
        if ( isValid( elem.line, elem.col - 1, elem.time+1, elem.endLine, elem.endCol ) ) {
            const west = new Config( elem.line, elem.col - 1, elem.time + 1, elem.endLine, elem.endCol );
            heap.push( west );
            west.parent = elem;
        }
    
        visited.add(elem.toString());
    }
});

function isValid( line, col, time, endLine, endCol ) : boolean {
    if (( line === grid.length && col === grid[0].length - 1 ) || ( line === -1 && col === 0)) {
        return true;
    }
    if ( line < 0 || col < 0 || line >= grid.length || col >= grid[0].length ) {
        return false;
    }

    if ( grid[(line+time) % grid.length][col] === '^') {
        return false;
    }
    let newLine = (line - time) % grid.length;
    if (newLine < 0) {
        newLine += grid.length;
    }
    if ( grid[newLine][col] === 'v') {
        return false;
    }
    if ( grid[line][(col + time) % grid[0].length] === '<') {
        return false;
    }
    let newCol = (col - time) % grid[0].length;
    if (newCol < 0) {
        newCol += grid[0].length;
    }
    if ( grid[line][newCol] === '>') {
        return false;
    }

    return true;
}