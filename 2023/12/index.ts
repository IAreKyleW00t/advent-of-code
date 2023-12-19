import * as fs from "fs";
import memoize from "fast-memoize";

// si = current position in springs[]
// gi = current position in groups[]
// length = length of current series of '#' in springs
function arrangements(
  springs: string[],
  groups: number[],
  si: number,
  gi: number,
  length: number
): number {
  // we're done looking through all characters, we are at the end
  if (si === springs.length) {
    // all groups have been matched, done
    if (gi === groups.length && length === 0) return 1;
    // hit the last block, which completes the group, done
    else if (gi === groups.length - 1 && groups[gi] === length) return 1;
    // invalid, still have groups left over that aren't matched
    else return 0;
  }

  // try to replace ? with . and # recall the function
  let paths: number = 0;
  [".", "#"].forEach((c) => {
    if (springs[si] === c || springs[si] === "?") {
      if (c === "." && length === 0) {
        // no active group, so just keep moving forward
        paths += farrangements(springs, groups, si + 1, gi, 0);
      } else if (
        c === "." &&
        length > 0 &&
        gi < groups.length &&
        groups[gi] === length
      ) {
        // current group is successfully matched
        // start matching next group and beginning looking for it
        paths += farrangements(springs, groups, si + 1, gi + 1, 0);
      } else if (c === "#") {
        // increase length of group section and keep moving
        paths += farrangements(springs, groups, si + 1, gi, length + 1);
      }
    }
  });

  return paths;
}

// Memoization used to greatly speed things up
const farrangements = memoize(arrangements);

function part1(input: string[]): number {
  let total: number = 0;

  input.forEach((line) => {
    if (!line) return; // skip empty lines

    const split = line.split(" ");
    const springs: string[] = split[0].split("").map((s) => s);
    const groups: number[] = split[1].split(",").map((g) => parseInt(g));
    total += farrangements(springs, groups, 0, 0, 0);
  });

  return total;
}

function part2(input: string[]): number {
  let total: number = 0;

  input.forEach((line) => {
    if (!line) return; // skip empty lines

    const split = line.split(" ");
    split[0] = [split[0], split[0], split[0], split[0], split[0]].join("?");
    split[1] = [split[1], split[1], split[1], split[1], split[1]].join(",");

    const springs: string[] = split[0].split("").map((s) => s);
    const groups: number[] = split[1].split(",").map((g) => parseInt(g));
    total += farrangements(springs, groups, 0, 0, 0);
  });

  return total;
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
