import * as fs from "fs";

type Grid = string[][];
type Coordinate = [number, number]; // [x, y]

class Direction {
  static UP: Coordinate = [0, -1];
  static DOWN: Coordinate = [0, 1];
  static LEFT: Coordinate = [-1, 0];
  static RIGHT: Coordinate = [1, 0];
  static cardinal(): Coordinate[] {
    return [this.UP, this.DOWN, this.LEFT, this.RIGHT];
  }

  static fromArrow(arrow: string): Coordinate | undefined {
    if (arrow === "^") return Direction.UP;
    if (arrow === "v") return Direction.DOWN;
    if (arrow === "<") return Direction.LEFT;
    if (arrow === ">") return Direction.RIGHT;
  }
}

interface Node {
  coords: Coordinate;
  distance: number;
  seen: Set<number>;
}

function hash(node: Node): number {
  return (node.coords[0] << 8) | node.coords[1];
}

function validCoordinate(grid: Grid, coord: Coordinate): boolean {
  return (
    coord[0] >= 0 &&
    coord[0] < grid[0].length &&
    coord[1] >= 0 &&
    coord[1] < grid.length
  );
}

function addCoordinates(a: Coordinate, b: Coordinate): Coordinate {
  return [a[0] + b[0], a[1] + b[1]];
}

function compareCoordinats(a: Coordinate, b: Coordinate): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

function walk(
  grid: Grid,
  start: Coordinate,
  end: Coordinate,
  slope: boolean
): number {
  const distances: Map<number, number> = new Map<number, number>();
  const steps: number[] = [];
  const queue: Node[] = [
    {
      coords: start,
      distance: 0,
      seen: new Set<number>(),
    },
  ];

  while (queue.length > 0) {
    const node: Node = queue.shift()!;
    const coords: Coordinate = node.coords;

    // skip out of bound nodes
    if (!validCoordinate(grid, coords)) continue;

    // unique ID for node
    const key: number = hash(node);

    // have we encountered this node at a further distance already?
    // if so, we can stop here, otherwise this is the new furthest distance
    if (distances.has(key) && distances.get(key)! >= node.distance) continue;
    distances.set(key, node.distance);

    // if we've already seen this node, skip it
    if (node.seen.has(key)) continue;
    node.seen.add(key);

    // if we hit the end then track the final distance
    if (compareCoordinats(node.coords, end)) {
      steps.push(node.distance);
      continue;
    }

    Direction.cardinal().forEach((d) => {
      const next: Coordinate = addCoordinates(node.coords, d);
      if (!validCoordinate(grid, next)) return;

      // skip rocks
      if (grid[next[1]][next[0]] === "#") return;

      // if we hit a slope then we need need to move in that direction
      const a = Direction.fromArrow(grid[next[1]][next[0]]);
      if (slope && a && a != d) return;

      queue.push({
        coords: next,
        distance: node.distance + 1,
        seen: new Set<number>(node.seen), // new instance of Set for each path
      });
    });
  }
  return Math.max(...steps);
}

function part1(input: string[]): number {
  const grid: Grid = [];
  let start: Coordinate = [0, 0];
  input.forEach((line, y) => {
    if (!line) return; // skip empty lines
    grid[y] = line.split("");
    if (y === 0) {
      start = [grid[y].indexOf("."), 0];
    }
  });
  const end: Coordinate = [grid[grid.length - 1].indexOf("."), grid.length - 1];
  return walk(grid, start, end, true);
}

function part2(input: string[]): number {
  const grid: Grid = [];
  let start: Coordinate = [0, 0];
  input.forEach((line, y) => {
    if (!line) return; // skip empty lines
    grid[y] = line.split("");
    if (y === 0) {
      start = [grid[y].indexOf("."), 0];
    }
  });
  const end: Coordinate = [grid[grid.length - 1].indexOf("."), grid.length - 1];
  return walk(grid, start, end, false);
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
