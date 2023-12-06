import * as fs from "fs";

const FILE = fs.readFileSync("data/input.txt");

function calculateWins(time: number, distance: number): number[] {
    // skip 0 because that will never win
    const wins: number[] = [];
    for (let i = 1; i < time; i++) {
        let runtime = time - i;
        let travelled = runtime * i;
        if (travelled > distance) wins.push(i);
    }
    return wins;
}

function part1(): number {
    let total: number = 1;
    const times: number[] = [];
    const distances: number[] = [];
    FILE.toString().split(/\r?\n/).forEach(line => {
        if (!line) return; // skip empty lines

        if (line.match(/^Time:.+$/)) {
            line.match(/\d+/g)?.map(num => times.push(parseInt(num)));
            process.env.DEBUG && console.debug(`times => ${times}`);
        } else if (line.match(/^Distance:.+$/)) {
            line.match(/\d+/g)?.map(num => distances.push(parseInt(num)));
            process.env.DEBUG && console.debug(`distances => ${distances}`);
        }
    });

    for (let i = 0; i < times.length; i++) {
        const wins = calculateWins(times[i], distances[i]);
        total *= wins.length;
        process.env.DEBUG && console.debug(`Race ${i} => ${wins} => ${wins.length}`);
    }
    return total;
}

function part2(): number {
    let total: number = 1;
    const times: number[] = [];
    const distances: number[] = [];
    FILE.toString().split(/\r?\n/).forEach(line => {
        if (!line) return; // skip empty lines

        if (line.match(/^Time:.+$/)) {
            const time = line.split(":")[1].replace(/\s+/g, "");
            times.push(parseInt(time));
            process.env.DEBUG && console.debug(`times => ${times}`);
        } else if (line.match(/^Distance:.+$/)) {
            const distance = line.split(":")[1].replace(/\s+/g, "");
            distances.push(parseInt(distance));
            process.env.DEBUG && console.debug(`distances => ${distances}`);
        }
    });

    for (let i = 0; i < times.length; i++) {
        const wins = calculateWins(times[i], distances[i]);
        total *= wins.length;
        process.env.DEBUG && console.debug(`Race ${i} => ${wins} => ${wins.length}`);
    }
    return total;
}

const part1_out = part1();
process.env.DEBUG && console.debug("-".repeat(80))
const part2_out = part2();
process.env.DEBUG && console.debug("-".repeat(80))

console.log(`Part 1: ${part1_out}`);
console.log(`Part 2: ${part2_out}`);
