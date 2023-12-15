import * as fs from "fs";

const stdin: string = fs.readFileSync(0).toString();

function calculateWins(time: number, distance: number): number[] {
  const wins: number[] = [];
  for (let i = 1; i < time; i++) {
    if ((time - i) * i > distance) wins.push(i);
  }
  return wins;
}

function calculateTotal(times: number[], distances: number[]): number {
  let total: number = 1;
  for (let i = 0; i < times.length; i++) {
    const wins = calculateWins(times[i], distances[i]);
    total *= wins.length;
  }
  return total;
}

function part1(): number {
  const times: number[] = [];
  const distances: number[] = [];

  stdin.split(/\r?\n/).forEach((line) => {
    if (!line) return; // skip empty lines

    if (line.match(/^Time:.+$/)) {
      line.match(/\d+/g)?.map((num) => times.push(parseInt(num)));
    } else if (line.match(/^Distance:.+$/)) {
      line.match(/\d+/g)?.map((num) => distances.push(parseInt(num)));
    }
  });

  return calculateTotal(times, distances);
}

function part2(): number {
  const times: number[] = [];
  const distances: number[] = [];

  stdin.split(/\r?\n/).forEach((line) => {
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

const tstart: bigint = process.hrtime.bigint();
const p1: number = part1();
const tpart: bigint = process.hrtime.bigint();
const p2: number = part2();
const tend: bigint = process.hrtime.bigint();

console.log(`Part 1: ${p1} (${Number(tpart - tstart) / 1e6}ms)`);
console.log(`Part 2: ${p2} (${Number(tend - tpart) / 1e6}ms)`);
console.log(`Total time: ${Number(tend - tstart) / 1e6}ms`);
