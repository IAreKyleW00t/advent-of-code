import * as fs from "fs";

const stdin: string = fs.readFileSync(0).toString();

type TileType = "|" | "-" | "L" | "J" | "7" | "F" | "." | "S";
type Coordinate = [number, number];

interface Tile {
  coords: Coordinate;
  type: TileType;
  visited?: boolean;
}

class Grid {
  start: Tile = { type: "S", coords: [0, 0] };
  tiles: Tile[][] = [];
  path: Tile[] = [];

  validCoordinates(coords: Coordinate): boolean {
    return (
      coords[0] >= 0 &&
      coords[0] < this.tiles.length &&
      coords[1] >= 0 &&
      coords[1] < this.tiles[coords[0]].length
    );
  }

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
        if (this.validCoordinates([y + 1, x])) {
          next = this.tiles[y + 1][x];
          if (this.isValidStep(next)) return next;
        }
        if (this.validCoordinates([y - 1, x])) {
          prev = this.tiles[y - 1][x];
          if (this.isValidStep(prev)) return prev;
        }
      case "-":
        if (this.validCoordinates([y, x + 1])) {
          next = this.tiles[y][x + 1];
          if (this.isValidStep(next)) return next;
        }
        if (this.validCoordinates([y, x - 1])) {
          prev = this.tiles[y][x - 1];
          if (this.isValidStep(prev)) return prev;
        }
      case "L":
        if (this.validCoordinates([y - 1, x])) {
          next = this.tiles[y - 1][x];
          if (this.isValidStep(next)) return next;
        }
        if (this.validCoordinates([y, x + 1])) {
          prev = this.tiles[y][x + 1];
          if (this.isValidStep(prev)) return prev;
        }
      case "J":
        if (this.validCoordinates([y - 1, x])) {
          next = this.tiles[y - 1][x];
          if (this.isValidStep(next)) return next;
        }
        if (this.validCoordinates([y, x - 1])) {
          prev = this.tiles[y][x - 1];
          if (this.isValidStep(prev)) return prev;
        }
      case "7":
        if (this.validCoordinates([y, x - 1])) {
          next = this.tiles[y][x - 1];
          if (this.isValidStep(next)) return next;
        }
        if (this.validCoordinates([y + 1, x])) {
          prev = this.tiles[y + 1][x];
          if (this.isValidStep(prev)) return prev;
        }
      case "F":
        if (this.validCoordinates([y, x + 1])) {
          next = this.tiles[y][x + 1];
          if (this.isValidStep(next)) return next;
        }
        if (this.validCoordinates([y + 1, x])) {
          prev = this.tiles[y + 1][x];
          if (this.isValidStep(prev)) return prev;
        }
      case "S":
        // up/down
        if (this.validCoordinates([y + 1, x])) {
          next = this.tiles[y + 1][x];
          if (this.isValidStep(next, [".", "7", "F"])) return next;
        }
        if (this.validCoordinates([y - 1, x])) {
          prev = this.tiles[y - 1][x];
          if (this.isValidStep(prev, [".", "L", "J"])) return prev;
        }

        // left/right
        if (this.validCoordinates([y, x + 1])) {
          next = this.tiles[y][x + 1];
          if (this.isValidStep(next, [".", "|", "F"])) return next;
        }
        if (this.validCoordinates([y, x - 1])) {
          prev = this.tiles[y][x - 1];
          if (this.isValidStep(prev, [".", "-", "J"])) return prev;
        }
      default:
        return this.tiles[y][x];
    }
  }
}

function floodfill(grid: Grid, coord?: Coordinate): number {
  const stack: Coordinate[] = [];
  stack.push(coord ?? grid.start.coords);

  while (stack.length > 0) {
    let coords = stack.pop();
    if (!coords) break;

    const y = coords[0];
    const x = coords[1];

    if (!grid.validCoordinates(coords)) continue;
    if (grid.tiles[y][x].visited) continue;
    grid.tiles[y][x].visited = true;

    stack.push([y + 1, x]);
    stack.push([y - 1, x]);
    stack.push([y, x + 1]);
    stack.push([y, x - 1]);
  }

  return grid.tiles.reduce(
    (sum, row) =>
      (sum += row
        .filter((tile) => tile.visited)
        .reduce((sum) => (sum += 1), 0)),
    0
  );
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
  const fill = floodfill(grid);

  let count: number = 0;
  grid.tiles.forEach((row) => {
    row.forEach((tile) => {
      // TODO: track each inner tile and run fill() on it
      if (grid.path.includes(tile)) process.stdout.write(pprint(tile));
      else process.stdout.write(".");
    });
    console.log();
  });

  const path = grid.path.length;
  return fill - path;
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
