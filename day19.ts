import { time } from 'console';
import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("/home/isa/projets/adventofcode/AoC2022/data/day19.txt"))
const regex = /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./

let currMaxGeo = 0;

class Blueprint {
    id: number;
    costOreOre: number;
    costClayOre: number;
    costObsOre: number;
    costObsClay: number;
    costGeoOre: number;
    costGeoObs: number;
    maxOreCost : number;

    constructor( line: string ) {
        const groups = line.match(regex);
        this.id = parseInt(groups[1]);
        this.costOreOre = parseInt(groups[2]);
        this.costClayOre = parseInt(groups[3]);
        this.costObsOre = parseInt(groups[4]);
        this.costObsClay = parseInt(groups[5]);
        this.costGeoOre = parseInt(groups[6]);
        this.costGeoObs = parseInt(groups[7]);
        this.maxOreCost = Math.max(this.costClayOre, this.costOreOre, this.costGeoOre, this.costObsOre);
    }

    public getQuality( time : number ) : number {
        const conf = new Config();
        conf.bp = this;
        const maxGeodes =  conf.getMaxGeodes( time );
        console.log( maxGeodes );
        return maxGeodes * this.id;
    }
}

class Config {
    bp : Blueprint;
    oreBots: number = 1;
    clayBots: number = 0;
    obsBots: number = 0;
    geoBots: number = 0;
    ore: number = 0;
    clay: number = 0;
    obs: number = 0;
    geo: number = 0;
    time: number = 0;

    public toString(): string {
        return 'Time ' + this.time + ': ' + this.oreBots + " ore bots, " + this.clayBots + " clay bots, "
            + this.obsBots + " obsidian bots, " + this.geoBots + " geode bots; " + this.ore + " ore, "
            + this.clay + " clay, " + this.obs + " obs, " + this.geo + " geodes";
    }

    public nextConfig(): Config {
        const conf = new Config();
        conf.bp = this.bp;
        conf.oreBots = this.oreBots;
        conf.clayBots = this.clayBots;
        conf.obsBots = this.obsBots;
        conf.geoBots = this.geoBots;
        conf.ore = this.ore + this.oreBots;
        conf.clay = this.clay + this.clayBots;
        conf.obs = this.obs + this.obsBots;
        conf.geo = this.geo + this.geoBots;
        conf.time = this.time + 1;
        return conf;
    }

    public clone(): Config {
        const conf = new Config();
        conf.bp = this.bp;
        conf.oreBots = this.oreBots;
        conf.clayBots = this.clayBots;
        conf.obsBots = this.obsBots;
        conf.geoBots = this.geoBots;
        conf.ore = this.ore;
        conf.clay = this.clay;
        conf.obs = this.obs;
        conf.geo = this.geo;
        conf.time = this.time;
        return conf;
    }

    public getMaxGeodes( time : number ) : number {
        if ( this.time === time ) {
            return this.geo;
        }
        if ( this.time > time ) {
            throw ( 'should not happen');
        }

        let confViaOre = this.nextOreBot(time);
        let confViaClay = this.nextClayBot(time);
        let confViaObs = this.nextObsBot(time);
        let confViaGeo = this.nextGeoBot(time);

        if ( confViaOre === null && confViaClay === null && confViaObs === null && confViaGeo === null ) {
            return this.geo + (time - this.time) * this.geoBots;
        }

        if ( this.clayBots === 0 ) {
            let a = (confViaOre !== null) ? confViaOre.getMaxGeodes(time) : 0;
            let b = (confViaClay !== null ) ? confViaClay.getMaxGeodes(time) : 0;
            return Math.max(a, b);
        }

        if ( this.obsBots === 0 ) {
            let a = (confViaOre !== null) ? confViaOre.getMaxGeodes(time) : 0;
            let b = (confViaClay !== null ) ? confViaClay.getMaxGeodes(time) : 0;
            let c = (confViaObs !== null ) ? confViaObs.getMaxGeodes(time) : 0;
            return Math.max(a, b, c);
        }
        
        if ( this.obs >= this.bp.costGeoObs && this.ore >= this.bp.costGeoOre) {
            return this.nextGeoBot(time).getMaxGeodes(time);
        }

        let optimGeo = this.geo;
        let newGeo = this.geoBots;
        for ( let i = 1; i <= time - this.time; i++) {
            optimGeo += newGeo;
            newGeo++;
        }
        if (optimGeo < currMaxGeo) {
            return 0;
        }

        let maxGeo = this.geo;
        if (confViaOre !== null ) {
            maxGeo = Math.max(maxGeo, confViaOre.getMaxGeodes(time));
        }
        if ( confViaClay !== null) {
            maxGeo = Math.max(maxGeo, confViaClay.getMaxGeodes(time));
        }
        if ( confViaGeo !== null ) {
            maxGeo = Math.max(maxGeo, confViaGeo.getMaxGeodes(time));
        }
        if ( confViaObs !== null) {
            maxGeo = Math.max(maxGeo, confViaObs.getMaxGeodes(time));
        }

        if ( currMaxGeo < maxGeo) {
           currMaxGeo = maxGeo;
        }
        return maxGeo;
    }

    private nextOreBot(time : number) : Config {
        let confViaOre = this.clone();
        if ( confViaOre.oreBots >= confViaOre.bp.maxOreCost ) {
            confViaOre = null;
        } else {
            while (confViaOre.ore < confViaOre.bp.costOreOre ) {
                confViaOre = confViaOre.pause();
            }
            confViaOre = confViaOre.buildOreBot();
            if (confViaOre.time > time) {
                confViaOre = null;
            }
        }
        return confViaOre;
    }

    private nextClayBot(time : number) : Config {
        let confViaClay = this.clone();
        if ( confViaClay.clayBots >= confViaClay.bp.costObsClay ) {
            confViaClay = null;
        } else {
            while (confViaClay.ore < confViaClay.bp.costClayOre ) {
                confViaClay = confViaClay.pause();
            }
            confViaClay = confViaClay.buildClayBot();
            if (confViaClay.time > time ) {
                confViaClay = null;
            }
        }
        return confViaClay;
    }

    private nextObsBot(time : number) : Config {
        let confViaObs = this.clone();
        if ( confViaObs.obsBots >= confViaObs.bp.costGeoObs ) {
            confViaObs = null;
        } else {
            if ( confViaObs.clayBots > 0 ) {
                while ( confViaObs.clay < confViaObs.bp.costObsClay || confViaObs.ore < confViaObs.bp.costObsOre ) {
                    confViaObs = confViaObs.pause();
                }
                confViaObs = confViaObs.buildObsBot();
                if (confViaObs.time > time) {
                    confViaObs = null; 
                }
            } else {
               return null;
            }
        }
        return confViaObs;
    }

    private nextGeoBot(time : number) : Config {
        let confViaGeo = this.clone();
        if ( confViaGeo.obsBots > 0 ) {
            while ( confViaGeo.obs < confViaGeo.bp.costGeoObs || confViaGeo.ore < confViaGeo.bp.costGeoOre ) {
                confViaGeo = confViaGeo.pause();
            }
            confViaGeo = confViaGeo.buildGeoBot();
            if (confViaGeo.time > time) {
                confViaGeo = null; 
            }
        } else {
            return null;
        }
        return confViaGeo;
    }

    private pause() : Config {
        let newConf = this.nextConfig();
        return newConf;
    }

    private buildOreBot() : Config {
        if ( this.bp.costOreOre > this.ore ) {
            throw "Cannot build ore bot";
        }
        let newConf = this.nextConfig();
        newConf.oreBots++;
        newConf.ore -= newConf.bp.costOreOre;
        return newConf;
    }

    private buildClayBot() : Config {
        if ( this.bp.costClayOre > this.ore ) {
            throw "Cannot build clay bot";
        }
        let newConf = this.nextConfig();
        newConf.clayBots++;
        newConf.ore -= newConf.bp.costClayOre;
        return newConf;
    }

    private buildObsBot() : Config {
        if ( this.bp.costObsClay > this.clay || this.bp.costObsOre > this.ore ) {
            throw "Cannot build obs bot";
        }
        let newConf = this.nextConfig();
        newConf.obsBots++;
        newConf.ore -= newConf.bp.costObsOre;
        newConf.clay -= newConf.bp.costObsClay;
        return newConf;
    }

    private buildGeoBot() : Config {
        if ( this.bp.costGeoObs > this.obs || this.bp.costGeoOre > this.ore ) {
            throw "cannot build geo bot";
        }
        let newConf = this.nextConfig();
        newConf.geoBots++;
        newConf.ore -= newConf.bp.costGeoOre;
        newConf.obs -= newConf.bp.costGeoObs;
        return newConf;
    }
}

let sum = 0;

reader.on("line", (l: string) => {
    const bp = new Blueprint(l);
    currMaxGeo = 0;
    const quality = bp.getQuality( 24 );
    console.log(quality);
    sum += quality;
});

reader.on("close", () => {
    console.log(sum);
});