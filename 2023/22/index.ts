import * as fs from "fs";

type Vector = [number, number, number]; // [x,y,z]
type Brick = [Vector, Vector]; // [start,end]

function part1(input: string[]): number {
  const bricks: Brick[] = [];
  input.forEach((line) => {
    if (!line) return; // skip empty lines
    const sides: Vector[] = line
      .split("~")
      .map((s) => s.split(","))
      .map((s) => s.map((n) => parseInt(n)))
      .map((c) => c as Vector);
    bricks.push([sides[0], sides[1]]);
  });
  console.log(bricks);
  return 0;
}

function part2(input: string[]): number {
  input.forEach((line) => {
    if (!line) return; // skip empty lines
  });
  return 0;
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
