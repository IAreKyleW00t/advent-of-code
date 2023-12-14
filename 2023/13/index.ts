import * as fs from "fs";

const stdin: string = fs.readFileSync(0).toString();

function compare(a: string[], b: string[]): number {
  return a.filter((v, i) => b[i] !== v).length;
}

// rotates 90 degrees to the right
function transpose(m: any[][]): any[][] {
  return m[0].map((_, col) => m.map((row) => row[col]));
}

function reflections(pattern: string[][], line: number): number {
  // move forward because a reflection is not 32123, it's 321123
  // so we need to account for the extra line
  line += 1;

  let unmatched: number = 0;
  for (let i = 0; i < pattern.length; i++) {
    let distance: number = 0; // from line

    // calculate distance from line
    if (i >= line) distance = line - 1 - (i - line); // above
    else distance = line - 1 - i + line; // below
    if (distance < 0 || distance >= pattern.length) continue;

    // count number of mismatched blocks between rows
    unmatched += compare(pattern[i], pattern[distance]);
  }

  // divide by 2 because the loop will
  return unmatched / 2;
}

function reflect(pattern: string[][], smudges: number = 0): number {
  let total: number = 0;

  // horizontal
  for (let i = 0; i < pattern.length - 1; i++) {
    const r: number = reflections(pattern, i);
    if (r === smudges) total += 100 * (i + 1);
  }

  // rotate matrix and then recheck "vertical"
  const t: string[][] = transpose(pattern);
  for (let i = 0; i < t.length - 1; i++) {
    const r: number = reflections(t, i);
    if (r === smudges) total += i + 1;
  }
  return total;
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

  return patterns.reduce((sum, pattern) => (sum += reflect(pattern, 0)), 0);
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

  return patterns.reduce((sum, pattern) => (sum += reflect(pattern, 1)), 0);
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
