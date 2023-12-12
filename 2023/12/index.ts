import * as fs from "fs";

const stdin: string = fs.readFileSync(0).toString();

type Spring = "." | "#" | "?";

interface Record {
  springs: Spring[];
  groups: number[];
}

// si = current position in springs[]
// gi = current position in groups[]
// length = length of current series of '#' in springs
// cache is used during recursive calls
function arrangements(
  record: Record,
  si: number,
  gi: number,
  length: number,
  cache: { [key: string]: number }
): number {
  const springs = record.springs;
  const groups = record.groups;

  // Memoization/Dynamic Programming used to load from cache
  // concat si, gi, and length as a string and encode it
  const key = `${si}:${gi}:${length}`;
  if (Object.keys(cache).includes(key.toString())) return cache[key];

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
  ["." as Spring, "#" as Spring].forEach((c) => {
    if (springs[si] === c || springs[si] === "?") {
      if (c === "." && length === 0) {
        // no active group, so just keep moving forward
        paths += arrangements(record, si + 1, gi, 0, cache);
      } else if (
        c === "." &&
        length > 0 &&
        gi < groups.length &&
        groups[gi] === length
      ) {
        // current group is successfully matched
        // start matching next group and beginning looking for it
        paths += arrangements(record, si + 1, gi + 1, 0, cache);
      } else if (c === "#") {
        // increase length of group section and keep moving
        paths += arrangements(record, si + 1, gi, length + 1, cache);
      }
    }
  });

  // Save current arrangement into cache for later loading
  cache[key] = paths;
  return paths;
}

function part1(): number {
  const records: Record[] = [];

  stdin.split(/\r?\n/).forEach((line) => {
    if (!line) return; // skip empty lines

    const split = line.split(" ");

    let springs: Spring[] = split[0].split("").map((s) => s as Spring);
    let groups: number[] = split[1].split(",").map((g) => parseInt(g));
    records.push({ springs: springs, groups: groups });
  });

  return records.reduce(
    (sum, record) => (sum += arrangements(record, 0, 0, 0, {})),
    0
  );
}

function part2(): number {
  const records: Record[] = [];

  stdin.split(/\r?\n/).forEach((line) => {
    if (!line) return; // skip empty lines

    const split = line.split(" ");
    split[0] = [split[0], split[0], split[0], split[0], split[0]].join("?");
    split[1] = [split[1], split[1], split[1], split[1], split[1]].join(",");

    let springs: Spring[] = split[0].split("").map((s) => s as Spring);
    let groups: number[] = split[1].split(",").map((g) => parseInt(g));
    records.push({ springs: springs, groups: groups });
  });

  // still pretty slow... :(
  let total: number = 0;
  records.forEach((r, i) => {
    process.stdout.write(
      `${i + 1} ${r.springs.join("")} (${r.groups.join(",")}) => `
    );
    const sum: number = arrangements(r, 0, 0, 0, {});
    total += sum;
    console.log(sum);
  });
  return total;
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
