import * as fs from "fs";

// quadradic formula to calculate the min and max time needed to be pressed
// (time - held) * held = distance => -held^2 + held * time - distance = 0
function calculate(time: number, distance: number): [number, number] {
  // d = b^2 - 4ac => time^2 - 4 * distance
  const d: number = Math.sqrt(time ** 2 - 4 * distance);

  // held = (-b +/- sqrt(d) / 2)
  const a: number = (time - d) / 2; // min
  const b: number = (time + d) / 2; // max
  return [Math.ceil(a), Math.floor(b)];
}

function calculateTotal(times: number[], distances: number[]): number {
  let total: number = 1;
  for (let i = 0; i < times.length; i++) {
    const wins = calculate(times[i], distances[i]);
    total *= wins[1] - wins[0] + 1;
  }
  return total;
}

function part1(input: string[]): number {
  const times: number[] = [];
  const distances: number[] = [];

  input.forEach((line) => {
    if (!line) return; // skip empty lines

    if (line.match(/^Time:.+$/)) {
      line.match(/\d+/g)?.map((num) => times.push(parseInt(num)));
    } else if (line.match(/^Distance:.+$/)) {
      line.match(/\d+/g)?.map((num) => distances.push(parseInt(num)));
    }
  });

  return calculateTotal(times, distances);
}

function part2(input: string[]): number {
  const times: number[] = [];
  const distances: number[] = [];

  input.forEach((line) => {
    if (!line) return; // skip empty lines

    if (line.match(/^Time:.+$/)) {
      const time = parseInt(line.split(":")[1].replace(/\s+/g, ""));
      times.push(time);
    } else if (line.match(/^Distance:.+$/)) {
      const distance = parseInt(line.split(":")[1].replace(/\s+/g, ""));
      distances.push(distance);
    }
  });

  return calculateTotal(times, distances);
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
