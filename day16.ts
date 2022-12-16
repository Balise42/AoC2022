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


class RoomConfig {
    public pos = 'AA';
    public open = new Set<string>();
    public totalFlow = 0;
    public tickFlow = 0;
    public timeSpent = 0;

    public maxObtainable() : number {
        const timeLeft = 30 - this.timeSpent;
        return this.totalFlow + maxFlowPerTick * timeLeft;
    }
}

const initrc = new RoomConfig();

reader.on("line", (l: string) => {
    const groups = l.match(valveRegex);
    const room = new ValveRoom();
    room.id = groups[1];
    room.flow = parseInt(groups[2]);
    maxFlowPerTick += room.flow;
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
    let currMax = 0;

    let queue = new Heap( (a, b) => b.tickFlow - a.tickFlow );
    queue.push( initrc );
    while (queue.size() > 0) {
        var config = queue.pop();
        if ( config.totalFlow > currMax && config.timeSpent <= 30 ) {
            currMax = config.totalFlow;
        }

        if ( config.timeSpent >= 30 ) {
            continue;
        }
        if ( config.maxObtainable() < currMax ) {
            continue;
        }
        const currRoom = graph.get(config.pos);
        if ( !config.open.has( currRoom.id ) && currRoom.flow > 0 ) {
            var newConf = new RoomConfig();
            newConf.pos = config.pos;
            newConf.open = new Set();
            for ( var op of config.open.values() ) {
                newConf.open.add(op);
            }
            newConf.open.add( config.pos );
            newConf.timeSpent = config.timeSpent + 1;
            newConf.totalFlow = config.totalFlow + config.tickFlow;
            newConf.tickFlow = config.tickFlow + currRoom.flow;
            queue.push(newConf);
        }
        // new configs: move to neighboring rooms
        for ( const neigh of currRoom.neighbors ) {
            var nextNeigh : string = neigh[0];
            var newConf = new RoomConfig();
            newConf.timeSpent = config.timeSpent + neigh[1];
            if ( newConf.timeSpent > 30 ) {
                newConf.timeSpent = 30;   
            }
            newConf.pos = nextNeigh;
            newConf.totalFlow = config.totalFlow + config.tickFlow * (newConf.timeSpent - config.timeSpent);
            newConf.tickFlow = config.tickFlow;
            newConf.open = new Set();
            for ( var op of config.open.values() ) {
                newConf.open.add(op);
            }  
            queue.push(newConf);
        }
    
    }

    console.log( currMax );
});