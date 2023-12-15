import * as fs from "fs";

const stdin: string = fs.readFileSync(0).toString();
const numbers: string[] = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

function findAndReplaceWords(word: string): string {
  numbers.forEach((num, i) => {
    word = word.replace(
      new RegExp(num, "g"),
      `${num[0]}${i + 1}${num.slice(-1)}`
    );
  });
  return word;
}

function part1(): number {
  let sum: number = 0;

  stdin.split(/\r?\n/).forEach((line) => {
    if (!line) return; // skip empty lines

    const numbers: string = line.replace(/[a-z]/gi, "");
    sum += parseInt(`${numbers[0]}${numbers.slice(-1)}`);
  });
  return sum;
}

function part2(): number {
  let sum: number = 0;

  stdin.split(/\r?\n/).forEach((line) => {
    if (!line) return; // skip empty lines

    const numbers: string = findAndReplaceWords(line).replace(/[a-z]/gi, "");
    sum += parseInt(`${numbers[0]}${numbers.slice(-1)}`);
  });
  return sum;
}

const tstart: bigint = process.hrtime.bigint();
const p1: number = part1();
const tpart: bigint = process.hrtime.bigint();
const p2: number = part2();
const tend: bigint = process.hrtime.bigint();

console.log(`Part 1: ${p1} (${Number(tpart - tstart) / 1e6}ms)`);
console.log(`Part 2: ${p2} (${Number(tend - tpart) / 1e6}ms)`);
console.log(`Total time: ${Number(tend - tstart) / 1e6}ms`);
