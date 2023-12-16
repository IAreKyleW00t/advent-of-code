import * as fs from "fs";

type Direction = "U" | "D" | "L" | "R";
type Tile = "." | "/" | "\\" | "|" | "-" | "#";
type Grid = Tile[][];

interface Mirror {
  x: number;
  y: number;
  type: Tile;
}

interface Beam {
  x: number;
  y: number;
  direction: Direction;
  next?: Mirror;
}

// TODO: Energize up to edge
function energize(grid: Grid, beam: Beam, mirror: Mirror): void {
  // change cols
  const ymin: number = Math.min(beam.y, mirror.y);
  const ymax: number = Math.max(beam.y, mirror.y);
  for (let i = ymin; i <= ymax; i++) grid[i][beam.x] = "#";

  // change rows
  const xmin: number = Math.min(beam.x, mirror.x);
  const xmax: number = Math.max(beam.x, mirror.x);
  for (let i = xmin; i <= xmax; i++) grid[beam.y][i] = "#";
}

function next(beam: Beam, mirrors: Mirror[]): Mirror {
  switch (beam.direction) {
    case "U":
      return mirrors.filter((m) => m.x === beam.x && m.y < beam.y)[0];
    case "D":
      return mirrors.filter((m) => m.x === beam.x && m.y > beam.y)[0];
    case "L":
      return mirrors.filter((m) => m.y === beam.y && m.x < beam.x)[0];
    case "R":
      return mirrors.filter((m) => m.y === beam.y && m.x > beam.x)[0];
  }
}

// TODO: handle \ and /
function beam(grid: Grid, mirrors: Mirror[], beams: Beam[]): void {
  // find the next location of each beam and energize blocks between
  while (beams.length > 0) {
    let b: Beam = beams[0];
    console.log(beams);
    console.log(`next => ${b.next?.type}`);
    pprint(grid);

    b.next = next(b, mirrors);
    if (b.next) energize(grid, b, b.next);

    if (b.next?.type === "|") {
      if (["L", "R"].includes(b.direction)) {
        // split vertically
        beams[0] = { x: b.next.x, y: b.next.y, direction: "U" };
        beams.push({ x: b.next.x, y: b.next.y, direction: "D" });
      } else {
        beams[0] = { x: b.next.x, y: b.next.y, direction: b.direction };
      }
    } else if (b.next?.type === "-") {
      if (["U", "D"].includes(b.direction)) {
        // split horizontally
        beams[0] = { x: b.next.x, y: b.next.y, direction: "R" };
        beams.push({ x: b.next.x, y: b.next.y, direction: "L" });
      } else {
        beams[0] = { x: b.next.x, y: b.next.y, direction: b.direction };
      }
    } else beams.shift();
  }
}

function pprint(grid: Grid) {
  grid.forEach((r) => console.log(r.join("")));
  console.log();
}

function part1(input: string[]): number {
  const grid: Grid = [];
  const mirrors: Mirror[] = [];
  input.forEach((line, y) => {
    if (!line) return; // skip empty lines

    grid[y] = [];
    line.split("").forEach((c, x) => {
      grid[y][x] = c as Tile;
      if (["\\", "/", "|", "-"].includes(c))
        mirrors.push({ x: x, y: y, type: c as Tile });
    });
  });

  // Create the initial beam in the top-left, moving right
  const initial: Beam[] = [{ x: 0, y: 0, direction: "R" }];
  beam(grid, mirrors, initial);

  let total: number = 0;
  return total;
}

function part2(input: string[]): number {
  let total: number = 0;
  input.forEach((line) => {
    if (!line) return; // skip empty lines
  });
  return total;
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
