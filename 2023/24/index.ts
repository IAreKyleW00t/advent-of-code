import * as fs from "fs";

type Vector = [number, number, number];

interface Hail {
  pos: Vector;
  v: Vector;
}

function mulVector(a: Vector, b: number): Vector {
  return [a[0] * b, a[1] * b, a[2] * b];
}

function addVector(a: Vector, b: Vector): Vector {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function move(hail: Hail, ns: number): Vector {
  return addVector(hail.pos, mulVector(hail.v, ns));
}

function part1(input: string[]): number {
  const hailstones: Hail[] = [];
  input.forEach((line) => {
    if (!line) return; // skip empty lines
    const split: string[] = line.split(" @ ");
    hailstones.push({
      pos: split[0].split(", ").map((s) => parseInt(s)) as Vector,
      v: split[1].split(", ").map((s) => parseInt(s)) as Vector,
    });
  });
  console.log(hailstones);
  return 0;
}

function part2(input: string[]): number {
  let sum: number = 0;

  input.forEach((line) => {
    if (!line) return; // skip empty lines
  });
  return sum;
}

const stdin: string[] = fs.readFileSync(0).toString().split(/\r?\n/);
const tstart: bigint = process.hrtime.bigint();
const p1: number = part1(stdin);
const tpart: bigint = process.hrtime.bigint();
const p2: number = part2(stdin);
const tend: bigint = process.hrtime.bigint();

console.log(`Part 1: ${p1} (${Number(tpart - tstart) / 1e6}ms)`);
console.log(`Part 2: ${p2} (${Number(tend - tpart) / 1e6}ms)`);
console.log(`Total time: ${Number(tend - tstart) / 1e6}ms`);
