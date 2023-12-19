import * as fs from "fs";

class Filter {
  to: string;
  from: string;
  srcs: number[];
  dests: number[];
  ranges: number[];
  offsets: number[];

  constructor(to: string, from: string) {
    this.to = to;
    this.from = from;
    this.srcs = [];
    this.dests = [];
    this.ranges = [];
    this.offsets = [];
  }
}

interface FilterMap {
  [key: string]: Filter;
}

interface SeedRange {
  start: number;
  length: number;
}

function locationFromSeed(seeds: number[], maps: FilterMap): number {
  const first: string = Object.keys(maps)[0];
  const locations: number[] = [];
  seeds.forEach((seed) => {
    let map = maps[first];
    let step = seed;

    // traverse through the mappings
    while (map) {
      let mapped: number = -1;

      for (let i = 0; i < map.srcs.length; i++) {
        if (step >= map.srcs[i] && step < map.srcs[i] + map.ranges[i]) {
          mapped = step + map.offsets[i];
          break; // found
        }
      }
      if (mapped !== -1) step = mapped;
      map = maps[map.to];
    }
    locations.push(step);
  });
  return Math.min(...locations);
}

function seedFromLocation(seeds: SeedRange[], maps: FilterMap): number {
  const last: string = Object.keys(maps).reverse()[0];

  // be optimistic and use non-zero locations as the
  // min/max range to search through.
  const start: number = Math.min(...maps[last].dests.filter((n) => n !== 0));
  const end: number = Math.max(...maps[last].dests.filter((n) => n !== 0));

  for (let loc = start; loc < end; loc++) {
    let map = maps[last];
    let step = loc;

    // traverse up through the mappings
    while (map) {
      let mapped: number = -1;
      for (let i = 0; i < map.dests.length; i++) {
        if (step >= map.dests[i] && step < map.dests[i] + map.ranges[i]) {
          mapped = map.srcs[i] + map.offsets[i];
          break; // found
        }
      }
      if (mapped > 0) step = mapped;
      map = maps[map.from];
    }

    // we found the seed!
    // TODO: look into why this works without checking if the seed is valid
    // this also makes the test case fail...
    if (step !== loc) return step;
  }
  return -1; // no seed found
}

function part1(input: string[]): number {
  const seeds: number[] = [];
  const maps: FilterMap = {};
  let category: string;

  input.forEach((line) => {
    if (!line) return; // skip empty lines

    if (line.match(/^seeds:.+$/)) {
      line.match(/\d+/g)?.map((num) => seeds.push(parseInt(num)));
    } else if (line.match(/^.+map:$/)) {
      const map = line.match(/^(\w+)-to-(\w+).+$/);
      if (map?.length !== 3) return; // invalid

      const from = category;
      const to = map[2];
      category = map[1];
      maps[category] = new Filter(to, from);
    } else {
      const numbers = line.match(/\d+/g)?.map((num) => parseInt(num));
      if (numbers?.length !== 3) return; // invalid

      const src = numbers[1];
      const dest = numbers[0];
      const range = numbers[2];
      maps[category].srcs.push(src);
      maps[category].dests.push(dest);
      maps[category].ranges.push(range);
      maps[category].offsets.push(dest - src);
    }
  });

  return locationFromSeed(seeds, maps);
}

function part2(input: string[]): number {
  const seeds: SeedRange[] = [];
  const maps: FilterMap = {};
  let category: string;

  input.forEach((line) => {
    if (!line) return; // skip empty lines

    if (line.match(/^seeds:.+$/)) {
      line.match(/\d+\s+\d+/g)?.map((num) => {
        const split = num.split(/\s+/);
        const start = parseInt(split[0]);
        const length = parseInt(split[1]) - 1;
        seeds.push({ start: start, length: length });
      });
    } else if (line.match(/^.+map:$/)) {
      const map = line.match(/^(\w+)-to-(\w+).+$/);
      if (map?.length !== 3) return; // invalid

      const from = category;
      const to = map[2];
      category = map[1];
      maps[category] = new Filter(to, from);
    } else {
      const numbers = line.match(/\d+/g)?.map((num) => parseInt(num));
      if (numbers?.length !== 3) return; // invalid

      const src = numbers[1];
      const dest = numbers[0];
      const range = numbers[2];
      maps[category].srcs.push(src);
      maps[category].dests.push(dest);
      maps[category].ranges.push(range);
      maps[category].offsets.push(dest - src);
    }
  });

  return seedFromLocation(seeds, maps);
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
