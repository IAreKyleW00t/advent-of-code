import * as fs from "fs";

const FILE = fs.readFileSync("data/input.txt");

function part1(): number {
    let seeds: number[] = [];
    let maps: {
        [key: string]: {
            to: string,
            srcs: number[],
            dests: number[],
            ranges: number[],
            offsets: number[],
        }
    } = {};

    let category: string;
    FILE.toString().split(/\r?\n/).forEach(line => {
        if (!line) return; // skip empty lines

        if (line.match(/^seeds:.+$/)) {
            line.match(/\d+/g)?.map(num => seeds.push(parseInt(num)));
            process.env.DEBUG && console.debug(`${line} => ${seeds}`);
        } else if (line.match(/^.+map:$/)) {
            let map = line.match(/^(\w+)-to-(\w+).+$/);
            if (map?.length !== 3) return; // invalid

            category = map[1];
            let to = map[2]
            maps[category] = {
                to: to,
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
            process.env.DEBUG && console.debug(`  + src = ${src}, dest = ${dest}, range = ${range}`)
        }
    });

    let locations: number[] = [];
    seeds.forEach(seed => {
        category = Object.keys(maps)[0];
        let map = maps[category];
        let src = seed;
        while (map) {
            process.env.DEBUG && console.debug(`${category} => ${JSON.stringify(map)}`);

            let mapped;
            for (let i = 0; i < map.srcs.length; i++) {
                if (src >= map.srcs[i] && src < (map.srcs[i] + map.ranges[i])) {
                    process.env.DEBUG && console.debug(`  ${category}:${src} => ${map.to}:${src + map.offsets[i]}`)
                    mapped = src + map.offsets[i];
                    break;
                }
            }
            if (mapped) src = mapped;
    
            category = map.to;
            map = maps[category];
        }

        locations.push(src); // add location
    });
    process.env.DEBUG && console.debug(`locations => ${locations}`);
    return Math.min(...locations);
}

function part2(): number {
    let seeds: number[] = [];
    let maps: {
        [key: string]: {
            to: string,
            srcs: number[],
            dests: number[],
            ranges: number[],
            offsets: number[],
        }
    } = {};

    let category: string;
    FILE.toString().split(/\r?\n/).forEach(line => {
        if (!line) return; // skip empty lines

        if (line.match(/^seeds:.+$/)) {
            line.match(/\d+\s+\d+/g)?.map(num => {
                const split = num.split(/\s+/);
                const start = parseInt(split[0]);
                const length = parseInt(split[1]);

                // TODO: Figure out large numbers
                for (let i = start; i < start + length; i++) {
                    seeds.push(i);
                }
            });
            process.env.DEBUG && console.debug(`${line} => ${seeds}`);
            return 0;
        } else if (line.match(/^.+map:$/)) {
            let map = line.match(/^(\w+)-to-(\w+).+$/);
            if (map?.length !== 3) return; // invalid

            category = map[1];
            let to = map[2]
            maps[category] = {
                to: to,
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
            process.env.DEBUG && console.debug(`  + src = ${src}, dest = ${dest}, range = ${range}`)
        }
    });

    let locations: number[] = [];
    seeds.forEach(seed => {
        category = Object.keys(maps)[0];
        let map = maps[category];
        let src = seed;
        while (map) {
            process.env.DEBUG && console.debug(`${category} => ${JSON.stringify(map)}`);

            let mapped;
            for (let i = 0; i < map.srcs.length; i++) {
                if (src >= map.srcs[i] && src < (map.srcs[i] + map.ranges[i])) {
                    process.env.DEBUG && console.debug(`  ${category}:${src} => ${map.to}:${src + map.offsets[i]}`)
                    mapped = src + map.offsets[i];
                    break;
                }
            }
            if (mapped) src = mapped;
    
            category = map.to;
            map = maps[category];
        }

        locations.push(src); // add location
    });
    process.env.DEBUG && console.debug(`locations => ${locations}`);
    return Math.min(...locations);

}

const part1_out = part1();
process.env.DEBUG && console.debug("-".repeat(80))
const part2_out = part2();
process.env.DEBUG && console.debug("-".repeat(80))

console.log(`Part 1: ${part1_out}`);
console.log(`Part 2: ${part2_out}`);
