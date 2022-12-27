import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("/home/isa/projets/adventofcode/AoC2022/data/day16.txt"))

class ValveRoom {
    public neighbors = new Map<string, number>();
    public id : string;
    public flow: number;
}
const valveRegex = /Valve ([A-Z]{2}) has flow rate=(\d+); tunnel[s]? lead[s]? to valve[s]? ((?:[A-Z]{2}(?:, |$))+)/

let maxFlowPerTick = 0;
let graph = new Map<string, ValveRoom>();
let numValves = 0;

class RoomConfig {
    public posMe = 'AA';
    public posEle = 'AA';
    public open = new Map<string, number>();
    public closed = new Set<string>();
    public timeSpentMe = 0;
    public timeSpentEle = 0;
    private keyCache = '';
    public flowSoFar = 0;

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
        let closestDist = 40;
        for ( const valve of this.closed ) {
            let dist = Math.min(distances.get(this.posEle).get(valve), distances.get(this.posMe).get(valve));
            if ( dist < closestDist ) {
                closestDist = dist;
            }
        }
        const timeLeft = 30 - minDate - closestDist - 1;
        return this.totalFlowToTime( minDate + closestDist + 1 ) + maxFlowPerTick * timeLeft;
        //return maxFlowPerTick * 30;
    }

    public key() : string {
        let key = this.keyCache;
        if (key !== '') {
            return key;
        }
        const keys = new Array(...this.closed.keys()).sort();
        for ( const k of keys ) {
            key += k + ' ';
        }
        if ( this.timeSpentEle < this.timeSpentMe ) {
            key += this.posEle + ' ' + this.timeSpentEle + ' ' + this.posMe + ' ' + this.timeSpentMe;
        } else {
            key += this.posMe + ' ' + this.timeSpentMe + this.posEle + ' ' + this.timeSpentEle;
        }
        
        this.keyCache = key;
        return key;
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

let distances = new Map<string, Map<string, number>>()

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

    for ( var room of graph.values() ) {
        distances.set( room.id, new Map<string, number>());
        distances.get(room.id).set(room.id, 0);
    }

    for ( var room of graph.values() ) {
        for ( const neigh of room.neighbors ) {
            distances.get(room.id).set(neigh[0], neigh[1]);
            distances.get(neigh[0]).set(room.id, neigh[1]);
        }
    }

    let rooms = [...distances.keys()];
    for ( var room1 of rooms ) {
        for ( var room2 of rooms ) {
            for ( var room3 of rooms ) {
                let distIK = distances.get(room2).has(room1) ? distances.get(room2).get(room1) : 5000000;
                let distKJ = distances.get(room1).has(room3) ? distances.get(room1).get(room3) : 5000000;
                let distIJ = distances.get(room2).has(room3) ? distances.get(room2).has(room3) : 5000000;
                if ( distIJ > distIK + distKJ) {
                    distances.get(room2).set(room3, distIK + distKJ);
                }
            }
        }
    }
}

var maxFound = 0;

reader.on('close', () => {

    simplifyGraph();
    cache = new Map<string, number>();
    maxFound = 0;
    const initrc1 = new RoomConfig();
    initrc1.timeSpentEle = 30;
    initrc1.timeSpentMe = 0;
    initrc1.closed = new Set<string>(graph.keys());
    initrc1.closed.delete('AA');
    console.log(runProcess( initrc1 ));

    cache = new Map<string, number>();
    maxFound = 0;
    const initrc2 = new RoomConfig();
    initrc2.timeSpentEle = 4;
    initrc2.timeSpentMe = 4;
    initrc2.closed = new Set<string>(graph.keys());
    initrc2.closed.delete('AA');
    console.log(runProcess(initrc2));
});

let cache = new Map<string, number>();
let bestConfig = null;

function runProcess( config : RoomConfig ) : number {
    if ( config.maxObtainable() < maxFound ) {
        return 0;
    }

    let currFlow = config.totalFlowToTime(30);
    if (currFlow > maxFound) {
        maxFound = currFlow;
        bestConfig = config;
        console.log(bestConfig.key(), currFlow);
    }

    if ( ( config.timeSpentEle >= 30 && config.timeSpentMe >= 30 ) || config.open.size === numValves ) {
        return currFlow;
    }

    let newConfigs = [];
    let valves = new Array(...config.closed);
    valves.sort( (a : string, b : string) => {
        let timeEleA = config.timeSpentEle + distances.get(config.posEle).get(a) + 1;
        let timeEleB = config.timeSpentEle + distances.get(config.posEle).get(b) + 1;
        let timeMeA = config.timeSpentMe + distances.get(config.posMe).get(a) + 1;
        let timeMeB = config.timeSpentMe + distances.get(config.posMe).get(b) + 1;
        let benefitA = Math.max(0, 30 - Math.min(timeEleA, timeMeA)) * graph.get(a).flow;
        let benefitB = Math.max(0, 30 - Math.min(timeEleB, timeMeB)) * graph.get(b).flow;
        return benefitB - benefitA;
    });

    for ( const valve of valves ) {
        if ( config.timeSpentEle < 30 ) {
            let newConf = new RoomConfig();
            newConf.closed = new Set(config.closed);
            newConf.closed.delete(valve);
            for ( const k of config.open ) {
                newConf.open.set( k[0], k[1]);
            }
            newConf.open.set( valve, config.timeSpentEle + distances.get(config.posEle).get(valve) + 1 );
            newConf.posEle = valve;
            newConf.timeSpentEle = config.timeSpentEle + distances.get(config.posEle).get(valve) + 1;
            newConf.posMe = config.posMe;
            newConf.timeSpentMe = config.timeSpentMe;
            newConf.flowSoFar = newConf.totalFlowToTime(30);
            newConfigs.push( newConf );
        }
        if ( config.timeSpentMe < 30 ) {
            let newConf = new RoomConfig();
            newConf.closed = new Set(config.closed);
            newConf.closed.delete(valve);
            for ( const k of config.open ) {
                newConf.open.set( k[0], k[1]);
            }
            newConf.open.set( valve, config.timeSpentMe + distances.get(config.posMe).get(valve) + 1 );
            newConf.posMe = valve;
            newConf.timeSpentMe = config.timeSpentMe + distances.get(config.posMe).get(valve) + 1;
            newConf.posEle = config.posEle;
            newConf.timeSpentEle = config.timeSpentEle;
            newConf.flowSoFar = newConf.totalFlowToTime(30);
            newConfigs.push( newConf );
        }
    }


    // 2475 too low
    var flow = 0;
    for ( const newConfig of newConfigs ) {
        var flowCand;
        if ( cache.has( newConfig.key()) ) {
            var cached = newConfig.totalFlowToTime(Math.min(newConfig.timeSpentMe, newConfig.timeSpentEle)) + cache.get(newConfig.key());
            flowCand = cached;
        } else {
            flowCand = runProcess(newConfig);
            if (newConfig.timeSpentEle > 20 && newConfig.timeSpentMe > 20 ) {
                cache.set(newConfig.key(), flowCand - newConfig.totalFlowToTime(Math.min(newConfig.timeSpentMe, newConfig.timeSpentEle)));
            }
        }
        if ( flowCand > flow ) {
            flow = flowCand;
        }
        
    }
    if ( flow > maxFound ) {
        maxFound = flow;
        console.log(maxFound);
    }

    return flow;
}