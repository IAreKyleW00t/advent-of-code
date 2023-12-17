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

function nextDirections(beam: Beam, mirror: Mirror | undefined): Direction[] {
  if (!mirror) return [beam.direction];
  switch (mirror.type) {
    case "/":
      switch (beam.direction) {
        case "U":
          return ["R"];
        case "D":
          return ["L"];
        case "L":
          return ["D"];
        case "R":
          return ["U"];
        default:
          return [beam.direction];
      }
    case "\\":
      switch (beam.direction) {
        case "U":
          return ["L"];
        case "D":
          return ["R"];
        case "L":
          return ["U"];
        case "R":
          return ["D"];
        default:
          return [beam.direction];
      }
    case "|":
      switch (beam.direction) {
        case "L" || "R":
          return ["U", "D"];
        default:
          return [beam.direction];
      }
    case "-":
      switch (beam.direction) {
        case "U" || "D":
          return ["L", "R"];
        default:
          return [beam.direction];
      }
    default:
      return [beam.direction];
  }
}

function startBeams(mirrors: Mirror[], initial: Beam): Beam[] {
  const mirror: Mirror | undefined = mirrors
    .filter((m) => m.x === initial.x && m.y === initial.y)
    .pop();
  return nextDirections(initial, mirror).map((d) => ({
    x: initial.x,
    y: initial.y,
    direction: d,
  }));
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
  const ymin: number = Math.min(beam.y, yedge);
  const ymax: number = Math.max(beam.y, yedge);
  for (let i = ymin; i <= ymax; i++) {
    if (grid[i][beam.x] !== "#") count++;
    grid[i][beam.x] = "#";
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
    const b: Beam = beams[0];
    b.next = next(b, mirrors);

    // check if we've already been here
    // if so, the beam is a loop an we can stop processing it
    const key: string = `${b.x}:${b.y}:${b.direction}`;
    if (history.includes(key)) {
      beams.shift();
      continue;
    }

    // energize the grid and then update the beams
    // to move in the new direction(s)
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
    } else beams.shift(); // hit edge
    history.push(key);
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
