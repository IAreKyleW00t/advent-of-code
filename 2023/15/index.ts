import * as fs from "fs";

type Box = Lens[];
interface Lens {
  label: string;
  focal: number;
}

function hash(str: string): number {
  return str
    .split("")
    .reduce((value, s) => ((value + s.charCodeAt(0)) * 17) % 256, 0);
}

function calculatePower(boxes: Box[]): number {
  let total: number = 0;
  boxes.forEach((box, i) => {
    if (box.length === 0) return; // skip empty boxes
    total += box.reduce(
      (power, lens, j) => (power += (i + 1) * (j + 1) * lens.focal),
      0
    );
  });
  return total;
}

function removeLens(boxes: Box[], lens: Lens): void {
  const id: number = hash(lens.label);

  const existing: number = boxes[id].findIndex((l) => l.label === lens.label);
  if (existing >= 0) boxes[id].splice(existing, 1);
}

function addLens(boxes: Box[], lens: Lens): void {
  const id: number = hash(lens.label);

  const existing: number = boxes[id].findIndex((l) => l.label === lens.label);
  if (existing >= 0) boxes[id][existing] = lens;
  else boxes[id].push(lens);
}

function part1(input: string[]): number {
  let total: number = 0;
  input.forEach((line) => {
    if (!line) return; // skip empty lines
    total += line.split(",").reduce((sum, w) => (sum += hash(w)), 0);
  });
  return total;
}

function part2(input: string[]): number {
  const boxes: Box[] = Array.from(new Array<Box>(256), () => []);
  input.forEach((line) => {
    if (!line) return; // skip empty lines

    line.split(",").map((l) => {
      const s: string[] = l.split(/=|-/);
      const lens: Lens = { label: s[0], focal: parseInt(s[1]) || -1 };
      if (lens.focal > 0) addLens(boxes, lens);
      else removeLens(boxes, lens);
    });
  });
  return calculatePower(boxes);
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
