import { time } from 'console';
import * as fs from 'fs';
import * as rd from 'readline'

var reader = rd.createInterface(fs.createReadStream("/home/isa/projets/adventofcode/AoC2022/data/day19-test.txt"))
const regex = /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./

let memo = new Map<string, number>();

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

    public getQuality() : number {
        const conf = new Config();
        conf.bp = this;
        const maxGeodes =  conf.getMaxGeodes();
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

    public getMaxGeodes() : number {
        if (memo.has(this.toString())) {
            return memo.get(toString());
        }
        if ( this.time === 24 ) {
            return this.geo + this.geoBots;
        }
        if ( !this.canBuildGeoBeforeEnd() ) {
            return this.geo + this.geoBots * (24 - this.time + 1);
        }

        let configs = [];

        if ( this.obs >= this.bp.costGeoObs && this.ore >= this.bp.costGeoOre ) {
            configs.push(this.buildGeoBot());
        }
        if ( this.bp.costGeoObs > this.obsBots + this.obs && this.ore >= this.bp.costObsOre && this.clay >= this.bp.costObsClay) {
            configs.push(this.buildObsBot());
        }
        if ( this.bp.costObsClay > this.clayBots + this.clay && this.ore >= this.bp.costClayOre ) {
            configs.push(this.buildClayBot());
        }
        if ( this.bp.maxOreCost > this.oreBots + this.ore && this.ore >= this.bp.costOreOre ) {
            configs.push(this.buildOreBot());
        }
        configs.push(this.pause());

        var maxGeo = 0;
        for ( const config of configs ) {
            var geo = config.getMaxGeodes();
            if ( geo > maxGeo ) {
                maxGeo = geo;
            }
            if (maxGeo > 10) {
                console.log("pouet");
            }
        }
        memo.set( this.toString(), maxGeo);
        return maxGeo;
    }

    private canBuildGeoBeforeEnd() : boolean {
        let currMaxObs = this.obs + (24 - this.time) * this.obsBots;
        let currMaxOre = this.ore + (24 - this.time) * this.oreBots;
        if ( currMaxObs >= this.bp.costGeoObs && currMaxOre >= this.bp.costGeoOre ) {
            return true;
        }
        if ( this.obsBots === 0 && !this.canBuildObsBeforeEnd()) {
            return false;
        }
        if ( currMaxObs < this.bp.costGeoObs && !this.canBuildObsBeforeEnd()) {
            return false;
        }
        if ( currMaxOre < this.bp.costGeoOre && !this.canBuildOreBeforeEnd()) {
            return false;
        }
        return true;
    }

    private canBuildObsBeforeEnd() : boolean {
        let currMaxOre = this.ore + (24 - this.time) * this.oreBots;
        let currMaxClay = this.clay + (24 - this.time) * this.clayBots;
        if (currMaxClay >= this.bp.costObsClay && currMaxOre >= this.bp.costObsOre ) {
            return true;
        }
        if ( currMaxClay < this.bp.costObsClay && !this.canBuildClayBeforeEnd()) {
            return false;
        }
        if ( currMaxOre < this.bp.costObsOre && !this.canBuildOreBeforeEnd()) {
            return false;
        }
        return true;
    }

    private canBuildClayBeforeEnd() : boolean {
        let currMaxOre = this.ore + (24 - this.time) * this.oreBots;
        if ( currMaxOre < this.bp.costClayOre && !this.canBuildOreBeforeEnd()) {
            return false;
        }
        return true;
    }

    private canBuildOreBeforeEnd() : boolean {
        let currMaxOre = this.ore + (24 - this.time) * this.oreBots;
        if (currMaxOre < this.bp.costOreOre) {
            return false;
        }
        return true;
    }

    private pause() : Config {
        let newConf = this.nextConfig();
        console.log(newConf.toString());
        return newConf;
    }

    private buildOreBot() : Config {
        let newConf = this.nextConfig();
        newConf.oreBots++;
        newConf.ore -= newConf.bp.costOreOre;
        console.log(newConf.toString());
        return newConf;
    }

    private buildClayBot() : Config {
        let newConf = this.nextConfig();
        newConf.clayBots++;
        newConf.ore -= newConf.bp.costClayOre;
        console.log(newConf.toString());
        return newConf;
    }

    private buildObsBot() : Config {
        let newConf = this.nextConfig();
        newConf.obsBots++;
        newConf.ore -= newConf.bp.costObsOre;
        newConf.clay -= newConf.bp.costObsClay;
        console.log(newConf.toString());
        return newConf;
    }

    private buildGeoBot() : Config {
        let newConf = this.nextConfig();
        newConf.geoBots++;
        newConf.ore -= newConf.bp.costGeoOre;
        newConf.obs -= newConf.bp.costGeoObs;
        console.log(newConf.toString());
        return newConf;
    }
}

reader.on("line", (l: string) => {
    memo = new Map<string, number>();
    const bp = new Blueprint(l);

    const quality = bp.getQuality();
    console.log(quality);
});

reader.on("close", () => {
});