import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("/home/isa/projets/adventofcode/AoC2022/data/day22.txt"))

const grid = [];
var instructions = [];

reader.on("line", (l: string) => {
    if ( l.trim() === '' ) {
        return;
    }
    if ( l.startsWith(' ') || l.startsWith( '.') || l.startsWith('#') ) {
        grid.push([...l]);
    } else {
        instructions = [...l];
    }
});

enum Dir { RIGHT = 0, DOWN, LEFT, UP };

reader.on('close', () => {
   
    let line = 0;
    let col = 0;
    let dir = Dir.RIGHT;

    let lineCube = 0;
    let colCube = 0;
    let dirCube = Dir.RIGHT;

    while( grid[line][col] !== '.' ) {
        col++;
        colCube++;
    }

    // let's do this!

    let advance = 0;
    for ( const char of instructions ) {
        if ( char === 'L' ) {
            [line, col] = move( line, col, dir, advance );
            if ( grid.length > 50 ) {
                [lineCube, colCube, dirCube] = moveCube( lineCube, colCube, dirCube, advance )
            } else {
                [lineCube, colCube, dirCube] = moveSmolCube( lineCube, colCube, dirCube, advance );
            }
            dir = (dir + 3 ) % 4;
            dirCube = ( dirCube + 3 ) % 4;
            advance = 0;
        } else if ( char === 'R') {
            [line, col] = move( line, col, dir, advance );
            if ( grid.length > 50 ) {
                [lineCube, colCube, dirCube] = moveCube( lineCube, colCube, dirCube, advance )
            } else {
                [lineCube, colCube, dirCube] = moveSmolCube( lineCube, colCube, dirCube, advance );
            }
            dir = (dir + 1 ) % 4;
            dirCube = (dirCube + 1) % 4;
            advance = 0;
        } else {
            advance = 10*advance + parseInt(char);
        }
    }
    if ( advance !== 0 ) {
        [line, col] = move( line, col, dir, advance );
        if ( grid.length > 50 ) {
            [lineCube, colCube, dirCube] = moveCube( lineCube, colCube, dirCube, advance )
        } else {
            [lineCube, colCube, dirCube] = moveSmolCube( lineCube, colCube, dirCube, advance );
        }
    }

    console.log( 1000 * (line + 1) + 4 * (col + 1) + dir);

    // too high 131064
    // too low 2417
    console.log( 1000 * (lineCube + 1) + 4 * (colCube + 1) + dirCube);
});

function move( line : number, col : number, dir : Dir, advance : number ) : [number, number] {
    if ( advance === 0 ) {
        return [ line, col ];
    }
    if ( dir === Dir.UP ) {
        let newLine = line - 1;
        if ( newLine < 0 || col > grid[newLine].length - 1 || grid[newLine][col] === ' ' ) {
            newLine++;
            while ( newLine < grid.length && col < grid[newLine].length && (grid[newLine][col] === '.' || grid[newLine][col] === '#') ) {
                newLine++;
            }
            newLine--;
        }
        if ( grid[newLine][col] === '.' ) {
            return move( newLine, col, dir, advance - 1 );
        }
    }

    if ( dir === Dir.DOWN ) {
        let newLine = line + 1;
        if ( newLine >= grid.length || col > grid[newLine].length - 1 || grid[newLine][col] === ' ' ) {
            newLine--;
            while ( newLine >= 0 && col < grid[newLine].length && (grid[newLine][col] === '.' || grid[newLine][col] === '#') ) {
                newLine--;
            }
            newLine++;
        }
        if ( grid[newLine][col] === '.' ) {
            return move( newLine, col, dir, advance - 1 );
        }
    }

    if ( dir === Dir.RIGHT ) {
        let newCol = col + 1;
        if ( newCol >= grid[line].length || grid[line][newCol] === ' ' ) {
            newCol--;
            while ( newCol >= 0 && (grid[line][newCol] === '.' || grid[line][newCol] === '#') ) {
                newCol--;
            }
            newCol++;
        }
        if ( grid[line][newCol] === '.' ) {
            return move( line, newCol, dir, advance - 1 );
        }
    }

    if ( dir === Dir.LEFT ) {
        let newCol = col - 1;
        if ( newCol < 0 || grid[line][newCol] === ' ' ) {
            newCol++;
            while ( newCol < grid[line].length && (grid[line][newCol] === '.' || grid[line][newCol] === '#') ) {
                newCol++;
            }
            newCol--;
        }
        if ( grid[line][newCol] === '.' ) {
            return move( line, newCol, dir, advance - 1 );
        }
    }

    return [ line, col ];
}

function moveCube( line : number, col : number, dir : Dir, advance : number ) : [number, number, Dir] {
    // This is going to be very specific to my input, which has the following shape:
    //  12
    //  3
    // 56
    // 4
    // where the numbering is such that the sum of two opposite sides are 7 (like a die)

    if ( advance === 0 ) {
        return [ line, col, dir ];
    }
    if ( dir === Dir.UP ) {
        let newLine :number = line - 1;
        let newCol :number = col;
        let newDir :Dir = dir;
        if ( newLine < 0 ) {
            if ( col >= 100 ) {
                // we're leaving 2 from the top, entering 4 from the bottom
                [ newLine, newCol ] = getCoordsForFace( 4, 49, col % 50);
                newDir = Dir.UP;
            } else {
                // we're leaving 1 from the top, entering 4 from the left
                [ newLine, newCol ] = getCoordsForFace( 4, col % 50, 0);
                newDir = Dir.RIGHT;
            }  
        } else if ( grid[newLine][newCol] === ' ') {
            // we're leaving 5 from the top, so we're re-entering 3 from the left
            [ newLine, newCol ] = getCoordsForFace( 3, col % 50, 0); 
            newDir = Dir.RIGHT;
        }
        console.log ( line + ' ' + col + ' ' + dir + ' ' + newLine + ' ' + newCol + " " + newDir );
        if ( grid[newLine][newCol] === ' ' || grid[newLine][newCol] === undefined ) {
            throw ('coin');
        }
        if ( grid[newLine][newCol] !== '#' ) {
            return moveCube( newLine, newCol, newDir, advance - 1 );
        }
    } else if ( dir === Dir.DOWN ) {
        let newLine = line + 1;
        let newCol = col;
        let newDir : Dir = dir;
        if ( newLine >= grid.length ) {
            // we leave 4 from the bottom and arriving on 2 from the top
            [ newLine, newCol ] = getCoordsForFace( 2, 0, col % 50);
            newDir = Dir.DOWN;
        } else if ( newCol > grid[newLine].length - 1 ) {
            if ( col >= 100 ) {
                // we're leaving 2 from the bottom, arriving at 3 from the right
                [ newLine, newCol ] = getCoordsForFace( 3, col % 50, 49 );
                newDir = Dir.LEFT;
            } else {
                // we're leaving 6 from the bottom and arriving at 4 from the right
                [ newLine, newCol ] = getCoordsForFace( 4, col%50, 49);
                newDir = Dir.LEFT;
            }
        }
        console.log ( line + ' ' + col + ' ' + dir + ' ' + newLine + ' ' + newCol + " " + newDir );
        if ( grid[newLine][newCol] !== '#' ) {
            if ( grid[newLine][newCol] === ' ' || grid[newLine][newCol] === undefined ) {
                throw ('coin');
            }
            return moveCube( newLine, newCol, newDir, advance - 1 );
        }
    } else if ( dir === Dir.RIGHT ) {
        let newLine = line;
        let newCol = col + 1;
        let newDir : Dir = dir;
        if ( newCol >= grid[newLine].length ) {
            if ( line < 50 ) {
                // we leave 2 from the right to 6 from the right ; reverse order
                [ newLine, newCol ] = getCoordsForFace( 6, 49 - line%50, 49 );
                newDir = Dir.LEFT;
            } else if ( line < 100 ) {
                // we leave 3 from the right to go to 2 from the bottom
                [ newLine, newCol ] = getCoordsForFace( 2, 49, line % 50 );
                newDir = Dir.UP;
            } else if ( line < 150 ) {
                // we leave 6 from the right to go to 2 from the right ; reverse order
                [ newLine, newCol ] = getCoordsForFace( 2, 49 - line%50, 49 );
                newDir = Dir.LEFT;
            } else {
                // we leave 4 from the right to go to 6 from the bottom
                [ newLine, newCol ] = getCoordsForFace( 6, 49, line%50 );
                newDir = Dir.UP;
            }
        }
        console.log ( line + ' ' + col + ' ' + dir + ' ' + newLine + ' ' + newCol + " " + newDir );
        if ( grid[newLine][newCol] !== '#' ) {
            if ( grid[newLine][newCol] === ' ' || grid[newLine][newCol] === undefined ) {
                throw ('coin');
            }
            return moveCube( newLine, newCol, newDir, advance - 1 );
        }
    } else if ( dir === Dir.LEFT ) {
        let newLine = line;
        let newCol = col - 1;
        let newDir : Dir = dir;
        if ( newCol < 0 ) {
            if ( line >= 150 ) {
                // leaving 4 from the left to go to 1 from the top
                [ newLine, newCol ] = getCoordsForFace( 1, 0, line%50 );
                newDir = Dir.DOWN;
            } else {
                // leaving 5 from the left to go to 1 from the left; reverse order
                [ newLine, newCol ] = getCoordsForFace( 1, 49 - line%50, 0 );
                newDir = Dir.RIGHT;
            }
        } else if ( grid[newLine][newCol] === ' ' ) {
            if ( line < 50 ) {
                // leaving 1 from the left to go to 5 from the left; reverse order
                [ newLine, newCol ] = getCoordsForFace( 5, 49 - line%50, 0 );
                newDir = Dir.RIGHT;
            } else {
                // leaving 3 from the left to go to 5 from the top
                [ newLine, newCol ] = getCoordsForFace( 5, 0, line%50 );
                newDir = Dir.DOWN;
            }
        }
        console.log ( line + ' ' + col + ' ' + dir + ' ' + newLine + ' ' + newCol + " " + newDir );
        if ( grid[newLine][newCol] !== '#' ) {
            if ( grid[newLine][newCol] === ' ' || grid[newLine][newCol] === undefined ) {
                throw ('coin');
            }
            return moveCube( newLine, newCol, newDir, advance - 1 );
        }
    }

    return [ line, col, dir ];
}

function moveSmolCube( line : number, col : number, dir : Dir, advance : number ) : [number, number, Dir] {
    //   1
    // 234
    //   56
    // smol cube from the example

    if ( advance === 0 ) {
        return [ line, col, dir ];
    }
    if ( dir === Dir.UP ) {
        let newLine :number = line - 1;
        let newCol : number = col;
        let newDir : Dir = dir;
        if ( newLine < 0 ) {
            // 1 from top to 2 top, reversed
            [newLine, newCol] = getCoordsForSmolFace( 2, 0, 3 - col%4 );
            newDir = Dir.DOWN;
        } else if ( newCol > grid[newLine].length ) {
            // 6 from top to 4 right, reversed
            [newLine, newCol] = getCoordsForSmolFace( 4, 3 - col%4, 3 );
            newDir = Dir.LEFT;
        } else if ( grid[newLine][newCol] === ' ') {
            if ( col >= 4) {
                // 3 top to 1 right
                [newLine, newCol] = getCoordsForSmolFace( 3, col%4, 3);
                newDir = Dir.LEFT;
            } else {
                // 2 top to 1 bottom, reversed
                [newLine, newCol] = getCoordsForSmolFace(1, 3, 3 - col%4);
                newDir = Dir.UP;
            }
            if ( grid[newLine][newCol] !== '#' ) {
                if ( grid[newLine][newCol] === ' ' || grid[newLine][newCol] === undefined ) {
                    throw ('coin');
                }
                return moveSmolCube( newLine, newCol, newDir, advance - 1 );
            }
        }
    } else if ( dir === Dir.DOWN ) {
        let newLine :number = line + 1;
        let newCol : number = col;
        let newDir : Dir = dir;
        if ( newLine > grid.length - 1 ) {
            if ( col >= 12 ) {
                // 6 bottom to 2 left, reversed
                [newLine, newCol] = getCoordsForSmolFace(2, 3 - col%4, 0);
                newDir = Dir.RIGHT;
            } else {
                // 5 bottom to 2 bottom, reversed
                [newLine, newCol] = getCoordsForSmolFace(2, 3, 3 - col%4);
                newDir = Dir.UP;
            }
        } else if ( grid[newLine][newCol] === ' ') {
            if ( col >= 4 ) {
                // 3 bottom to 5 left, reversed
                [newLine, newCol] = getCoordsForSmolFace( 5, 3 - col%4, 0);
                newDir = Dir.RIGHT;
            } else {
                // 2 bottom to 5 bottom, reversed
                [newLine, newCol] = getCoordsForSmolFace(5, 3, 3 - col%4);
                newDir = Dir.UP;
            }
        }
        if ( grid[newLine][newCol] !== '#' ) {
            if ( grid[newLine][newCol] === ' ' || grid[newLine][newCol] === undefined ) {
                throw ('coin');
            }
            return moveSmolCube( newLine, newCol, newDir, advance - 1 );
        }
    } else if ( dir === Dir.LEFT ) {
        let newLine :number = line;
        let newCol : number = col - 1;
        let newDir : Dir = dir;

        if ( newCol < 0 ) {
            // 2 left to 6 bottom, reversed
            [newLine, newCol] = getCoordsForSmolFace(2, 3, 3 - line%4);
            newDir = Dir.UP;
        } else if ( grid[newLine][newCol] === ' ') {
            if ( line < 4) {
                // 1 left to 3 top
                [newLine, newCol] = getCoordsForSmolFace(3, 0, line % 4);
                newDir = Dir.DOWN;
            } else {
                // 5 left to 3 bottom, reversed
                [newLine, newCol] = getCoordsForSmolFace(3, 3, 3 - line%4 );
                newDir = Dir.UP;
            }
        }
        if ( grid[newLine][newCol] !== '#' ) {
            if ( grid[newLine][newCol] === ' ' || grid[newLine][newCol] === undefined ) {
                throw ('coin');
            }
            return moveSmolCube( newLine, newCol, newDir, advance - 1 );
        }
    } else if ( dir === Dir.RIGHT ) {
        let newLine :number = line;
        let newCol : number = col + 1;
        let newDir : Dir = dir;
        if ( newCol > grid[newLine].length - 1) {
            if ( line < 4 ) {
                // 1 right to 6 right, reversed
                [newLine, newCol] = getCoordsForSmolFace( 6, 3 - line%4, 3);
                newDir = Dir.LEFT;
            } else if (line < 8 ) {
                // 4 right to 6 top, reversed
                [newLine, newCol] = getCoordsForSmolFace(6, 0, 3 - line%4);
                newDir = Dir.DOWN;
            } else {
                // 6 right to 1 right, reversed
                [newLine, newCol] = getCoordsForSmolFace( 1, 3 - line%4, 3);
                newDir = Dir.LEFT;
            }
        }
        if ( grid[newLine][newCol] !== '#' ) {
            if ( grid[newLine][newCol] === ' ' || grid[newLine][newCol] === undefined ) {
                throw ('coin');
            }
            return moveSmolCube( newLine, newCol, newDir, advance - 1 );
        }
    }


    return [line, col, dir];
}

function getCoordsForSmolFace(face, line, col ) {
    if ( line < 0 || line > 3 || col < 0 || col > 3 ) {
        throw('invalid input');
    }
    if ( face === 1) {
        //   1
        // 234
        //   56
        return [ line, col + 8];
    } else if ( face === 2) {
        return [line + 4, col];
    } else if ( face === 3) {
        return [line +4, col + 4];
    } else if (face === 4) {
        return [line + 4, col + 8];
    } else if (face === 5) {
        return [line + 8, col + 8];
    } else if ( face === 6) { 
        return [line + 8, col + 12];
    }
    throw ('in your face');
}

function getCoordsForFace( face, line, col ) {
    if ( line < 0 || line > 49 || col < 0 || col > 49 ) {
        throw('invalid input');
    }
    if (face === 1) {
        //  12
        //  3
        // 56
        // 4
        return ( [line, col+50]);
    } else if (face === 2) {
        return ( [line, col + 100]);
    } else if ( face === 3 ) {
        return ( [line + 50, col + 50]);
    } else if ( face === 4) {
        return ([line + 150, col]);
    } else if (face === 5) {
        return ([line + 100, col]);
    } else if ( face === 6) {
        return ([line + 100, col + 50]);
    } else {
        throw ('invalid face');
    }
}