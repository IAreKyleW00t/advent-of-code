import * as fs from "fs";

type TileType = "|" | "-" | "L" | "J" | "7" | "F" | "." | "S";
type Coordinate = [number, number]; // [x, y]

class Direction {
  static UP: Coordinate = [0, -1];
  static DOWN: Coordinate = [0, 1];
  static LEFT: Coordinate = [-1, 0];
  static RIGHT: Coordinate = [1, 0];
  static all(): Coordinate[] {
    return [this.UP, this.DOWN, this.LEFT, this.RIGHT];
  }
  static add(a: Coordinate, b: Coordinate): Coordinate {
    return [a[0] + b[0], a[1] + b[1]];
  }
}

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

  // Shoelace theorem (triangle formula)
  // https://en.wikipedia.org/wiki/Shoelace_formula
  area(): number {
    let sum: number = 0;
    for (let i = 0; i < this.path.length; i++) {
      const j: number = (i + 1) % this.path.length;
      sum +=
        this.path[i].coords[0] * this.path[j].coords[1] -
        this.path[i].coords[1] * this.path[j].coords[0];
    }
    return sum / 2;
  }

  // Pick's theorem
  // https://en.wikipedia.org/wiki/Pick%27s_theorem
  inner(): number {
    return this.area() - this.path.length / 2 + 1;
  }

  add(tile: Tile, x: number, y: number): void {
    if (tile.type === "S") this.start = tile;
    if (!this.tiles[y]) this.tiles[y] = [];
    this.tiles[y][x] = tile;
  }

  validCoordinates(coords: Coordinate): boolean {
    return (
      coords[1] >= 0 &&
      coords[1] < this.tiles.length &&
      coords[0] >= 0 &&
      coords[0] < this.tiles[coords[1]].length
    );
  }

  validStep(tile: Tile, types: TileType[] = ["."]): boolean {
    return !types.includes(tile.type) && !tile.visited;
  }

  tryStep(coords: Coordinate, invalid?: TileType[]): Tile | undefined {
    if (this.validCoordinates(coords)) {
      const next: Tile = this.tiles[coords[1]][coords[0]];
      if (this.validStep(next, invalid)) return next;
    }
  }

  step(from: Tile): Tile {
    let next: Tile | undefined;
    if (from.type === "|") {
      // up/down
      next = this.tryStep(Direction.add(from.coords, Direction.UP));
      if (next) return next;
      next = this.tryStep(Direction.add(from.coords, Direction.DOWN));
      if (next) return next;
    } else if (from.type === "-") {
      // left/right
      next = this.tryStep(Direction.add(from.coords, Direction.LEFT));
      if (next) return next;
      next = this.tryStep(Direction.add(from.coords, Direction.RIGHT));
      if (next) return next;
    } else if (from.type === "L") {
      // up/right
      next = this.tryStep(Direction.add(from.coords, Direction.UP));
      if (next) return next;
      next = this.tryStep(Direction.add(from.coords, Direction.RIGHT));
      if (next) return next;
    } else if (from.type === "J") {
      // up/left
      next = this.tryStep(Direction.add(from.coords, Direction.UP));
      if (next) return next;
      next = this.tryStep(Direction.add(from.coords, Direction.LEFT));
      if (next) return next;
    } else if (from.type === "7") {
      // left/down
      next = this.tryStep(Direction.add(from.coords, Direction.LEFT));
      if (next) return next;
      next = this.tryStep(Direction.add(from.coords, Direction.DOWN));
      if (next) return next;
    } else if (from.type === "F") {
      // right/down
      next = this.tryStep(Direction.add(from.coords, Direction.RIGHT));
      if (next) return next;
      next = this.tryStep(Direction.add(from.coords, Direction.DOWN));
      if (next) return next;
    } else if (from.type === "S") {
      // up/down/left/right
      next = this.tryStep(Direction.add(from.coords, Direction.UP));
      if (next) return next;
      next = this.tryStep(Direction.add(from.coords, Direction.DOWN));
      if (next) return next;
      next = this.tryStep(Direction.add(from.coords, Direction.LEFT));
      if (next) return next;
      next = this.tryStep(Direction.add(from.coords, Direction.RIGHT));
      if (next) return next;
    }

    return from; // invalid, move no where
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
      const tile = { coords: [x, y] as Coordinate, type: char as TileType };
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
      const tile = { coords: [x, y] as Coordinate, type: char as TileType };
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
