import * as fs from "fs";

type CoordinateType = "#" | ".";

interface Coordinate {
  type: CoordinateType;
  x: number;
  y: number;
}

class Universe {
  space: Coordinate[][] = [];
  galaxies: Coordinate[] = [];
  expandedRows: number[] = [];
  expandedCols: number[] = [];

  add(coord: Coordinate): void {
    if (coord.type === "#") this.galaxies.push(coord);
    if (!this.space[coord.y]) this.space[coord.y] = [];
    this.space[coord.y][coord.x] = coord;
  }

  pairs(): [Coordinate, Coordinate][] {
    const pairs: [Coordinate, Coordinate][] = [];
    for (let i = 0; i < this.galaxies.length - 1; i++) {
      for (let j = i + 1; j < this.galaxies.length; j++) {
        pairs.push([this.galaxies[i], this.galaxies[j]]);
      }
    }
    return pairs;
  }

  analyze(): void {
    const count: number[] = new Array<number>(this.space.length).fill(0);
    this.space.forEach((row, y) => {
      row.forEach((coord, x) => {
        if (coord.type === "#") count[x]++;
      });

      if (row.filter((coord) => coord.type === "#").length === 0) {
        this.expandedRows.push(y);
      }
    });

    count.forEach((count, i) => {
      if (count === 0) this.expandedCols.push(i);
    });
  }

  distance(a: Coordinate, b: Coordinate): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  travel(a: Coordinate, b: Coordinate, multiplier: number = 1): number {
    // start with the normal distance between galaxies
    let distance: number = this.distance(a, b);

    // check if we would have crossed any expanded rows
    this.expandedRows.forEach((i) => {
      const ymin: number = Math.min(a.y, b.y);
      const ymax: number = Math.max(a.y, b.y);
      if (i >= ymin && i <= ymax) {
        distance += multiplier - 1;
      }
    });

    // check if we would have crossed any expanded cols
    this.expandedCols.forEach((i) => {
      const xmin: number = Math.min(a.x, b.x);
      const xmax: number = Math.max(a.x, b.x);
      if (i >= xmin && i <= xmax) {
        distance += multiplier - 1;
      }
    });
    return distance;
  }

  traverse(multiplier: number = 1): number {
    return this.pairs().reduce(
      (distance, pair) =>
        (distance += this.travel(pair[0], pair[1], multiplier)),
      0
    );
  }
}

function part1(input: string[]): number {
  const universe: Universe = new Universe();

  input.forEach((line, y) => {
    if (!line) return; // skip empty lines

    line.split("").forEach((char, x) => {
      const coord = { type: char, x: x, y: y } as Coordinate;
      universe.add(coord);
    });
  });

  universe.analyze();
  return universe.traverse(2);
}

function part2(input: string[]): number {
  const universe: Universe = new Universe();

  input.forEach((line, y) => {
    if (!line) return; // skip empty lines

    line.split("").forEach((char, x) => {
      const coord = { type: char, x: x, y: y } as Coordinate;
      universe.add(coord);
    });
  });

  universe.analyze();
  return universe.traverse(1_000_000);
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
