import * as fs from "fs";

const stdin: string = fs.readFileSync(0).toString();

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

  isValidStep(tile: Tile, types: TileType[] = ["."]): boolean {
    return !types.includes(tile.type) && !tile.visited;
  }

  add(tile: Tile, x: number, y: number): void {
    if (tile.type === "S") this.start = tile;
    if (!this.tiles[y]) this.tiles[y] = [];
    this.tiles[y][x] = tile;
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

  step(from: Tile): Tile {
    const y = from.coords[0];
    const x = from.coords[1];
    let next: Tile, prev: Tile;
    switch (from.type) {
      case "|":
        next = this.tiles[y + 1][x];
        prev = this.tiles[y - 1][x];
        if (this.isValidStep(next)) return next;
        else if (this.isValidStep(prev)) return prev;
      case "-":
        next = this.tiles[y][x + 1];
        prev = this.tiles[y][x - 1];
        if (this.isValidStep(next)) return next;
        else if (this.isValidStep(prev)) return prev;
      case "L":
        next = this.tiles[y - 1][x];
        prev = this.tiles[y][x + 1];
        if (this.isValidStep(next)) return next;
        else if (this.isValidStep(prev)) return prev;
      case "J":
        next = this.tiles[y - 1][x];
        prev = this.tiles[y][x - 1];
        if (this.isValidStep(next)) return next;
        else if (this.isValidStep(prev)) return prev;
      case "7":
        next = this.tiles[y][x - 1];
        prev = this.tiles[y + 1][x];
        if (this.isValidStep(next)) return next;
        else if (this.isValidStep(prev)) return prev;
      case "F":
        next = this.tiles[y][x + 1];
        prev = this.tiles[y + 1][x];
        if (this.isValidStep(next)) return next;
        else if (this.isValidStep(prev)) return prev;
      case "S":
        // up/down
        next = this.tiles[y + 1][x];
        prev = this.tiles[y - 1][x];
        if (this.isValidStep(next, [".", "7", "F"])) return next;
        else if (this.isValidStep(prev, [".", "L", "J"])) return prev;

        // left/right
        next = this.tiles[y][x + 1];
        prev = this.tiles[y][x - 1];
        if (this.isValidStep(next, [".", "|", "F"])) return next;
        else if (this.isValidStep(prev, [".", "-", "J"])) return prev;
      default:
        return this.tiles[y][x];
    }
  }
}

function pprint(tile: Tile): string {
  return tile.type
    .replace("-", "═")
    .replace("|", "║")
    .replace("7", "╗")
    .replace("J", "╝")
    .replace("F", "╔")
    .replace("L", "╚");
}

function part1(): number {
  const grid: Grid = new Grid();

  stdin.split(/\r?\n/).forEach((line, y) => {
    if (!line) return; // skip empty lines

    line.split("").forEach((char, x) => {
      const tile = { coords: [y, x] as Coordinate, type: char as TileType };
      grid.add(tile, x, y);
    });
  });

  const distance = grid.walk();
  return Math.ceil(distance / 2);
}

function part2(): number {
  const grid: Grid = new Grid();

  stdin.split(/\r?\n/).forEach((line, y) => {
    if (!line) return; // skip empty lines

    line.split("").forEach((char, x) => {
      const tile = { coords: [y, x] as Coordinate, type: char as TileType };
      grid.add(tile, x, y);
    });
  });

  grid.walk();

  let count: number = 0;
  grid.tiles.forEach((row) => {
    row.forEach((tile) => {
      // TODO: Determine if tile is within path
      if (grid.path.includes(tile)) process.stdout.write(pprint(tile));
      else process.stdout.write(".");
    });
    console.log();
  });
  return count;
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
