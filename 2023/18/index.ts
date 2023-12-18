import * as fs from "fs";

type Coordinate = [number, number]; // [x, y]

class Direction {
  static U: Coordinate = [0, -1];
  static D: Coordinate = [0, 1];
  static L: Coordinate = [-1, 0];
  static R: Coordinate = [1, 0];
  static from(s: string | number): Coordinate | undefined {
    if (s === "U" || s === 3) return this.U;
    else if (s === "D" || s === 1) return this.D;
    else if (s === "L" || s === 2) return this.L;
    else if (s === "R" || s === 0) return this.R;
    else return undefined;
  }
}

interface Plan {
  direction: Coordinate;
  length: number;
}

function addCoordinates(a: Coordinate, b: Coordinate): Coordinate {
  return [a[0] + b[0], a[1] + b[1]];
}

// Shoelace theorem (Trapezoid formula)
// https://en.wikipedia.org/wiki/Shoelace_formula
function shoelace(coords: Coordinate[]): number {
  let sum: number = 0;
  for (let i = 0; i < coords.length; i++) {
    const j: number = (i + 1) % coords.length;
    sum += (coords[i][1] + coords[j][1]) * (coords[i][0] - coords[j][0]);
  }
  return sum / 2;
}

// Pick's theorem
// https://en.wikipedia.org/wiki/Pick%27s_theorem
function picks(coords: Coordinate[], perimeter: number): number {
  return perimeter / 2 + shoelace(coords) + 1;
}

function dig(plan: Plan, pos: Coordinate): Coordinate {
  let length: number = plan.length;
  let newPos: Coordinate = pos;
  while (length > 0) {
    newPos = addCoordinates(newPos, plan.direction);
    length--;
  }
  return newPos;
}

function part1(input: string[]): number {
  const plots: Coordinate[] = [];
  let perimeter: number = 0;
  let pos: Coordinate = [0, 0];
  input.forEach((line) => {
    if (!line) return; // skip empty lines

    const m: RegExpMatchArray = line.match(/(U|D|L|R) (\d+) \(#(\w+)\)/)!;
    const plan: Plan = {
      direction: Direction.from(m[1])!,
      length: parseInt(m[2]),
    };
    plots.push(pos);
    pos = dig(plan, pos);
    perimeter += plan.length;
  });
  return picks(plots, perimeter);
}

function part2(input: string[]): number {
  const plots: Coordinate[] = [];
  let perimeter: number = 0;
  let pos: Coordinate = [0, 0];
  input.forEach((line) => {
    if (!line) return; // skip empty lines

    const m: RegExpMatchArray = line.match(/(U|D|L|R) (\d+) \(#(\w+)\)/)!;
    const plan: Plan = {
      direction: Direction.from(parseInt(m[3].slice(m[3].length - 1)))!,
      length: parseInt(m[3].slice(0, -1), 16),
    };
    plots.push(pos);
    pos = dig(plan, pos);
    perimeter += plan.length;
  });
  return picks(plots, perimeter);
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
