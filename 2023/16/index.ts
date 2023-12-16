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

function startDirection(mirror: Mirror): Direction[] {
  switch (mirror.type) {
    case "/":
      return ["L"];
    case "\\":
      return ["R"];
    case "|":
      return ["D"];
    case "-":
      return ["L", "R"];
  }
  return ["D"];
}

function energize(grid: Grid, beam: Beam, mirror: Mirror | undefined): number {
  let yedge: number;
  let xedge: number;

  // handle edges
  if (!mirror) {
    switch (beam.direction) {
      case "U":
        yedge = 0;
        xedge = beam.x;
        break;
      case "D":
        yedge = grid.length - 1;
        xedge = beam.x;
        break;
      case "L":
        yedge = beam.y;
        xedge = 0;
        break;
      case "R":
        yedge = beam.y;
        xedge = grid[0].length - 1;
        break;
    }
  } else {
    yedge = mirror.y;
    xedge = mirror.x;
  }

  // number of tiles that were engergized
  let count: number = 0;

  // change cols
  let ymin: number = Math.min(beam.y, yedge);
  let ymax: number = Math.max(beam.y, yedge);
  for (let i = ymin; i <= ymax; i++) {
    if (grid[i][beam.x] !== "#") count++;
    grid[i][beam.x] = "#";
  }

  // change rows
  let xmin: number = Math.min(beam.x, xedge);
  let xmax: number = Math.max(beam.x, xedge);
  for (let i = xmin; i <= xmax; i++) {
    if (grid[beam.y][i] !== "#") count++;
    grid[beam.y][i] = "#";
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
  // find the next location of each beam and energize blocks between
  const history: string[] = [];
  let count: number = 0;
  while (beams.length > 0) {
    let b: Beam = beams[0];
    b.next = next(b, mirrors);

    //pprint(grid);

    // check if we've already been here
    const key: string = `${b.next?.type}${b.x}${b.y}${b.direction}`;
    if (history.includes(key)) {
      beams.shift();
      continue;
    }

    count += energize(grid, b, b.next);
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
    } else if (b.next?.type === "/") {
      if (b.direction === "U") {
        beams[0] = { x: b.next.x, y: b.next.y, direction: "R" };
      } else if (b.direction === "L") {
        beams[0] = { x: b.next.x, y: b.next.y, direction: "D" };
      } else if (b.direction === "D") {
        beams[0] = { x: b.next.x, y: b.next.y, direction: "L" };
      } else if (b.direction === "R") {
        beams[0] = { x: b.next.x, y: b.next.y, direction: "U" };
      }
    } else if (b.next?.type === "\\") {
      if (b.direction === "U") {
        beams[0] = { x: b.next.x, y: b.next.y, direction: "L" };
      } else if (b.direction === "R") {
        beams[0] = { x: b.next.x, y: b.next.y, direction: "D" };
      } else if (b.direction === "D") {
        beams[0] = { x: b.next.x, y: b.next.y, direction: "R" };
      } else if (b.direction === "L") {
        beams[0] = { x: b.next.x, y: b.next.y, direction: "U" };
      }
    } else beams.shift();

    history.push(key);
  }

  return count;
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
  const initial: Beam[] = [{ x: 0, y: 0, direction: "D" }];
  return beam(grid, mirrors, initial);
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

  // Create the initial beam in the top-left, moving right
  let beams: number[] = [];
  for (let i = 0; i < grid[0].length; i++) {
    const g: Grid = Object.assign([], grid);
    const mirror: Mirror | undefined = mirrors
      .filter((m) => m.x === i && m.y === 0)
      .pop();

    let initial: Beam[] = [];
    if (mirror) {
      initial = startDirection(mirror).map((d) => ({
        x: i,
        y: 0,
        direction: d,
      }));
    } else initial = [{ x: i, y: 0, direction: "D" }];
    beams.push(beam(g, mirrors, initial));
  }
  return Math.max(...beams);
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
