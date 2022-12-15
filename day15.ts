import * as fs from 'fs';
import * as rd from 'readline'

const reader = rd.createInterface(fs.createReadStream("D:\\Home\\projects\\adventcalendar\\2022\\data\\day15.txt"))

class Sensor {
    public x : number
    public y : number
    public beacX : number;
    public beacY : number;
    public exclusionDistance : number;
}

const sensors = []
const sensorRegex = /Sensor at x=(\-?\d+), y=(\-?\d+): closest beacon is at x=(\-?\d+), y=(\-?\d+)/

reader.on("line", (l: string) => {
    const groups = l.match( sensorRegex );
    const sensor = new Sensor();
    sensor.x = parseInt(groups[1]);
    sensor.y = parseInt(groups[2]);
    sensor.beacX = parseInt(groups[3]);
    sensor.beacY = parseInt(groups[4]);
    sensor.exclusionDistance = (Math.abs(sensor.x - sensor.beacX)) + (Math.abs(sensor.y - sensor.beacY));
    sensors.push( sensor );
});

function coalesceIntervals( intervals : Array<Array<number>>) {
    intervals = intervals.sort( (a, b) => (a[0] - b[0]) !== 0 ? a[0] - b[0] : a[1] - b[1]);
    var newIntervals = new Array();

    newIntervals.push(intervals[0]);

    for ( let i = 1; i < intervals.length; i++ ) {
        if ( intervals[i][0] > newIntervals[newIntervals.length - 1][1] + 1 ) {
            //disjoint intervals, happy
            newIntervals.push(intervals[i]);
            continue;
        }
        if ( intervals[i][1] <= newIntervals[newIntervals.length - 1][1] ) {
            // contained interval, happy as well, do nothing
            continue;
        }
        // intersection, we merge both intervals
        newIntervals[newIntervals.length - 1][1] = intervals[i][1];
    }

    return newIntervals;
}

function exclusionZone( row :number, maxX: number = null ) : Array<Array<number>> {
    let excluded = new Array();

    for ( const sensor of sensors ) {
        let start = sensor.x - (sensor.exclusionDistance - Math.abs(sensor.y - row));
        let end = sensor.x + sensor.exclusionDistance - Math.abs(sensor.y - row);
        if (end < start) {
            continue;
        }
        if ( maxX !== null && start < 0) {
            start = 0;
        }
        if ( maxX !== null && end > maxX ) {
            end = maxX
        }
        excluded.push(new Array(start, end));
    }
    
    excluded = coalesceIntervals( excluded );

    return excluded;
}

reader.on('close', () => {
    const size = 4000000;
    const excluded = exclusionZone( size / 2 );
    let res = 0;
    for ( const ex of excluded ) {
        res += ex[1] - ex[0];
    }
    console.log(res);

    for ( let i = 0; i <= size; i++ ) {
        var excludedRow = exclusionZone(i, size);
        if ( excludedRow.length >= 2) {
            console.log((excludedRow[1][0] - 1) * 4000000 + i);
        }
    }
});