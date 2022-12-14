import * as fs from 'fs';
import * as rd from 'readline'

const reader : rd.Interface = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day14.txt"))

let grid = [];
const lineRegex = /((\d+),(\d+))(?: -> |$)/g
let maxLine = 0;


reader.on("line", (l: string) => {
    if ( grid.length === 0 ) {
        for ( let i = 0; i < 1000; i++) {
            let line = [];
            for ( let j = 0; j < 200; j++ ) {
                line.push('.');
            }
            grid.push(line);
        }
    }
    const matches = l.matchAll( lineRegex );
    let colPrev = -1;
    let linePrev = -1
    let col = -1;
    let line = -1;
    for ( const match of matches ) {
        colPrev = col;
        linePrev = line;
        col = parseInt(match[2]);
        line = parseInt(match[3]);
        if ( line > maxLine ) {
            maxLine = line;
        }
        if ( colPrev !== -1 ) {
            if (colPrev === col ) {
                if ( linePrev <= line ) {
                   for ( let i = linePrev; i <= line; i++ ) {
                        grid[col][i] = '#';
                    }
                } else {
                    for ( let i = line; i <= linePrev; i++ ) {
                        grid[col][i] = '#';
                    }
                }
            } else {
                if ( colPrev <= col ) {
                    for ( let i = colPrev; i <= col; i++ ) {
                        grid[i][line] = '#'
                    }
                } else {
                    for ( let i = col; i <= colPrev; i++ ) {
                        grid[i][line] = '#'
                    }
                }
            }
        }
    }
});

reader.on('close', () => {
    let sand = 0;
    let part1 = false;
    while (true) {
        sand++;
        let done = false;
        let line = 0;
        let col = 500;
        while ( true ) {
            if ( line > maxLine && part1 === false) {
                console.log( sand - 1);
                part1 = true;
            }
            if ( grid[col][line+1] === '.' && (line + 1) < maxLine + 2 ) {
                line++;
            } else if ( grid[col-1][line+1] === '.' && (line + 1) < maxLine + 2 ) {
                line++;
                col--;
            } else if ( grid[col+1][line + 1] === '.' && (line + 1) < maxLine + 2 ) {
                line++;
                col++;
            } else {
                grid[col][line] = 'o';
                break;
            }
        }
        if ( line == 0 && col == 500 ) {
            console.log (sand ); 
            break;
        }
    }
});