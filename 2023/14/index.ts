import * as fs from "fs";

const stdin: string = fs.readFileSync(0).toString();

function transpose(m: string[][]): string[][] {
  return m[0].map((_, col) => m.map((row) => row[col]));
}

function reverse(m: string[][]): string[][] {
  return m.map((row) => row.reverse());
}

// rotates 90 degrees to the left
function lrotate(m: string[][]): string[][] {
  return m[0].map((_, col) => m.map((row) => row[row.length - 1 - col]));
}

// rotates 90 degrees to the right
function rrotate(m: string[][]): string[][] {
  return m[0].map((_, col) => m.map((row) => row[col]).reverse());
}

function calculateLoad(platform: string[][]): number {
  return platform.reduce(
    (sum, row, i) =>
      (sum += row.filter((t) => t === "O").length * (platform.length - i)),
    0
  );
}

let tilt_cache: { [key: string]: string[][] } = {};
function tilt(platform: string[][]): string[][] {
  // If we're tilting a pattern we've already tilted
  // then just return the output
  const key = btoa(JSON.stringify(platform));
  if (Object.keys(tilt_cache).includes(key)) {
    return tilt_cache[key];
  }

  platform.forEach((row) => {
    let pci: number = -1;
    let ci: number = row.indexOf("#");
    if (ci < 0) ci = row.length - 1;

    let c: number = 0;
    while (c < row.length - 1) {
      // Get numer of rocks between our current position and the last cube
      let rocks: number = row.slice(c, ci + 1).filter((i) => i === "O").length;

      // Update row with new rock formations
      for (let i = pci + 1; i < ci; i++) {
        if (rocks > 0) {
          row[i] = "O";
          rocks--;
        } else row[i] = ".";
      }

      // if ci is a cube and we don't have any rocks left over
      // that means they tumbled down. If a rock is still remaining
      // then it's just hanging at the edge
      if (row[ci] !== "#" && rocks === 0) row[ci] = ".";
      if (row[ci] !== "#" && rocks > 0) row[ci] = "O";

      pci = ci;
      c = ci + 1;
      ci = row.indexOf("#", c);
      if (ci < 0) ci = row.length - 1;
    }
  });

  tilt_cache[key] = platform;
  return platform;
}

let cycle_cache: { [key: string]: string[][] } = {};
function cycle(platform: string[][], cycles: number): string[][] {
  let c: string[][] = platform;
  for (let i = 0; i < cycles; i++) {
    // If we encounter a pattern that we have already seen
    // then this should be a loop?
    const key = btoa(JSON.stringify(c));
    if (Object.keys(cycle_cache).includes(key)) {
      return cycle_cache[key];
    }

    c = rrotate(tilt(lrotate(c))); // N
    c = tilt(c); // W
    c = tilt(rrotate(c)); // S
    c = rrotate(rrotate(tilt(rrotate(c)))); // E

    cycle_cache[key] = c;
  }
  return c;
}

function pprint(p: string[][]): void {
  p.forEach((r) => console.log(r.join("")));
}

function part1(): number {
  const platform: string[][] = [];
  stdin.split(/\r?\n/).forEach((line) => {
    if (!line) return; // skip blank lines
    platform.push(line.split(""));
  });
  const tilted: string[][] = transpose(tilt(transpose(platform)));
  return calculateLoad(tilted);
}

function part2(): number {
  const platform: string[][] = [];
  stdin.split(/\r?\n/).forEach((line) => {
    if (!line) return; // skip blank lines
    platform.push(line.split(""));
  });
  const cycled: string[][] = cycle(platform, 1_000_000_000);
  pprint(cycled);
  return calculateLoad(cycled);
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
