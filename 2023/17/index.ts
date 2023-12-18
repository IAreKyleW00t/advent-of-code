import * as fs from "fs";
import { Heap } from "heap-js";

type Grid = number[][];
type Coordinate = [number, number]; // [x, y]

class Direction {
  static UP: Coordinate = [0, -1];
  static DOWN: Coordinate = [0, 1];
  static LEFT: Coordinate = [-1, 0];
  static RIGHT: Coordinate = [1, 0];
  static all(): Coordinate[] {
    return [this.UP, this.DOWN, this.LEFT, this.RIGHT];
  }
}

interface Node {
  coords: Coordinate;
  direction: Coordinate;
  consecutive: number;
  heat: number;
}

// using strings as keys is VERY slow... Since these are all small
// numbers we can shift the bits to encode this into a single
// 32-bit integer, which should be OK for this dataset.
function hash(node: Node): number {
  return (
    (node.coords[0] << 24) |
    (node.coords[1] << 16) |
    ((node.direction[0] & 3) << 14) |
    ((node.direction[1] & 3) << 12) |
    node.consecutive
  );
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

function dijkstra(
  grid: Grid,
  start: Coordinate,
  end: Coordinate,
  minSteps: number,
  maxSteps: number
): number {
  const heap: Heap<Node> = new Heap<Node>((a, b) => a.heat - b.heat);
  const visited: Set<number> = new Set<number>();

  heap.push({ coords: start, direction: [0, 0], heat: 0, consecutive: 0 });
  while (!heap.isEmpty()) {
    const node: Node = heap.pop()!; // ! allows undefined

    // if we've already seen this node, skip it
    const key: number = hash(node);
    if (visited.has(key)) continue;

    // the consecutive counter is added the end of the key directly,
    // so we can increment the existing key to prune out any possible paths
    // that get to the same node in a higher number of moves.
    if (node.consecutive >= minSteps) {
      for (let i = 0; i <= maxSteps - node.consecutive; i++) {
        visited.add(key + i);
      }
    } else visited.add(key);

    // if we hit the end (and have hit the step requirement)
    if (compareCoordinats(node.coords, end) && node.consecutive >= minSteps) {
      return node.heat;
    }

    Direction.all().forEach((dir) => {
      const next: Coordinate = addCoordinates(node.coords, dir);

      // check if we're moving in the same direction still
      const straight: boolean = compareCoordinats(node.direction, dir);

      // skip out of bound nodes
      if (!validCoordinate(grid, next)) return;

      // don't go backwards
      if (compareCoordinats(dir, [-node.direction[0], -node.direction[1]])) {
        return;
      }

      // check if we hit the step requirement/limit
      if (straight && node.consecutive === maxSteps) return;
      if (
        !straight &&
        node.consecutive < minSteps &&
        !compareCoordinats(node.coords, [0, 0])
      ) {
        return;
      }

      // add the node to the heap to process
      heap.push({
        coords: next,
        direction: dir,
        consecutive: straight ? node.consecutive + 1 : 1,
        heat: node.heat + grid[next[1]][next[0]],
      });
    });
  }
  return -1; // no path found
}

function part1(input: string[]): number {
  const grid: Grid = [];
  input.forEach((line, y) => {
    if (!line) return; // skip empty lines
    grid[y] = line.split("").map((s) => parseInt(s));
  });

  return dijkstra(grid, [0, 0], [grid[0].length - 1, grid.length - 1], 0, 3);
}

function part2(input: string[]): number {
  const grid: Grid = [];
  input.forEach((line, y) => {
    if (!line) return; // skip empty lines
    grid[y] = line.split("").map((s) => parseInt(s));
  });

  return dijkstra(grid, [0, 0], [grid[0].length - 1, grid.length - 1], 4, 10);
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
