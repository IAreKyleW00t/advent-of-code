import * as fs from "fs";

const stdin: string = fs.readFileSync(0).toString();

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

function traverse(
  start: string,
  map: Map,
  steps: string[],
  end_condition: (node: string) => boolean
): number {
  let node = start;
  let total: number = 0;
  let i: number = 0;

  while (node) {
    const step: string = steps[i++];
    total++;

    if (step === "L") node = map[node].left;
    if (step === "R") node = map[node].right;

    if (i === steps.length) i = 0; // wrap around
    if (end_condition(node)) break;
  }
  return total;
}

function part1(): number {
  let steps: string[] = [];
  const map: Map = {};

  stdin.split(/\r?\n/).forEach((line) => {
    if (!line) return; // skip empty lines

    if (!line.includes("=")) steps = line.split("");
    else {
      const matches = line.match(/[A-Z]{3}/g);
      if (matches?.length !== 3) return;
      map[matches[0]] = { left: matches[1], right: matches[2] };
    }
  });

  return traverse("AAA", map, steps, (n: string) => n === "ZZZ");
}

function part2(): number {
  let steps: string[] = [];
  const map: Map = {};

  stdin.split(/\r?\n/).forEach((line) => {
    if (!line) return; // skip empty lines

    if (!line.includes("=")) steps = line.split("");
    else {
      const matches = line.match(/[0-9A-Z]{3}/g);
      if (matches?.length !== 3) return;
      map[matches[0]] = { left: matches[1], right: matches[2] };
    }
  });

  const distances: number[] = [];
  Object.keys(map)
    .filter((node) => node.endsWith("A"))
    .forEach((node, i) => {
      distances[i] = traverse(node, map, steps, (n: string) => n.endsWith("Z"));
    });

  return distances.reduce((a, b) => lcm(a, b));
}

const tstart: bigint = process.hrtime.bigint();
const p1: number = part1();
const tpart: bigint = process.hrtime.bigint();
const p2: number = part2();
const tend: bigint = process.hrtime.bigint();

console.log(`Part 1: ${p1} (${Number(tpart - tstart) / 1e6}ms)`);
console.log(`Part 2: ${p2} (${Number(tend - tpart) / 1e6}ms)`);
console.log(`Total time: ${Number(tend - tstart) / 1e6}ms`);
