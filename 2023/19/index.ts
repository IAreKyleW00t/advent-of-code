import * as fs from "fs";

type Operation = "<" | ">";

interface Category {
  name: string;
  value: number;
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
    for (let i = 0; i < part.categories.length; i++) {
      const rule: Category = part.categories[i];
      if (this.category!.name !== rule.name) continue;

      if (this.op === ">") return rule.value > this.category!.value;
      else if (this.op === "<") return rule.value < this.category!.value;
    }
    return false;
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
    // run the part through each rule until we
    // hit one that is valid, otherwise this is invalid
    for (let i = 0; i < this.rules.length; i++) {
      const rule: Rule = this.rules[i];
      // if this is an end state then it will accept anything
      if (rule.isEnd()) return rule.state;

      // otherwise actually check the rule
      if (rule.process(part)) return rule.state;
    }
    return "R";
  }
}

function processPart(
  states: Map<string, State>,
  part: Part,
  start: string = "in"
): number {
  let current: string = start;
  while (current) {
    const state = states.get(current);
    if (!state) return 0; // invalid

    // process part and then check if we're
    // at an Accepted or Rejected state
    current = state.process(part);
    if (current === "A") return part.sum();
    else if (current === "R") return 0;
  }
  return 0; // invalid
}

function part1(input: string[]): number {
  const states: Map<string, State> = new Map<string, State>();
  input[0].split(/\r?\n/).forEach((line) => {
    const s: State = new State(line);
    states.set(s.name, s);
  });

  let total: number = 0;
  input[1].split(/\r?\n/).forEach((line) => {
    total += processPart(states, new Part(line));
  });
  return total;
}

function part2(input: string[]): number {
  const states: Map<string, State> = new Map<string, State>();
  input[0].split(/\r?\n/).forEach((line) => {
    const s: State = new State(line);
    states.set(s.name, s);
  });

  return 0;
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
