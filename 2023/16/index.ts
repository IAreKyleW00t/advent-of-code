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

function nextDirections(
  direction: Direction,
  mirror: Mirror | undefined
): Direction[] {
  if (!mirror) return [direction];
  if (mirror.type === "/") {
    if (direction === "U") return ["R"];
    if (direction === "D") return ["L"];
    if (direction === "L") return ["D"];
    if (direction === "R") return ["U"];
  } else if (mirror.type === "\\") {
    if (direction === "U") return ["L"];
    if (direction === "D") return ["R"];
    if (direction === "L") return ["U"];
    if (direction === "R") return ["D"];
  } else if (mirror.type === "|") {
    if (["L", "R"].includes(direction)) return ["U", "D"];
  } else if (mirror.type === "-") {
    if (["U", "D"].includes(direction)) return ["L", "R"];
  }
  return [direction];
}

function startBeams(mirrors: Mirror[], initial: Beam): Beam[] {
  const mirror: Mirror | undefined = mirrors
    .filter((m) => m.x === initial.x && m.y === initial.y)
    .pop();
  return nextDirections(initial.direction, mirror).map((d) => ({
    x: initial.x,
    y: initial.y,
    direction: d,
  }));
}

function energize(grid: Grid, beam: Beam, mirror: Mirror | undefined): number {
  let xedge: number = mirror?.x ?? -1;
  let yedge: number = mirror?.y ?? -1;
  let count: number = 0; // tiles energized

  // handle edges
  if (yedge < 0 || xedge < 0) {
    if (beam.direction === "U") {
      yedge = 0;
      xedge = beam.x;
    } else if (beam.direction === "D") {
      yedge = grid.length - 1;
      xedge = beam.x;
    } else if (beam.direction === "L") {
      yedge = beam.y;
      xedge = 0;
    } else if (beam.direction === "R") {
      yedge = beam.y;
      xedge = grid[0].length - 1;
    }
  }

  // change rows
  const xmin: number = Math.min(beam.x, xedge);
  const xmax: number = Math.max(beam.x, xedge);
  for (let i = xmin; i <= xmax; i++) {
    if (grid[beam.y][i] !== "#") {
      count++;
      grid[beam.y][i] = "#";
    }
  }

  // change cols
  const ymin: number = Math.min(beam.y, yedge);
  const ymax: number = Math.max(beam.y, yedge);
  for (let i = ymin; i <= ymax; i++) {
    if (grid[i][beam.x] !== "#") count++;
    grid[i][beam.x] = "#";
  }
  return count;
}

function next(beam: Beam, mirrors: Mirror[]): Mirror | undefined {
  switch (beam.direction) {
    case "U":
      return mirrors.filter((m) => m.x === beam.x && m.y < beam.y).pop();
    case "D":
      return mirrors.filter((m) => m.x === beam.x && m.y > beam.y).shift();
    case "L":
      return mirrors.filter((m) => m.y === beam.y && m.x < beam.x).pop();
    case "R":
      return mirrors.filter((m) => m.y === beam.y && m.x > beam.x).shift();
  }
}

function beam(grid: Grid, mirrors: Mirror[], beams: Beam[]): number {
  const history: Set<string> = new Set<string>();
  let count: number = 0;
  while (beams.length > 0) {
    const b: Beam = beams[0];
    b.next = next(b, mirrors);

    // check if we've already been here
    // if so, the beam is a loop an we can stop processing it
    const key: string = `${b.x}:${b.y}:${b.direction}`;
    if (history.has(key)) {
      beams.shift();
      continue;
    }

    // energize the grid and then update the beams
    // to move in the new direction(s)
    count += energize(grid, b, b.next);
    if (b.next) {
      const d: Direction[] = nextDirections(b.direction, b.next);
      beams[0] = { x: b.next.x, y: b.next.y, direction: d[0] };
      if (d.length > 1) {
        beams.push({ x: b.next.x, y: b.next.y, direction: d[1] });
      }
    } else beams.shift(); // hit edge
    history.add(key);
  }
  return count;
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

  // initial beam in the top-left, accounting for mirrors
  const initial: Beam = { x: 0, y: 0, direction: "R" };
  const beams: Beam[] = startBeams(mirrors, initial);
  return beam(grid, mirrors, beams);
}

function part2(input: string[]): number {
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

  // initial beam at each column and row, accounting for mirrors
  const engergized: number[] = [];
  for (let i = 0; i < grid[0].length; i++) {
    // top
    let g: Grid = JSON.parse(JSON.stringify(grid));
    let initial: Beam = { x: i, y: 0, direction: "D" };
    let beams: Beam[] = startBeams(mirrors, initial);
    engergized.push(beam(g, mirrors, beams));

    // bottom
    g = JSON.parse(JSON.stringify(grid));
    initial = { x: i, y: grid[0].length - 1, direction: "U" };
    beams = startBeams(mirrors, initial);
    engergized.push(beam(g, mirrors, beams));
  }

  for (let i = 0; i < grid.length; i++) {
    // left
    let g: Grid = JSON.parse(JSON.stringify(grid));
    let initial: Beam = { x: 0, y: i, direction: "R" };
    let beams: Beam[] = startBeams(mirrors, initial);
    engergized.push(beam(g, mirrors, beams));

    // right
    g = JSON.parse(JSON.stringify(grid));
    initial = { x: grid.length - 1, y: i, direction: "L" };
    beams = startBeams(mirrors, initial);
    engergized.push(beam(g, mirrors, beams));
  }
  return Math.max(...engergized);
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
