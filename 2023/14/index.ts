import * as fs from "fs";

const stdin: string = fs.readFileSync(0).toString();

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

function tilt(platform: string[][]): string[][] {
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
  return platform;
}

function cycle(platform: string[][], cycles: number): string[][] {
  let c: string[][] = platform;

  const history: { [key: string]: number } = {};
  for (let i = 0; i < cycles; i++) {
    // If we encounter a pattern that we have already seen
    // then we've encountered a loop, so start again from
    // our current cycle and only do the necessary remaining iterations
    const key = btoa(JSON.stringify(c));
    if (Object.keys(history).includes(key)) {
      return cycle(c, (cycles - i) % (i - history[key]));
    }

    c = rrotate(tilt(lrotate(c))); // N
    c = tilt(c); // W
    c = tilt(rrotate(c)); // S
    c = rrotate(rrotate(tilt(rrotate(c)))); // E
    history[key] = i;
  }
  return c;
}

function part1(): number {
  const platform: string[][] = [];

  stdin.split(/\r?\n/).forEach((line) => {
    if (!line) return; // skip empty lines
    platform.push(line.split(""));
  });

  const tilted = rrotate(tilt(lrotate(platform)));
  return calculateLoad(tilted);
}

function part2(): number {
  const platform: string[][] = [];

  stdin.split(/\r?\n/).forEach((line) => {
    if (!line) return; // skip empty lines
    platform.push(line.split(""));
  });

  const cycled = cycle(platform, 1_000_000_000);
  return calculateLoad(cycled);
}

const tstart: bigint = process.hrtime.bigint();
const p1: number = part1();
const tpart: bigint = process.hrtime.bigint();
const p2: number = part2();
const tend: bigint = process.hrtime.bigint();

console.log(`Part 1: ${p1} (${Number(tpart - tstart) / 1e6}ms)`);
console.log(`Part 2: ${p2} (${Number(tend - tpart) / 1e6}ms)`);
console.log(`Total time: ${Number(tend - tstart) / 1e6}ms`);
