import * as fs from "fs";

const stdin: string = fs.readFileSync(0).toString();

class Prediction {
  values: number[][];

  constructor(values: number[]) {
    this.values = [values];

    let diff: number = 1;
    while (diff > 0) {
      this.values[diff] = [];
      for (let i = 0; i < this.values[diff - 1].length - 1; i++) {
        this.values[diff][i] =
          this.values[diff - 1][i + 1] - this.values[diff - 1][i];
      }
      if (this.values[diff].filter((num) => num !== 0).length === 0) diff = -1;
      else diff++;
    }
  }

  next(next: number = 1): number {
    while (next--) {
      for (let i = this.values.length - 1; i >= 0; i--) {
        const len = this.values[i].length;
        if (this.values[i].filter((num) => num !== 0).length === 0) {
          this.values[i][len] = 0;
        } else {
          this.values[i][len] =
            this.values[i + 1][len - 1] + this.values[i][len - 1];
        }
      }
    }
    return this.values[0][this.values[0].length - 1];
  }

  prev(prev: number = 1): number {
    while (prev--) {
      for (let i = this.values.length - 1; i >= 0; i--) {
        if (this.values[i].filter((num) => num !== 0).length === 0) {
          this.values[i].unshift(0);
        } else {
          this.values[i].unshift(this.values[i][0] - this.values[i + 1][0]);
        }
      }
    }
    return this.values[0][0];
  }
}

function part1(): number {
  const predictions: Prediction[] = [];
  stdin.split(/\r?\n/).forEach((line) => {
    if (!line) return; // skip empty lines

    const numbers = line.split(" ").map((n) => parseInt(n));
    const prediction = new Prediction(numbers);
    predictions.push(prediction);
  });
  return predictions.reduce((sum, prediction) => (sum += prediction.next()), 0);
}

function part2(): number {
  const predictions: Prediction[] = [];
  stdin.split(/\r?\n/).forEach((line) => {
    if (!line) return; // skip empty lines

    const numbers = line.split(" ").map((n) => parseInt(n));
    const prediction = new Prediction(numbers);
    predictions.push(prediction);
  });
  return predictions.reduce((sum, prediction) => (sum += prediction.prev()), 0);
}

const tstart: bigint = process.hrtime.bigint();
const p1: number = part1();
const tpart: bigint = process.hrtime.bigint();
const p2: number = part2();
const tend: bigint = process.hrtime.bigint();

console.log(`Part 1: ${p1} (${Number(tpart - tstart) / 1e6}ms)`);
console.log(`Part 2: ${p2} (${Number(tend - tpart) / 1e6}ms)`);
console.log(`Total time: ${Number(tend - tstart) / 1e6}ms`);
