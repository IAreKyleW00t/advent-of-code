import * as fs from "fs";

type Operation = "<" | ">";
type Range = [number, number]; // [start, end]

interface Category {
  name: string;
  value: number;
}

class PartRange {
  x: Range;
  m: Range;
  a: Range;
  s: Range;

  constructor(x: Range, m: Range, a: Range, s: Range) {
    this.x = x;
    this.m = m;
    this.a = a;
    this.s = s;
  }

  split(op: Operation, value: number, range: Range): Range[] {
    if (op === ">") {
      return [
        [Math.max(range[0], value + 1), range[1]], // accepted
        [range[0], Math.min(range[1], value)], // rejected
      ];
    } else if (op === "<") {
      return [
        [range[0], Math.min(range[1], value - 1)], // accepted
        [Math.max(range[0], value), range[1]], // rejected
      ];
    }
    return [range];
  }

  split_by(category: Category, op: Operation): PartRange[] {
    const ranges: PartRange[] = [];
    const name: string = category.name;
    if (name === "x") {
      return this.split(op, category.value, this.x).map((r) => {
        return new PartRange(r, this.m, this.a, this.s);
      });
    } else if (name === "m") {
      return this.split(op, category.value, this.m).map((r) => {
        return new PartRange(this.x, r, this.a, this.s);
      });
    } else if (name === "a") {
      return this.split(op, category.value, this.a).map((r) => {
        return new PartRange(this.x, this.m, r, this.s);
      });
    } else if (name === "s") {
      return this.split(op, category.value, this.s).map((r) => {
        return new PartRange(this.x, this.m, this.a, r);
      });
    }
    return ranges;
  }

  score(): number {
    return (
      (this.x[1] - this.x[0] + 1) *
      (this.m[1] - this.m[0] + 1) *
      (this.a[1] - this.a[0] + 1) *
      (this.s[1] - this.s[0] + 1)
    );
  }
}

class Part {
  categories: Category[];

  constructor(line: string) {
    this.categories = line
      .slice(1, -1) // remove { }
      .split(",")
      .map((r) => {
        const split: string[] = r.split("=");
        return { name: split[0], value: parseInt(split[1]) };
      });
  }

  sum(): number {
    return this.categories.reduce((sum, v) => (sum += v.value), 0);
  }
}

class Rule {
  category?: Category;
  op?: Operation;
  state: string;

  constructor(str: string) {
    const op: RegExpMatchArray | null = str.match(/<|>/);
    if (op) {
      this.op = op[0] as Operation;
      let split: string[] = str.split(":");
      this.state = split[1];

      split = split[0].split(this.op);
      this.category = { name: split[0], value: parseInt(split[1]) };
    } else this.state = str;
  }

  isEnd(): boolean {
    return !this.category && !this.op;
  }

  process(part: Part): boolean {
    // if this rule is a catch-all it will accept anything
    if (this.isEnd()) return true;

    // test the part against this rule, if it applies to it
    const category = part.categories.find(
      (c) => c.name === this.category!.name
    );
    if (!category) return false;

    if (this.op === ">") return category.value > this.category!.value;
    else if (this.op === "<") return category.value < this.category!.value;
    else return false; // invalid
  }

  // [start               end]
  // [  accepted  ][ rejected]
  // rejected could be before/after, but the idea still holds
  process_range(pr: PartRange): PartRange[] {
    // if this rule is a catch-all it will accept the whole range
    if (this.isEnd()) return [pr];
    return pr.split_by(this.category!, this.op!).map((r) => r);
  }
}

class State {
  name: string;
  rules: Rule[];

  constructor(line: string) {
    const match: RegExpMatchArray = line.match(/(\w+)\{(.+)\}/)!;
    this.name = match[1];
    this.rules = [];
    match[2].split(",").forEach((rule) => {
      this.rules.push(new Rule(rule));
    });
  }

  process(part: Part): string {
    // run the part through each rule until we hit one that is valid
    for (let i = 0; i < this.rules.length; i++) {
      const rule: Rule = this.rules[i];
      if (rule.process(part)) return rule.state;
    }
    return "R"; // invalid
  }

  process_range(pr: PartRange): [string, PartRange][] {
    const ranges: [string, PartRange][] = [];
    let current: PartRange = pr;
    this.rules.forEach((rule) => {
      // will always get up to 2 results back,
      // accepted ranges and possibly ranges that may not be accepted
      const nranges: PartRange[] = rule.process_range(current);
      ranges.push([rule.state, nranges[0]]);

      if (nranges.length > 1) current = nranges[1];
      else return; // no more
    });
    return ranges;
  }
}

function processPart(
  states: Map<string, State>,
  part: Part,
  start: string = "in"
): number {
  let current: string = start;
  while (current) {
    // check if we're at an Accepted or Rejected state
    if (current === "A") return part.sum();
    else if (current === "R") return 0;

    // ignore invalid states
    const state = states.get(current);
    if (!state) return 0;

    current = state.process(part);
  }
  return 0; // invalid
}

function processPartRange(
  states: Map<string, State>,
  pr: PartRange,
  start: string = "in"
): number {
  let total: number = 0;

  // hold a running list of part ranges and the
  // state they are in
  const queue: [string, PartRange][] = [[start, pr]];
  while (queue.length > 0) {
    const current: [string, PartRange] = queue.pop()!;
    // check if we're at an Accepted or Rejected state
    if (current[0] === "A") {
      total += current[1].score();
      continue;
    } else if (current[0] === "R") continue;

    // ignore invalid states
    const state = states.get(current[0]);
    if (!state) continue;

    // process part range and add any new parts to the queue
    const p = state.process_range(current[1]);
    queue.push(...p);
  }
  return total;
}

function part1(chunk: string[]): number {
  const states: Map<string, State> = new Map<string, State>();
  chunk[0].split(/\r?\n/).forEach((line) => {
    const state: State = new State(line);
    states.set(state.name, state);
  });

  let total: number = 0;
  chunk[1].split(/\r?\n/).forEach((line) => {
    total += processPart(states, new Part(line));
  });
  return total;
}

function part2(chunk: string[]): number {
  const states: Map<string, State> = new Map<string, State>();
  chunk[0].split(/\r?\n/).forEach((line) => {
    const state: State = new State(line);
    states.set(state.name, state);
  });

  return processPartRange(
    states,
    new PartRange([1, 4000], [1, 4000], [1, 4000], [1, 4000])
  );
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
