import * as fs from "fs";

type FilterItem = [number, number, number]; // [dest, src, range]
type Range = [number, number]; // [start, end]

class Filter {
  maps: FilterItem[] = [];

  // parse block of text into filter items
  constructor(chunk: string[]) {
    chunk.forEach((line) => {
      const split: number[] = line.split(" ").map((s) => parseInt(s));
      this.maps.push([split[0], split[1], split[2]]);
    });
  }

  // runs a seed through the filter
  // and outputs its new mapped value
  map(seed: number): number {
    for (let i = 0; i < this.maps.length; i++) {
      const dest: number = this.maps[i][0];
      const src: number = this.maps[i][1];
      const range: number = this.maps[i][2];
      if (src <= seed && seed < src + range) return seed + dest - src;
    }
    return seed; // doesn't map to anything
  }

  // runs a seed range through the filter
  // and outputs the possible locations it can hit
  map_range(ranges: Range[]): Range[] {
    const filtered: Range[] = [];
    for (let i = 0; i < this.maps.length; i++) {
      const dest: number = this.maps[i][0];
      const src: number = this.maps[i][1];
      const range: number = this.maps[i][2];

      // these seeds that may not fit in this mapping
      // but could belong to another, so hold onto them
      const queue: Range[] = [];
      while (ranges.length > 0) {
        const s: Range = ranges.pop()!;
        const start: number = s[0];
        const end: number = s[1];

        // [start                        end] <- large seed search
        //         [src     src+range]        <- valid seeds for the mapping
        // [before][      inner      ][after] <- "filtered" seeds
        // before/after = everything outside the range for the mapping
        // inner = what fits in the range and will be processed
        const before: Range = [start, Math.min(end, src)];
        const inner: Range = [Math.max(start, src), Math.min(src + range, end)];
        const after: Range = [Math.max(src + range, start), end];

        // outside of valid range, save for later
        if (before[1] > before[0]) queue.push(before);

        // inside range, so process it
        if (inner[1] > inner[0]) {
          filtered.push([inner[0] - src + dest, inner[1] - src + dest]);
        }

        // also outside of range
        if (after[1] > after[0]) queue.push(after);
      }

      // move the queue to the list of ranges to be processed
      ranges = queue;
    }

    return [...filtered, ...ranges];
  }
}

function part1(input: string[]): number {
  let seeds: number[] = [];
  const filters: Filter[] = [];
  input.forEach((chunk) => {
    // slice(1) each chunk to remove the header row
    if (chunk.match(/^seeds:.+$/)) {
      seeds = chunk
        .split(" ")
        .slice(1)
        .map((s) => parseInt(s));
    } else if (chunk.match(/^.+map:/)) {
      filters.push(new Filter(chunk.split(/\r?\n/).slice(1)));
    }
  });

  const locations: number[] = [];
  seeds.forEach((seed) => {
    filters.forEach((fn) => (seed = fn.map(seed)));
    locations.push(seed);
  });
  return Math.min(...locations);
}

function part2(input: string[]): number {
  let seeds: Range[] = [];
  const filters: Filter[] = [];
  input.forEach((chunk) => {
    // slice(1) each chunk to remove the header row
    if (chunk.match(/^seeds:.+$/)) {
      seeds = chunk.match(/\d+\s+\d+/g)!.map((s) => {
        const split = s.split(/\s+/);
        const start = parseInt(split[0]);
        const length = parseInt(split[1]);
        return [start, start + length];
      });
    } else if (chunk.match(/^.+map:/)) {
      filters.push(new Filter(chunk.split(/\r?\n/).slice(1)));
    }
  });

  const locations: number[] = [];
  seeds.forEach((seed) => {
    // running list of seed ranges to be processed
    let ranges: Range[] = [seed];
    filters.forEach((fn) => {
      ranges = fn.map_range(ranges);
    });

    // get minimum location for this seed range
    locations.push(Math.min(...ranges.map((r) => r[0])));
  });
  return Math.min(...locations);
}

const stdin: string[] = fs
  .readFileSync(0)
  .toString()
  .trim()
  .split(/\r?\n\r?\n/); // read chunks
const tstart: bigint = process.hrtime.bigint();
const p1: number = part1(stdin);
const tpart: bigint = process.hrtime.bigint();
const p2: number = part2(stdin);
const tend: bigint = process.hrtime.bigint();

console.log(`Part 1: ${p1} (${Number(tpart - tstart) / 1e6}ms)`);
console.log(`Part 2: ${p2} (${Number(tend - tpart) / 1e6}ms)`);
console.log(`Total time: ${Number(tend - tstart) / 1e6}ms`);
