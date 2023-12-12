import * as fs from "fs";

const stdin: string = fs.readFileSync(0).toString();

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

  travel(a: Coordinate, b: Coordinate, multiplier: number = 1): number {
    let distance: number = 0;
    for (let i = Math.min(a.y, b.y); i < Math.max(a.y, b.y); i++) {
      if (this.expandedRows.includes(i)) distance += multiplier;
      else distance += 1;
    }
    for (let i = Math.min(a.x, b.x); i < Math.max(a.x, b.x); i++) {
      if (this.expandedCols.includes(i)) distance += multiplier;
      else distance += 1;
    }
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

function part1(): number {
  const universe: Universe = new Universe();

  stdin.split(/\r?\n/).forEach((line, y) => {
    if (!line) return; // skip empty lines

    line.split("").forEach((char, x) => {
      const coord = { type: char, x: x, y: y } as Coordinate;
      universe.add(coord);
    });
  });

  universe.analyze();
  return universe.traverse(2);
}

function part2(): number {
  const universe: Universe = new Universe();

  stdin.split(/\r?\n/).forEach((line, y) => {
    if (!line) return; // skip empty lines

    line.split("").forEach((char, x) => {
      const coord = { type: char, x: x, y: y } as Coordinate;
      universe.add(coord);
    });
  });

  universe.analyze();
  return universe.traverse(1_000_000);
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);