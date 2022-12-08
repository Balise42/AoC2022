import * as fs from 'fs';
import * as rd from 'readline'

const reader : rd.Interface = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day08.txt"))

let treeGrid = [];

reader.on("line", (l: string) => {
    let treeLine = [];
    for ( let i = 0; i < l.length; i++ ) {
        treeLine.push( parseInt(l.charAt(i) ) );
    }
    treeGrid.push(treeLine);
});

reader.on('close', () => {
    const nLines = treeGrid.length;
    const nCols = treeGrid[0].length;

    let visibleTop = new Array( nLines );
    let visibleBottom = new Array( nLines );
    let visibleLeft = new Array( nLines );
    let visibleRight = new Array( nLines );

    for ( let i = 0; i < nLines; i++ ) {
        visibleTop[i] = new Array( nCols );
        visibleBottom[i] = new Array( nCols );
        visibleLeft[i] = new Array( nCols );
        visibleRight[i] = new Array( nCols );
    }

    for ( let i = 0; i < nLines; i++ ) {
        visibleLeft[i][0] = treeGrid[i][0];
        visibleRight[i][nCols-1] = treeGrid[i][nCols-1];
        for ( let j = 1; j < nCols; j++ ) {
            visibleLeft[i][j] = Math.max( visibleLeft[i][j-1], treeGrid[i][j]);
        }
        for (let j = nCols - 2; j >= 0; j-- ) {
            visibleRight[i][j] = Math.max( visibleRight[i][j+1], treeGrid[i][j]);
        }
    }
    
    for ( let j = 0; j < nCols; j++ ) {
        visibleTop[0][j] = treeGrid[0][j];
        visibleBottom[nCols - 1][j] = treeGrid[nCols - 1][j];
        for ( let i = 1; i < nLines; i++ ) {
            visibleTop[i][j] = Math.max(visibleTop[i-1][j], treeGrid[i][j]);
        }
        for (let i = nLines - 2; i >= 0; i-- ) {
            visibleBottom[i][j] = Math.max(visibleBottom[i+1][j], treeGrid[i][j]);
        }
    }

    let sumVisible = 0;
    let maxScore = 0;
    for ( let i = 0; i < nLines; i++ ) {
        for ( let j = 0; j < nCols; j++ ) {
            if ( i === 0 || i === nLines - 1 || j === 0 || j === nCols - 1 ) {
                sumVisible++;
                // score cannot be greater than 0 since it's multiplying
                continue;
            } else {
                if ( treeGrid[i][j] > visibleTop[i-1][j] || treeGrid[i][j] > visibleBottom[i+1][j]
                    || treeGrid[i][j] > visibleLeft[i][j-1] || treeGrid[i][j] > visibleRight[i][j+1] ) {
                        sumVisible++;
                    }
            }
            let scoreTop = 0;
            if ( i > 0 && treeGrid[i][j] > visibleTop[i-1][j] ) {
                scoreTop = i;
            } else {
                for ( let k = i-1; k >= 0; k-- ) {
                    scoreTop++;
                    if ( treeGrid[k][j] >= treeGrid[i][j]) {
                        break;
                    }
                }
            }
            let scoreBottom = 0;
            if ( i < nLines - 1 && treeGrid[i][j] > visibleBottom[i+1][j] ) {
                scoreBottom = nLines - 1 - i;
            } else {
                for ( let k = i+1; k < nLines; k++ ) {
                    scoreBottom++;
                    if ( treeGrid[k][j] >= treeGrid[i][j]) {
                        break;
                    }
                }
            }
            let scoreLeft = 0;
            if ( j > 0 && treeGrid[i][j] > visibleLeft[i][j-1] ) {
                scoreLeft = j;
            } else {
                for ( let k = j-1; k >= 0; k-- ) {
                    scoreLeft++;
                    if ( treeGrid[i][k] >= treeGrid[i][j]) {
                        break;
                    }
                }
            }
            let scoreRight = 0;
            if ( j < nCols - 1 && treeGrid[i][j] > visibleRight[i][j+1] ) {
                scoreRight = nCols - 1 - j;
            } else {
                for ( let k = j+1; k < nCols; k++ ) {
                    scoreRight++;
                    if ( treeGrid[i][k] >= treeGrid[i][j]) {
                        break;
                    }
                }
            }
            const score = scoreLeft * scoreRight * scoreTop * scoreBottom;
            if ( score > maxScore ) {
                maxScore = score;
            }
        }
    }
    console.log( sumVisible );
    console.log( maxScore );
});