import * as fs from "fs";

const stdin: string = fs.readFileSync(0).toString();

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
  const locations: number[] = [];
  seeds.forEach((seed) => {
    let category = Object.keys(maps)[0];
    let map = maps[category];
    let step = seed;
    while (map) {
      let mapped: number = -1;

      for (let i = 0; i < map.srcs.length; i++) {
        if (step >= map.srcs[i] && step < map.srcs[i] + map.ranges[i]) {
          mapped = step + map.offsets[i];
          break;
        }
      }
      if (mapped !== -1) step = mapped;

      category = map.to;
      map = maps[category];
    }
    locations.push(step);
  });
  return Math.min(...locations);
}

function seedFromLocation(
  seeds: SeedRange[],
  maps: FilterMap,
  start: number = 0,
  end: number = Number.MAX_SAFE_INTEGER
): number {
  for (let loc = start; loc < end; loc++) {
    let category = Object.keys(maps).reverse()[0];
    let map = maps[category];
    let step = loc;
    while (map) {
      let mapped: number = -1;
      for (let i = 0; i < map.dests.length; i++) {
        if (step >= map.dests[i] && step < map.dests[i] + map.ranges[i]) {
          mapped = map.srcs[i] + map.offsets[i];
          break;
        }
      }
      if (mapped > 0) step = mapped;

      category = map.from;
      map = maps[category];
    }

    if (step !== loc) {
      // TODO: This should check if the seed if valid, but doing so give the wrong solution?
      return step;
      //seeds.forEach((seed) => {
      //  if (step > seed.start && step <= seed.start + seed.length) {
      //    return step;
      //  }
      //});
    }
  }
  return -1;
}

function part1(): number {
  const seeds: number[] = [];
  const maps: FilterMap = {};
  let category: string;

  stdin.split(/\r?\n/).forEach((line) => {
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

function part2(): number {
  const seeds: SeedRange[] = [];
  const maps: FilterMap = {};
  let category: string;

  stdin.split(/\r?\n/).forEach((line) => {
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

const tstart: bigint = process.hrtime.bigint();
const p1: number = part1();
const tpart: bigint = process.hrtime.bigint();
const p2: number = part2();
const tend: bigint = process.hrtime.bigint();

console.log(`Part 1: ${p1} (${Number(tpart - tstart) / 1e6}ms)`);
console.log(`Part 2: ${p2} (${Number(tend - tpart) / 1e6}ms)`);
console.log(`Total time: ${Number(tend - tstart) / 1e6}ms`);
