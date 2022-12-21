import * as fs from 'fs';
import * as rd from 'readline'

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
    private keyCache = '';

    public totalFlowToTime( time : number) : number {
        let res = 0;
        for ( const valve of this.open ) {
            if ( valve[1] > time || valve[1] > 30) {
                continue;
            }
            res += (time- valve[1]) * graph.get(valve[0]).flow;
        }
        return res;
    }

    public maxObtainable() : number {
        let minDate = Math.min(this.timeSpentMe, this.timeSpentEle);
        const timeLeft = 30 - minDate;
        return this.totalFlowToTime( minDate ) + maxFlowPerTick * timeLeft - Math.ceil((numValves - this.open.size)/2);
    }

    public key() : string {
        let key = this.keyCache;
        if (key !== '') {
            return key;
        }
        if ( this.open.size < numValves ) {
           /* if ( this.timeSpentEle < this.timeSpentMe ) {
                key = 'POS(' + this.posEle + ' ' + this.timeSpentEle + ' ' + this.posMe + ' ' + this.timeSpentMe + ') '
            } else {
                key = 'POS(' + this.posMe + ' ' + this.timeSpentMe + ' ' + this.posEle + ' ' + this.timeSpentEle + ') '
            }*/
        }
        const keys = new Array(...this.open.keys()).sort();
        for ( const k of keys ) {
            key += k + ' ' + this.open.get(k) + ' ';
        }
        key += Math.min( this.timeSpentEle, this.timeSpentMe ) + ' ' + Math.max( this.timeSpentEle, this.timeSpentMe );
        this.keyCache = key;
        return key;
    }

    public sortByPotential( vertices ) : [] {
        return vertices.sort( (a, b) => {
           if ( this.open.has(a) || a === 'AA' ) {
            return 1;
           }
           if ( this.open.has(b) || b === 'AA' ) {
            return -1;
           }
           return graph.get(a).flow < graph.get(b).flow ? 1 : -1;
        });
    }
}

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

var maxFound = 0;
var maxConfig = null;

reader.on('close', () => {

    simplifyGraph();
    maxFound = 0;
    const initrc1 = new RoomConfig();
    initrc1.timeSpentEle = 30;
    initrc1.timeSpentMe = 0;
    console.log(runProcess( initrc1 ));

    const initrc2 = new RoomConfig();
    initrc2.timeSpentEle = 4;
    initrc2.timeSpentMe = 4;
    console.log(runProcess(initrc2));
});



function runProcess( config : RoomConfig ) : number {
    if ( cache.has( config.key()) ) {
        return cache.get(config.key());
    }

    if ( config.maxObtainable() <= maxFound ) {
        return -1;
    }


    let currFlow = config.totalFlowToTime(30);
    if (currFlow > maxFound) {
        maxFound = currFlow;
        maxConfig = config;
    }

    if ( ( config.timeSpentEle >= 30 && config.timeSpentMe >= 30 ) || config.open.size === numValves ) {
        cache.set( config.key(), currFlow);
        return currFlow;
    }

    let newConfigs = [];

    if ( config.timeSpentMe < 30 ) {
        if ( (!config.open.has(config.posMe) || config.open.get(config.posMe) > config.timeSpentMe + 1) && config.posMe !== 'AA' ) {
            let newConfig = new RoomConfig();
            newConfig.posMe = config.posMe;
            newConfig.timeSpentMe = config.timeSpentMe + 1;
            newConfig.posEle = config.posEle;
            newConfig.timeSpentEle = config.timeSpentEle;
            newConfig.open = new Map(config.open);
            newConfig.open.set( config.posMe, config.timeSpentMe + 1 );
            newConfigs.push( newConfig );
        }
    }
    
    if ( config.timeSpentEle < 30 ) {
        if ( ( !config.open.has(config.posEle) || config.open.get(config.posEle) > config.timeSpentEle + 1) && config.posEle !== 'AA' ) {
            let newConfig = new RoomConfig();
            newConfig.posMe = config.posMe;
            newConfig.timeSpentMe = config.timeSpentMe;
            newConfig.posEle = config.posEle;
            newConfig.timeSpentEle = config.timeSpentEle + 1;
            newConfig.open = new Map(config.open);
            newConfig.open.set( config.posEle, config.timeSpentEle + 1 );
            newConfigs.push( newConfig );
        }
    }
     
    if ( config.timeSpentMe < 30 ) {
        const neighs1 = config.sortByPotential(new Array(...graph.get(config.posMe).neighbors.keys()))

        for ( const neigh of neighs1 ) {
            let newConfig = new RoomConfig();
            newConfig.posMe = neigh;
            newConfig.timeSpentMe = Math.min(config.timeSpentMe + graph.get(config.posMe).neighbors.get(neigh), 30);
            newConfig.posEle = config.posEle;
            newConfig.timeSpentEle = config.timeSpentEle;
            newConfig.open = new Map(config.open);
            newConfigs.push( newConfig );
        }
    }

    if ( config.timeSpentEle < 30 ) {
        const neighs2 = config.sortByPotential(new Array(...graph.get(config.posEle).neighbors.keys()));
        for ( const neigh of neighs2 ) {
            let newConfig = new RoomConfig();
            newConfig.posMe = config.posMe;
            newConfig.timeSpentMe = config.timeSpentMe;
            newConfig.posEle = neigh;
            newConfig.timeSpentEle = Math.min(config.timeSpentEle + graph.get(config.posEle).neighbors.get(neigh), 30);
            newConfig.open = new Map(config.open);
            newConfigs.push( newConfig );
        }
    }

    var flow = -1;
    for ( const newConfig of newConfigs ) {
        var flowCand = runProcess(newConfig);
        if ( flowCand > flow ) {
            flow = flowCand;
        }
    }
    if ( flow > -1 ) {
        cache.set( config.key(), flow );
    }
    return flow;
}