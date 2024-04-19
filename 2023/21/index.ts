import * as fs from "fs";

type Grid = string[][];
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

  static all(): Coordinate[] {
    return [Direction.U, Direction.D, Direction.L, Direction.R];
  }

  static add(a: Coordinate, b: Coordinate): Coordinate {
    return [a[0] + b[0], a[1] + b[1]];
  }

  static normalize(a: Coordinate): Coordinate {
    return [Math.sign(a[0]), Math.sign(a[1])];
  }

  static adjacent(a: Coordinate): Coordinate[] {
    return Direction.all().map((d) => Direction.add(a, d));
  }

  static valid(grid: Grid, coord: Coordinate): boolean {
    return (
      coord[0] >= 0 &&
      coord[0] < grid[0].length &&
      coord[1] >= 0 &&
      coord[1] < grid.length
    );
  }
}

// since Coordinates are small numbers, we encode them into a single
// bigger number to index with. As numbers get larger, the width allocated
// to each can be increased to prevent information loss.
function hash(coord: Coordinate): number {
  return (coord[0] << 8) | coord[1];
}

function puhash(coord: Coordinate, pu: Coordinate): number {
  return (coord[0] << 24) | (coord[1] << 16) | (pu[0] << 8) | pu[1];
}

interface Step {
  coords: Coordinate;
  from: Coordinate;
  pu: Coordinate;
  steps: number;
}

function walk(grid: Grid, start: Coordinate, steps: number): number {
  const visited: Set<number> = new Set<number>();
  let plots: number = 0;

  // [Coordinate, distance]
  const queue: Step[] = [{ coords: start, pu: [0, 0], from: [0, 0], steps: 0 }];
  while (queue.length > 0) {
    const step: Step = queue.shift()!;
    const current: Coordinate = step.coords;
    let pu: Coordinate = step.pu;

    // handle each neighboring plot only if it would
    // stay within the required step count.
    const next: number = step.steps + 1;
    if (next <= steps) {
      Direction.all().forEach((d) => {
        let p: Coordinate = Direction.add(current, d);
        // new universe
        if (!Direction.valid(grid, p)) {
          pu = Direction.add(pu, d);
          if (pu == step.from) return;
          if (p[0] > grid[0].length - 1) p = [0, p[1]];
          if (p[0] < 0) p = [grid[0].length - 1, p[1]];
          if (p[1] > grid.length - 1) p = [p[0], 0];
          if (p[1] < 0) p = [p[0], grid.length - 1];
        }

        // skip rocks
        if (grid[p[1]][p[0]] === "#") return;

        // be proactive and don't queue plots we've
        // already been too; cuts the runtime by about half.
        const key: number = puhash(p, pu);
        if (visited.has(key)) return;
        else visited.add(key);

        // track alternating steps
        // if the steps is odd, then we only track odd plots
        // if the steps is even, then we only track even plots
        if (next % 2 === steps % 2) plots++;

        queue.push({ coords: p, pu: pu, from: step.pu, steps: next });
      });
    }
  }

  return plots;
}

function part1(input: string[]): number {
  const grid: Grid = [];
  let start: Coordinate = [-1, -1];
  input.forEach((line, y) => {
    if (!line) return; // skip empty lines

    grid[y] = [];
    line.split("").forEach((p, x) => {
      if (p === "S") start = [x, y];
      grid[y][x] = p;
    });
  });

  return walk(grid, start, 64);
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
