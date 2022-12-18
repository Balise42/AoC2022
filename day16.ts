import * as fs from 'fs';
import * as rd from 'readline'

var Heap = require('heap');

var reader = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day16.txt"))

class ValveRoom {
    public neighbors = new Map<string, number>();
    public id : string;
    public flow: number;
}
const valveRegex = /Valve ([A-Z]{2}) has flow rate=(\d+); tunnel[s]? lead[s]? to valve[s]? ((?:[A-Z]{2}(?:, |$))+)/

let maxFlowPerTick = 0;
let graph = new Map<string, ValveRoom>();
let numValves = 0;

let cache = new Map<string, number>();

class RoomConfig {
    public posMe = 'AA';
    public posEle = 'AA';
    public open = new Map<string, number>();
    public timeSpentMe = 0;
    public timeSpentEle = 0;

    public totalFlowToTime() : number {
        let res = 0;
        for ( const valve of this.open ) {
            if ( valve[1] > Math.min(this.timeSpentMe, this.timeSpentEle) || valve[1] > 30) {
                continue;
            }
            res += (Math.min(this.timeSpentMe, this.timeSpentEle) - valve[1]) * graph.get(valve[0]).flow;
        }
        return res;
    }

    public maxObtainable() : number {
        const timeLeft = 30 - Math.min(this.timeSpentMe, this.timeSpentEle);
        return this.totalFlowToTime() + maxFlowPerTick * timeLeft;
    }

    public key() : string {
        return this.posMe + this.posEle + this.timeSpentMe + ' ' + this.timeSpentEle + new Array(...this.open.keys()).sort().join();
    }
}

const initrc = new RoomConfig();

reader.on("line", (l: string) => {
    const groups = l.match(valveRegex);
    const room = new ValveRoom();
    room.id = groups[1];
    room.flow = parseInt(groups[2]);
    maxFlowPerTick += room.flow;
    if ( room.flow > 0 ) {
        numValves++;
    }
    for ( const neigh of groups[3].split(', ') ) {
        room.neighbors.set(neigh, 1);
    }
    graph.set( room.id, room );
});

function simplifyGraph() {
    do {
        var stable = true;
        for ( var room of graph.values() ) {
            if ( room.flow === 0 && room.id !== 'AA' ) {
                var neighs = room.neighbors.keys()
                var neigh1 = neighs.next().value;
                var neigh2 = neighs.next().value;
                var dist = room.neighbors.get(neigh1) + room.neighbors.get(neigh2);
                graph.get(neigh1).neighbors.delete( room.id );
                graph.get(neigh1).neighbors.set( neigh2, dist );
                graph.get(neigh2).neighbors.delete( room.id );
                graph.get(neigh2).neighbors.set( neigh1, dist );
                stable = false;
                graph.delete(room.id);
            }
        }
    } while (!stable);
}

reader.on('close', () => {

    simplifyGraph();

    runProcess( 0, 30 );
    runProcess( 4, 4 );
    
});

function runProcess( timeMe, timeEle ) {
    let currMax = 0;
    let queue = new Heap( (a : RoomConfig, b : RoomConfig) => b.open.size- a.open.size); 
    initrc.timeSpentMe = timeMe;
    initrc.timeSpentEle = timeEle;
    queue.push( initrc );
    while (queue.size() > 0) {
        //console.log( queue.size() + " " + currMax);
        var config : RoomConfig = queue.pop();
        if (cache.has( config.key())) {
            continue;
        }
        cache.set(config.key(), 1);
        const total = config.totalFlowToTime();
        if ( total > currMax && Math.min(config.timeSpentMe, config.timeSpentEle) <= 30 ) {
            currMax = total;
        }


        if ( Math.min(config.timeSpentMe, config.timeSpentEle) >= 30 ) {
            continue;
        }

        if ( config.open.size == numValves ) {
            config.timeSpentEle = 30;
            config.timeSpentMe = 30;
            if ( config.totalFlowToTime() > currMax ) {
                currMax = config.totalFlowToTime();
            }
            continue;
        }

        if ( config.maxObtainable() < currMax ) {
            continue;
        }
        
        const currRoomMe = graph.get(config.posMe);
        const currRoomEle = graph.get(config.posEle);
        if ( ( !config.open.has( currRoomMe.id ) || config.open.get(currRoomMe.id) > config.timeSpentMe + 1 ) && currRoomMe.flow > 0 ) {
            var newConf : RoomConfig = new RoomConfig();
            newConf.posMe = config.posMe;
            newConf.posEle = config.posEle;
            newConf.open = new Map<string, number>();
            for ( var op of config.open ) {
                newConf.open.set( op[0], op[1] );
            }
            newConf.open.set( currRoomMe.id, config.timeSpentMe + 1 );
            newConf.timeSpentMe = config.timeSpentMe + 1;
            newConf.timeSpentEle = config.timeSpentEle;
            if (!cache.has( newConf.key())) {
                queue.push(newConf);
            }
        }
        if ( ( !config.open.has( currRoomEle.id ) || config.open.get(currRoomEle.id) > config.timeSpentEle + 1 )&& currRoomEle.flow > 0 ) {
            var newConf : RoomConfig = new RoomConfig();
            newConf.posMe = config.posMe;
            newConf.posEle = config.posEle;
            newConf.open = new Map<string, number>();
            for ( var op of config.open ) {
                newConf.open.set( op[0], op[1] );
            }
            newConf.open.set( currRoomEle.id, config.timeSpentEle + 1 );
            newConf.timeSpentMe = config.timeSpentMe;
            newConf.timeSpentEle = config.timeSpentEle + 1;
            if (!cache.has( newConf.key())) {
                queue.push(newConf);
            }
        }
        // new configs: move to neighboring rooms
        let myNeighbors = currRoomMe.neighbors;
        if ( config.timeSpentMe >= 30 || config.open.size === numValves) {
            myNeighbors = new Map<string, number>();
        }
        let eleNeighbors = currRoomEle.neighbors;
        if ( config.timeSpentEle >= 30 || config.open.size === numValves) {
            eleNeighbors = new Map<string, number>();
        }
        for ( const neigh1 of myNeighbors ) {
            var nextNeigh1 : string = neigh1[0];
            var newConf = new RoomConfig();
            newConf.timeSpentMe = config.timeSpentMe + neigh1[1];
            if ( newConf.timeSpentMe > 30 ) {
                newConf.timeSpentMe = 30;   
            }
            newConf.posMe = nextNeigh1;

            newConf.timeSpentEle = config.timeSpentEle;
            newConf.posEle = config.posEle;

            newConf.open = new Map<string, number>();
            for ( var op of config.open ) {
                newConf.open.set( op[0], op[1] );
            }
            if (!cache.has( newConf.key())) {
                queue.push(newConf);
            }
        }
        for ( const neigh2 of eleNeighbors ) {
            var nextNeigh2 : string = neigh2[0];
            var newConf = new RoomConfig();
            newConf.timeSpentMe = config.timeSpentMe;
            newConf.posMe = config.posMe;

            newConf.timeSpentEle = config.timeSpentEle + neigh2[1];
            if ( newConf.timeSpentEle > 30 ) {
                newConf.timeSpentEle = 30;   
            }
            newConf.posEle = nextNeigh2;

            newConf.open = new Map<string, number>();
            for ( var op of config.open ) {
                newConf.open.set( op[0], op[1] );
            }
            if (!cache.has( newConf.key())) {
                queue.push(newConf);
            }
        }
    }

    console.log( currMax );
}