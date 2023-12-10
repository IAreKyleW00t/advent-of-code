import * as fs from "fs";

const stdin: string = fs.readFileSync(0).toString();

class Prediction {
  values: number[][];

  constructor(values: number[]) {
    this.values = [values];

    let diff: number = 1;
    while (true) {
      this.values[diff] = [];
      for (let i = 0; i < this.values[diff - 1].length - 1; i++) {
        this.values[diff][i] =
          this.values[diff - 1][i + 1] - this.values[diff - 1][i];
      }
      if (this.values[diff].filter((num) => num !== 0).length === 0) break;
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

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
