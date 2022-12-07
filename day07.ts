import * as fs from 'fs';
import * as rd from 'readline'
import { EventEmitter } from 'stream';

var reader = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day07.txt"))
const dfEmitter = new EventEmitter();

class FilesystemItem {
    public parent : FilesystemItem;
    public children : Map<String, FilesystemItem> = new Map();
    public fileSize : number = 0;
    public name : String;

    public mkdir( name : String ) {
        var newDir = new FilesystemItem;
        newDir.name = name;
        newDir.parent = this;
        curdir.children.set( name, newDir);
    }

    public touch( name : String, size : number ) {
        var newFile = new FilesystemItem;
        newFile.name = name;
        newFile.parent = this;
        newFile.fileSize = size;
        curdir.children.set( name, newFile);
    }

    public cd( name: String ) : FilesystemItem{
        return curdir.children.get( name );
    }

    public df() : number {
        if ( this.fileSize !== 0 ) {
            return this.fileSize;
        }
        var sum = 0;
        for ( var child of this.children.values() ) {
            sum += child.df();
        }
        dfEmitter.emit( 'df', sum, this.name );
        return sum;
    }
}

let root : FilesystemItem = new FilesystemItem();
let curdir : FilesystemItem = root;

reader.on("line", (l: string) => {
    if ( l.startsWith ( '$' ) ) {
        if ( l.slice(2, 4) === 'cd' ) {
            if ( l[5] === '/' ) {
                curdir = root;
            } else if ( l.slice( 5, 7) === '..' ) {
                curdir = curdir.parent;
            } else {
                var subdir = l.slice(5);
                if ( !curdir.children.has( subdir ) ) {
                    curdir.mkdir( subdir );
                }
                curdir = curdir.cd( subdir );
            }
        }
    } else if ( l.startsWith ('ls') ) {
        return;
    } else if ( l.startsWith('dir') ) {
        curdir.mkdir( l.slice(4));
    } else {
        const toks = l.split(' ');
        curdir.touch( toks[1], parseInt(toks[0]));
    }
});

var sum = 0;
var sizes = [];

reader.on('close', () => {
    curdir = root;
    curdir.df();
    console.log(sum);
    sizes.sort( function(a, b){return a - b} );
    const toFree = 30000000 - (70000000 - sizes[sizes.length - 1]);
    for ( var val of sizes ) {
        if ( val >= toFree ) {
            console.log( val );
            break;
        }
    }
});

dfEmitter.on('df', (size : number, name: string) => {
    if ( size <= 100000 ) {
        sum += size;
    }
    sizes.push( size );
});