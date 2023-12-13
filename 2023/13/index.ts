import * as fs from "fs";

const stdin: string = fs.readFileSync(0).toString();

function compare(a: string[], b: string[]): number {
  return a.filter((v, i) => b[i] !== v).length;
}

// rotates 90 degrees to the right
function transpose(m: any[][]): any[][] {
  return m[0].map((_, col) => m.map((row) => row[col]));
}

// same as reflecting horizontal by transposing the matrix
function reflections_v(
  pattern: string[][],
  c: number,
  d: number,
  m: number = -1,
  smudges: number = 0
): number {
  return reflections_h(transpose(pattern), c, d, m, smudges);
}

// p = pattern matrix
// c = current center index
// d = distance from current center
// m = current closest match to edge
// returns the index of the row of reflection
function reflections_h(
  p: string[][],
  c: number,
  d: number,
  m: number = -1,
  smudges: number = 0
): number {
  if (c === p.length - 1) {
    return -1;
  } else if (c - d < 0 || c + d + 1 > p.length - 1) {
    return m;
  } else if (compare(p[c - d], p[c + d + 1]) <= smudges) {
    m = c;
    return reflections_h(p, c, d + 1, c, smudges);
  } else {
    return reflections_h(p, c + 1, 0, m, smudges);
  }
}

function pprint(pattern: string[][], v?: number, h?: number): void {
  pattern.forEach((row, y) => {
    row.forEach((p, x) => {
      if (y === h && x === v) process.stdout.write("╬");
      else if (y === h) process.stdout.write("═");
      else if (x === v) process.stdout.write("║");
      else process.stdout.write(p);
    });
    console.log();
  });
}

function part1(): number {
  let patterns: string[][][] = [];
  let pcount: number = 0;
  stdin.split(/\r?\n/).forEach((line) => {
    if (!line) {
      pcount++;
      return;
    }

    if (![...patterns.keys()].includes(pcount)) patterns[pcount] = [];
    patterns[pcount].push(line.split(""));
  });

  let total: number = 0;
  patterns.forEach((pattern) => {
    const h = reflections_h(pattern, 0, 0, 0);
    const v = reflections_v(pattern, 0, 0, 0);
    if (h >= 0 && v < 0) total += 100 * (h + 1);
    else if (v >= 0 && h < 0) total += v + 1;
  });
  return total;
}

function part2(): number {
  let patterns: string[][][] = [];
  let pcount: number = 0;
  stdin.split(/\r?\n/).forEach((line) => {
    if (!line) {
      pcount++;
      return;
    }

    if (![...patterns.keys()].includes(pcount)) patterns[pcount] = [];
    patterns[pcount].push(line.split(""));
  });

  let total: number = 0;
  patterns.forEach((pattern) => {
    const h = reflections_h(pattern, 0, 0, 0, 1);
    const v = reflections_v(pattern, 0, 0, 0, 1);
    pprint(pattern, v, h);
    console.log(`h = ${h}, v = ${v}`);
    if (h <= v || v < 0) total += 100 * (h + 1);
    else if (v <= h || h < 0) total += v + 1;
    console.log(`total = ${total}`);
    console.log();
  });
  return total;
}

console.log(`Part 1: ${part1()}`);
console.log();
console.log(`Part 2: ${part2()}`);
