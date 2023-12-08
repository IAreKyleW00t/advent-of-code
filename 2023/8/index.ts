import * as fs from "fs";

const FILE = fs.readFileSync("data/input.txt");

interface Node {
    left: string;
    right: string;
}

interface Map {
    [key: string]: Node;
}

function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);
}

function traverse(start: string, map: Map, steps: string[], end: Function): number {
    let node = start;
    let total: number = 0;
    let index: number = 0;
    process.env.DEBUG && console.debug(` > ${node}`)
    while (node) {
        const step: string = steps[index];
        process.env.DEBUG && console.debug(`step => ${step}`);

        if (step === "L") node = map[node].left
        if (step === "R") node = map[node].right
        process.env.DEBUG && console.debug(` node => ${node}`);

        total++;
        index++;
        if (index === steps.length) index = 0;
        process.env.DEBUG && console.debug(`  index= ${index}, total = ${total}`);

        if (end(node)) break;
    }
    return total;
}

function part1(): number {
    let steps: string[] = [];
    const map: Map = {};
    FILE.toString().split(/\r?\n/).forEach(line => {
        if (!line) return; // skip empty lines

        if (!line.includes("=")) {
            steps = line.split("");
            process.env.DEBUG && console.debug(`steps => ${steps}`);
        } else {
            const matches = line.match(/[A-Z]{3}/g);
            if (matches?.length !== 3) return;

            map[matches[0]] = {left: matches[1], right: matches[2]};
            process.env.DEBUG && console.debug(`${matches[0]} => ${JSON.stringify(map[matches[0]])}`);
        }
    });
    process.env.DEBUG && console.debug("-".repeat(80))
    return traverse("AAA", map, steps, (n: string) => n === "ZZZ");
}

function part2(): number {
    let steps: string[] = [];
    const map: Map = {};
    FILE.toString().split(/\r?\n/).forEach(line => {
        if (!line) return; // skip empty lines

        if (!line.includes("=")) {
            steps = line.split("");
            process.env.DEBUG && console.debug(`steps => ${steps}`);
        } else {
            const matches = line.match(/[0-9A-Z]{3}/g);
            if (matches?.length !== 3) return;

            map[matches[0]] = {left: matches[1], right: matches[2]};
            process.env.DEBUG && console.debug(`${matches[0]} => ${JSON.stringify(map[matches[0]])}`);
        }
    });

    let distances: number[] = [];
    Object.keys(map).filter(node => node.endsWith("A")).forEach((node, i) => {
        distances[i] = traverse(node, map, steps, (n: string) => n.endsWith("Z"));
    });
    process.env.DEBUG && console.debug("-".repeat(80))
    return distances.reduce((a, b) => lcm(a, b));
}

const part1_out = part1();
const part2_out = part2();
console.log(`Part 1: ${part1_out}`);
console.log(`Part 2: ${part2_out}`);
