import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("/home/isa/projets/adventofcode/AoC2022/data/day23.txt"))

let tmpGrid = [];
let grid = [];

let numElves = 0;

reader.on("line", (l: string) => {
    tmpGrid.push([...l]);
});

const moves = [ moveNorth, moveSouth, moveWest, moveEast ];
const shouldMove = [ shouldMoveNorth, shouldMoveSouth, shouldMoveWest, shouldMoveEast ];

reader.on('close', () => {
    for ( let i = 0; i < 50; i++ ) {
        grid.push( [] );
        for ( let j = 0; j < tmpGrid[0].length + 100; j++) {
            grid[i].push('.');
        }
    }
    for (let i = 0; i < tmpGrid.length ; i++ ) {
        grid.push( [] );
        for ( let j = 0; j < 50; j++) {
            grid[i+50].push('.');
        }
        for ( let j = 0; j < tmpGrid[i].length; j++) {
            grid[i+50].push(tmpGrid[i][j]);
            if ( tmpGrid[i][j] === '#') {
                numElves++;
            }
        }
        for ( let j = 0; j < 50; j++) {
            grid[i+50].push('.');
        }
    }
    for ( let i = 0; i < 50; i++ ) {
        grid.push( [] );
        for ( let j = 0; j < tmpGrid[0].length + 100; j++) {
            grid[i+50+tmpGrid.length].push('.');
        }
    }

    let i = 0;
    while (true) {
        i++;
        tmpGrid = [];
        for ( let line = 0; line < grid.length; line++ ) {
            tmpGrid.push([]);
            for ( let col = 0; col < grid[line].length; col++ ) {
                tmpGrid[line].push('.');
            }
        }
        let movedAnElf = false;
        for ( let line = 0; line < grid.length; line++ ) {
            for ( let col = 0; col < grid[line].length; col++ ) {
                if ( grid[line][col] === '#' ) {
                    if ( shouldMoveEast(line, col) && shouldMoveNorth(line, col) && shouldMoveSouth(line, col) && shouldMoveWest(line, col)) {
                        tmpGrid[line][col] = '#';
                        continue;
                    }
                    let hasMoved = false;
                    for ( let j = 0; j < 4; j++ ) {
                        hasMoved = moves[j]( line, col, i );
                        if (hasMoved) {
                            movedAnElf = true;
                            break;
                        }
                    }
                    if (!hasMoved) {
                        tmpGrid[line][col] = '#';
                    }
                }
            }
        }

        grid = [];
        let localElves = 0;
        for ( let line = 0; line < tmpGrid.length; line++ ) {
            grid.push([]);
            for ( let col = 0; col < tmpGrid[line].length; col++ ) {
                grid[line].push( tmpGrid[line][col] === '#' ? '#' : '.');
                if ( tmpGrid[line][col] === '#' ) {
                    localElves++;
                }
            }
        }
        if (localElves !== numElves ) {
            console.log( i + ' ' + 'lost elves' + localElves + ' ' + numElves);
        }
        let pop = moves.shift();
        moves.push(pop);
        let shouldPop = shouldMove.shift();
        shouldMove.push(shouldPop);
        if ( i === 10 ) {
            countEmptySpaces();
        }
        if ( !movedAnElf ) {
            console.log( i );
            break;
        }
    }

function countEmptySpaces() {

    let maxLine = 0, maxCol = 0, minLine = grid.length, minCol = grid[0].length;
    for ( let line = 0; line < grid.length; line++ ) {
        for ( let col = 0; col < grid[line].length; col++ ) {
            if ( grid[line][col] === '#' ) {
                if ( line < minLine ) {
                    minLine = line;
                }
                if (line > maxLine) {
                    maxLine = line;
                }
                if ( col < minCol) {
                    minCol = col;
                }
                if ( col > maxCol ) {
                    maxCol = col;
                }
            }
        }
    }

    let sum = 0;

    for ( let line = minLine; line <= maxLine; line++ ) {
        console.log( grid[line].join(''));
        for ( let col = minCol; col <= maxCol; col++ ) {
            if ( grid[line][col] === undefined || grid[line][col] === '.' ) {
                sum++;
            }
        }
    }

    console.log(sum);
}
});

function shouldMoveNorth( line, col ) {
    return grid[line-1][col] === '.' && grid[line-1][col-1] === '.' && grid[line-1][col+1] === '.';
}


function shouldMoveSouth( line, col ) {
    return grid[line+1][col] === '.' && grid[line+1][col-1] === '.' && grid[line+1][col+1] === '.';
}


function shouldMoveEast( line, col ) {
    return grid[line][col+1] === '.' && grid[line-1][col+1] === '.' && grid[line+1][col+1] === '.';
}


function shouldMoveWest( line, col ) {
    return grid[line][col-1] === '.' && grid[line-1][col-1] === '.' && grid[line+1][col-1] === '.';
}

function fixTmpGrid( line, col, i ) {
    if ( grid[line-1][col] === '#' ) {
        let movedBefore = false;
        let j = 0;
        while ( shouldMove[j] !== shouldMoveSouth ) {
            movedBefore = shouldMove[j]( line-1, col );
            if (movedBefore) {
                break;
            }
            j++;
        }
        if ( !movedBefore && shouldMoveSouth(line-1, col) ) {
            tmpGrid[line-1][col] = '#';
        }
    }

    if ( grid[line][col+1] === '#' ) {
        let movedBefore = false;
        let j = 0;
        while ( shouldMove[j] !== shouldMoveWest ) {
            movedBefore = shouldMove[j]( line, col+1 );
            if (movedBefore) {
                break;
            }
            j++;
        }
        if ( !movedBefore && shouldMoveWest(line, col+1) ) {
            tmpGrid[line][col+1] = '#';
        }
    }

    if ( grid[line][col-1] === '#' ) {
        let movedBefore = false
        let j = 0;
        while ( shouldMove[j] !== shouldMoveEast ) {
            movedBefore = shouldMove[j]( line, col-1 );
            if (movedBefore) {
                break;
            }
            j++;
        }
        if ( !movedBefore && shouldMoveEast(line, col-1) ) {
            tmpGrid[line][col-1] = '#';
        }
    }

    tmpGrid[line][col] = 'X';
}

function moveNorth(line, col, i) {
    if ( shouldMoveNorth(line, col) ) {
        if ( tmpGrid[line-1][col] === '.' ) {
            tmpGrid[line-1][col] = '#';
            tmpGrid[line][col] = '.';
        } else if ( tmpGrid[line-1][col] === '#' ) {
            fixTmpGrid(line-1, col, i);
            tmpGrid[line][col] = '#';
        } else if (tmpGrid[line-1][col] === 'X' ) {
            tmpGrid[line][col] = '#';
        } else {
            throw ( "can't happen");
        }
        return true;
    }
    return false;
}

function moveSouth(line, col, i) {
    if ( shouldMoveSouth(line, col) ) {
        // moving south is always valid considering the order of scan
        tmpGrid[line+1][col] = '#';
        tmpGrid[line][col] = '.';
        return true;
    }
    return false;
}

function moveWest(line, col, i) {
    if ( shouldMoveWest(line, col) ) {
        if ( tmpGrid[line][col-1] === '.' ) {
            tmpGrid[line][col-1] = '#';
            tmpGrid[line][col] = '.';
        } else if ( tmpGrid[line][col-1] === '#' ) {
            fixTmpGrid(line, col-1, i);
            tmpGrid[line][col] = '#';
        } else if (tmpGrid[line][col-1] === 'X' ) {
            tmpGrid[line][col] = '#';
        }else {
            throw ( "can't happen");
        }
        return true;
    }
    return false;
}

function moveEast(line, col, i) {
    if ( shouldMoveEast(line, col) ) {
        if ( tmpGrid[line][col+1] === '.' ) {
            tmpGrid[line][col+1] = '#';
            tmpGrid[line][col] = '.';
        } else if ( tmpGrid[line][col+1] === '#' ) {
            fixTmpGrid(line, col+1, i);
            tmpGrid[line][col] = '#';
        } else if (tmpGrid[line][col+1] === 'X' ) {
            tmpGrid[line][col] = '#';
        }else {
            throw ( "can't happen");
        }
        return true;
    }
    return false;
}