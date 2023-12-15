import * as fs from "fs";

type TileType = "|" | "-" | "L" | "J" | "7" | "F" | "." | "S";
type Coordinate = [number, number];

interface Tile {
  coords: Coordinate;
  type: TileType;
  visited?: boolean;
  filled?: boolean;
}

class Grid {
  start: Tile = { type: "S", coords: [0, 0] };
  tiles: Tile[][] = [];
  path: Tile[] = [];
  prevCorner: Tile | undefined;

  add(tile: Tile, x: number, y: number): void {
    if (tile.type === "S") this.start = tile;
    if (!this.tiles[y]) this.tiles[y] = [];
    this.tiles[y][x] = tile;
  }

  validCoordinates(coords: Coordinate): boolean {
    return (
      coords[0] >= 0 &&
      coords[0] < this.tiles.length &&
      coords[1] >= 0 &&
      coords[1] < this.tiles[coords[0]].length
    );
  }

  validStep(tile: Tile, types: TileType[] = ["."]): boolean {
    return !types.includes(tile.type) && !tile.visited;
  }

  // Shoelace theorem (triangle formula)
  // https://en.wikipedia.org/wiki/Shoelace_formula
  area(): number {
    let sum: number = 0;
    for (let i = 0; i < this.path.length; i++) {
      const j: number = (i + 1) % this.path.length;
      sum +=
        this.path[i].coords[1] * this.path[j].coords[0] -
        this.path[i].coords[0] * this.path[j].coords[1];
    }
    return sum / 2;
  }

  // Pick's theorem
  // https://en.wikipedia.org/wiki/Pick%27s_theorem
  inner(): number {
    return this.area() - this.path.length / 2 + 1;
  }

  step(from: Tile): Tile {
    const y = from.coords[0];
    const x = from.coords[1];
    let next: Tile, prev: Tile;
    switch (from.type) {
      case "|":
        // up
        if (this.validCoordinates([y - 1, x])) {
          prev = this.tiles[y - 1][x];
          if (this.validStep(prev)) return prev;
        }
        // down
        if (this.validCoordinates([y + 1, x])) {
          next = this.tiles[y + 1][x];
          if (this.validStep(next)) return next;
        }
        break;
      case "-":
        /// left
        if (this.validCoordinates([y, x - 1])) {
          prev = this.tiles[y][x - 1];
          if (this.validStep(prev)) return prev;
        }
        // right
        if (this.validCoordinates([y, x + 1])) {
          next = this.tiles[y][x + 1];
          if (this.validStep(next)) return next;
        }
        break;
      case "L":
        // up
        if (this.validCoordinates([y - 1, x])) {
          next = this.tiles[y - 1][x];
          if (this.validStep(next)) return next;
        }
        // left
        if (this.validCoordinates([y, x + 1])) {
          prev = this.tiles[y][x + 1];
          if (this.validStep(prev)) return prev;
        }
        break;
      case "J":
        // up
        if (this.validCoordinates([y - 1, x])) {
          next = this.tiles[y - 1][x];
          if (this.validStep(next)) return next;
        }
        // right
        if (this.validCoordinates([y, x - 1])) {
          prev = this.tiles[y][x - 1];
          if (this.validStep(prev)) return prev;
        }
        break;
      case "7":
        // right
        if (this.validCoordinates([y, x - 1])) {
          next = this.tiles[y][x - 1];
          if (this.validStep(next)) return next;
        }
        // down
        if (this.validCoordinates([y + 1, x])) {
          prev = this.tiles[y + 1][x];
          if (this.validStep(prev)) return prev;
        }
        break;
      case "F":
        // left
        if (this.validCoordinates([y, x + 1])) {
          next = this.tiles[y][x + 1];
          if (this.validStep(next)) return next;
        }
        // down
        if (this.validCoordinates([y + 1, x])) {
          prev = this.tiles[y + 1][x];
          if (this.validStep(prev)) return prev;
        }
        break;
      case "S":
        // up/down
        if (this.validCoordinates([y + 1, x])) {
          next = this.tiles[y + 1][x];
          if (this.validStep(next, [".", "7", "F"])) return next;
        }
        if (this.validCoordinates([y - 1, x])) {
          prev = this.tiles[y - 1][x];
          if (this.validStep(prev, [".", "L", "J"])) return prev;
        }

        // left/right
        if (this.validCoordinates([y, x + 1])) {
          next = this.tiles[y][x + 1];
          if (this.validStep(next, [".", "|", "F"])) return next;
        }
        if (this.validCoordinates([y, x - 1])) {
          prev = this.tiles[y][x - 1];
          if (this.validStep(prev, [".", "-", "J"])) return prev;
        }
        break;
      default:
        return this.tiles[y][x];
    }
    return from; // move no where
  }

  walk(): number {
    let tile = this.start;
    while (!tile.visited) {
      tile.visited = true;
      this.path.push(tile);
      tile = this.step(tile);
    }
    return this.path.length; // distance walked
  }
}

function part1(input: string[]): number {
  const grid: Grid = new Grid();

  input.forEach((line, y) => {
    if (!line) return; // skip empty lines

    line.split("").forEach((char, x) => {
      const tile = { coords: [y, x] as Coordinate, type: char as TileType };
      grid.add(tile, x, y);
    });
  });

  return Math.ceil(grid.walk() / 2);
}

function part2(input: string[]): number {
  const grid: Grid = new Grid();

  input.forEach((line, y) => {
    if (!line) return; // skip empty lines

    line.split("").forEach((char, x) => {
      const tile = { coords: [y, x] as Coordinate, type: char as TileType };
      grid.add(tile, x, y);
    });
  });

  grid.walk();
  return grid.inner();
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
