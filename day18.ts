import { assert } from 'console';
import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day18.txt"))

let grid = [];
let points = [];
const regex = /(\d+),(\d+),(\d+)/;

var minX, minY, maxX, maxY, minZ, maxZ: number;

reader.on("line", (l: string) => {
    const groups = l.match(regex);
    const point = [parseInt(groups[1]), parseInt(groups[2]), parseInt(groups[3])];
    points.push(point);
    if ( minX === undefined || minX > point[0]) {
        minX = point[0];
    }
    if ( maxX === undefined || maxX < point[0]) {
        maxX = point[0];
    }
    if ( minY === undefined || minY > point[1]) {
        minY = point[1];
    }
    if ( maxY === undefined || maxY < point[1]) {
        maxY = point[1];
    }
    if ( minZ === undefined || minZ > point[2]) {
        minZ = point[2];
    }
    if ( maxZ === undefined || maxZ < point[2]) {
        maxZ = point[2];
    }
});

reader.on('close', () => {

    for ( let x = 0; x <= maxX + 1; x++) {
        grid.push([]);
        for ( let y = 0; y <= maxY + 1; y++) {
            grid[x].push([]);
            for (let z = 0; z <= maxZ + 1; z++) {
                grid[x][y].push(0);
            }
        }
    }

    for ( const point of points ) {
        grid[point[0]][point[1]][point[2]] = 1;
    }

    let faces = 0;
    let facesPartB = 0;
    for ( const point of points ) {
        let x = point[0];
        let y = point[1];
        let z = point[2];
        
        if ( z === 0 || grid[x][y][z-1] === 0 ) {
            faces++;
        }
        if ( grid[x][y][z+1] === 0 ) {
            faces++;
        }
        if ( y === 0 || grid[x][y-1][z] === 0 ) {
            faces++;
        }
        if ( grid[x][y+1][z] === 0 ) {
            faces++;
        }
        if ( x === 0 || grid[x-1][y][z] === 0 ) {
            faces++;
        }
        if ( grid[x+1][y][z] === 0 ) {
            faces++;
        }
    }

    for ( let x = 0; x <= maxX + 1; x++ ) {
        for ( let y = 0; y <= maxY + 1; y++ ) {
            if ( grid[x][y][0] === 0) {
                grid[x][y][0] = 2;
            }
            if ( grid[x][y][maxZ+1] === 0) {
                grid[x][y][maxZ+1] = 2;
            }
        }
        for ( let z = 0; z <= maxZ + 1; z++ ) {
            if ( grid[x][0][z] === 0) {
                grid[x][0][z] = 2;
            }
            if ( grid[x][maxY+1][z] === 0) {
                grid[x][maxY+1][z] = 2;
            }
        }
    }
    for ( let y = 0; y <= maxY; y++) {
        for (let z = 0; z <= maxZ; z++) {
            if (grid[0][y][z] === 0) {
                grid[0][y][z] = 2
            }
            if (grid[maxX+1][y][z] === 0) {
                grid[maxX+1][y][z] = 2
            }
        }
    }
    
    var stable = true;

    do {
        stable = true;
        for ( let x = 1; x <= maxX; x++ ) {
            for ( let y = 1; y <= maxY; y++) {
                for (let z = 1; z <= maxZ; z++) {
                    if ( grid[x][y][z] !== 0 ) {
                        continue;
                    } else if ( grid[x][y][z] === 0) {
                        if ( grid[x-1][y][z] === 2 || grid[x+1][y][z] === 2 || grid[x][y-1][z] === 2 || grid[x][y+1][z] === 2 || grid[x][y][z-1] === 2 || grid[x][y][z+1] === 2) {
                            grid[x][y][z] = 2;
                            stable = false;
                        }
                    }
                }
            }
        }
    } while (!stable);

    for ( const point of points ) {
        let x = point[0];
        let y = point[1];
        let z = point[2];
        
        if ( z === 0 || grid[x][y][z-1] === 2 ) {
            facesPartB++;
        }
        if ( grid[x][y][z+1] === 2 ) {
            facesPartB++;
        }
        if ( y === 0 || grid[x][y-1][z] === 2 ) {
            facesPartB++;
        }
        if ( grid[x][y+1][z] === 2 ) {
            facesPartB++;
        }
        if ( x === 0 || grid[x-1][y][z] === 2 ) {
            facesPartB++;
        }
        if ( grid[x+1][y][z] === 2 ) {
            facesPartB++;
        }
    }

    console.log(faces);
    console.log(facesPartB);
});