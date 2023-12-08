import * as fs from "fs";

const FILE = fs.readFileSync("data/input.txt");

interface Filter {
    to: string;
    from: string;
    srcs: number[];
    dests: number[];
    ranges: number[];
    offsets: number[];
}

function part1(): number {
    let seeds: number[] = [];
    let maps: { [key: string]: Filter } = {};
    let category: string;
    FILE.toString().split(/\r?\n/).forEach(line => {
        if (!line) return; // skip empty lines

        if (line.match(/^seeds:.+$/)) {
            line.match(/\d+/g)?.map(num => seeds.push(parseInt(num)));
            process.env.DEBUG && console.debug(`${line} => ${seeds}`);
        } else if (line.match(/^.+map:$/)) {
            let map = line.match(/^(\w+)-to-(\w+).+$/);
            if (map?.length !== 3) return; // invalid
            const from = category;

            category = map[1];
            let to = map[2];
            maps[category] = {
                to: to,
                from: from,
                srcs: [],
                dests: [],
                ranges: [],
                offsets: [],
            };
            process.env.DEBUG && console.debug(`${line} => ${from}:${category}:${to}`);
        } else {
            let numbers = line.match(/\d+/g)?.map(num => parseInt(num));
            if (numbers?.length !== 3) return; // invalid

            const src = numbers[1];
            const dest = numbers[0];
            const range = numbers[2];
            maps[category].srcs.push(src);
            maps[category].dests.push(dest)
            maps[category].ranges.push(range)
            maps[category].offsets.push(dest - src)
            process.env.DEBUG && console.debug(`  + { src = ${src}, dest = ${dest}, range = ${range} }`)
        }
    });

    let locations: number[] = [];
    seeds.forEach(seed => {
        category = Object.keys(maps)[0];
        let map = maps[category];
        let step = seed;
        while (map) {
            process.env.DEBUG && console.debug(`${category} => ${JSON.stringify(map)}`);

            let mapped;
            for (let i = 0; i < map.srcs.length; i++) {
                if (step >= map.srcs[i] && step < (map.srcs[i] + map.ranges[i])) {
                    process.env.DEBUG && console.debug(`  ${category}:${step} => ${map.to}:${step + map.offsets[i]}`)
                    mapped = step + map.offsets[i];
                    break;
                }
            }
            if (mapped) step = mapped;
    
            category = map.to;
            map = maps[category];
        }

        locations.push(step); // add location
    });
    process.env.DEBUG && console.debug(`locations => ${locations}`);
    return Math.min(...locations);
}

function part2(): number {
    const seeds: { start: number, length: number }[] = [];
    let maps: { [key: string]: Filter } = {};

    let category: string;
    FILE.toString().split(/\r?\n/).forEach(line => {
        if (!line) return; // skip empty lines

        if (line.match(/^seeds:.+$/)) {
            line.match(/\d+\s+\d+/g)?.map(num => {
                const split = num.split(/\s+/);
                const start = parseInt(split[0]);
                const length = parseInt(split[1]) - 1;
                seeds.push({ start: start, length: length });
            });
            process.env.DEBUG && console.debug(`${line} => ${JSON.stringify(seeds)}`);
        } else if (line.match(/^.+map:$/)) {
            let map = line.match(/^(\w+)-to-(\w+).+$/);
            if (map?.length !== 3) return; // invalid
            const from = category;

            category = map[1];
            let to = map[2];
            maps[category] = {
                to: to,
                from: from,
                srcs: [],
                dests: [],
                ranges: [],
                offsets: [],
            };
            process.env.DEBUG && console.debug(`${line} => ${category}:${to}`);
        } else {
            let numbers = line.match(/\d+/g)?.map(num => parseInt(num));
            if (numbers?.length !== 3) return; // invalid

            const src = numbers[1];
            const dest = numbers[0];
            const range = numbers[2];
            maps[category].srcs.push(src);
            maps[category].dests.push(dest)
            maps[category].ranges.push(range)
            maps[category].offsets.push(dest - src)
            process.env.DEBUG && console.debug(`  + { src = ${src}, dest = ${dest}, range = ${range} }`)
        }
    });

    // Similar to Part 1, but "bruteforce" in reverse from Location > ... > Seed
    let location = -1;
    for (let loc = 0; loc < Number.MAX_SAFE_INTEGER; loc++) {
        category = Object.keys(maps).reverse()[0];
        let map = maps[category];
        let step = loc;
        while (map) {
            process.env.DEBUG && console.debug(`${category} => ${JSON.stringify(map)}`);

            let mapped;
            for (let i = 0; i < map.dests.length; i++) {
                if (step >= map.dests[i] && step < (map.dests[i] + map.ranges[i])) {
                    process.env.DEBUG && console.debug(`  ${category}:${step} => ${map.from}:${map.srcs[i] + map.offsets[i]}`)
                    mapped = map.srcs[i] + map.offsets[i];
                    break;
                }
            }
            if (mapped) step = mapped;
    
            category = map.from;
            map = maps[category];
        }
        if (step !== loc) {
            location = step;
            break;
        }
        if (location !== -1) break;
    }
    return location;
}

const part1_out = part1();
process.env.DEBUG && console.debug("-".repeat(80))
const part2_out = part2();
process.env.DEBUG && console.debug("-".repeat(80))

console.log(`Part 1: ${part1_out}`);
console.log(`Part 2: ${part2_out}`);
