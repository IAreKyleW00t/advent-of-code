import * as fs from "fs";

const stdin: string = fs.readFileSync(0).toString();

type CoordinateType = "#" | ".";

interface Coordinate {
  type: CoordinateType;
  value?: number;
  x: number;
  y: number;
}

class Universe {
  space: Coordinate[][] = [];
  galaxies: Coordinate[] = [];
  expandedRows: number[] = [];
  expandedCols: number[] = [];

  add(coord: Coordinate): void {
    if (coord.type === "#") {
      coord.value = this.galaxies.length + 1;
      this.galaxies.push(coord);
    } else coord.value = 0;
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

  expand(): void {
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

  distance(multiplier: number = 1): number {
    let total: number = 0;
    this.pairs().forEach((pair) => {
      let start = Math.min(pair[0].y, pair[1].y);
      let end = Math.max(pair[0].y, pair[1].y);
      for (let i = start; i < end; i++) {
        if (this.expandedRows.includes(i)) {
          total += multiplier;
        } else {
          total += 1;
        }
      }

      start = Math.min(pair[0].x, pair[1].x);
      end = Math.max(pair[0].x, pair[1].x);
      for (let i = start; i < end; i++) {
        if (this.expandedCols.includes(i)) {
          total += multiplier;
        } else {
          total += 1;
        }
      }
    });
    return total;
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

  universe.expand();
  return universe.distance(2);
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

  universe.expand();
  return universe.distance(1_000_000);
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
