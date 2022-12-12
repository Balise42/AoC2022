import * as fs from 'fs';
import * as rd from 'readline'

const reader = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day12.txt"))
const grid : Array<Array<number>> = [];
let start : Array<number>;
let end : Array<number>;

reader.on("line", (l: string) => {
    const line = [];
    for ( let i = 0; i < l.length; i++ ) {
        const a = l.charAt(i);
        if (a === 'S' ) {
            start = [grid.length, i];
            line.push( 1 );
        } else if ( a === 'E' ) {
            end = [grid.length, i];
            line.push( 26 );
        } else {
            line.push( l.charCodeAt(i) - 96 );
        }
    }
    grid.push(line);
});


reader.on('close', () => {
    var minDist = 1000;

    for ( let a = 0; a < grid.length; a++ ){
        for (let b = 0; b < grid[a].length; b++ ) {
            if ( grid[a][b] !== 1 ) {
                continue;
            }
            const visited : Array<Array<number>> = [];
            for ( let i = 0; i < grid.length; i++ ) {
                const line = []
                for (let j = 0; j < grid[i].length; j++ ) {
                    line.push(-1);
                }
                visited.push(line);
            }
            
            const queue = [];
            visited[a][b] = 0;
            queue.push([a, b]);
            
            while (queue.length > 0) {
                const curr = queue.shift();
                const neighs = getNeighbors( curr );
                for ( let neigh of neighs ) {
                    const line = neigh[0];
                    const col = neigh[1];
                    if ( visited[line][col] !== -1 ) {
                        continue;
                    }
                    visited[line][col] = visited[curr[0]][curr[1]] + 1;
                    queue.push(neigh);
                }
            }
            if ( a === start[0] && b === start[1] ) {
                console.log( visited[end[0]][end[1]]);
            }
            if ( visited[end[0]][end[1]] < minDist && visited[end[0]][end[1]] !== -1) {
                minDist = visited[end[0]][end[1]];
            }
        }
    }
    console.log(minDist);
});

function getNeighbors( curr : Array<number> ):Array<Array<number>> {
    const neighs = [];
    const line:number = curr[0];
    const col = curr[1];
    if ( line > 0 && (grid[line-1][col] - grid[line][col]) <= 1 ) {
        neighs.push([line-1, col]);
    }
    if ( line < grid.length - 1 && (grid[line+1][col] - grid[line][col]) <= 1) {
        neighs.push([line+1, col]);
    }
    if (col > 0  && (grid[line][col-1] - grid[line][col]) <= 1 ) { 
        neighs.push([line, col-1]);
    }
    if (col < grid[line].length - 1 && (grid[line][col+1] - grid[line][col]) <= 1) {
        neighs.push([line, col + 1]);
    }
    return neighs;
}