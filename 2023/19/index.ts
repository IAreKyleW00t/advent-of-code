import * as fs from "fs";

type Operation = ">" | "<";

interface Rating {
  name: string;
  value: number;
}

class Part {
  ratings: Rating[];

  constructor(line: string) {
    this.ratings = line
      .slice(1, -1) // remove { }
      .split(",")
      .map((r) => {
        const split: string[] = r.split("=");
        return { name: split[0], value: parseInt(split[1]) };
      });
  }

  sum(): number {
    return this.ratings.reduce((sum, v) => (sum += v.value), 0);
  }
}

class State {
  rating?: Rating;
  op?: Operation;
  next: string;

  constructor(str: string) {
    // Parse the stage operation
    // if none is provided, then consider this an end state
    const op: RegExpMatchArray | null = str.match(/<|>/);
    if (op) {
      this.op = op[0] as Operation;
      let split: string[] = str.split(":");
      this.next = split[1];

      split = split[0].split(this.op);
      this.rating = { name: split[0], value: parseInt(split[1]) };
    } else this.next = str;
  }

  isEnd(): boolean {
    return !this.rating && !this.op;
  }

  process(part: Part): boolean {
    // if this is an end state then it will accept
    // anything that falls into it
    if (this.isEnd()) return true;

    // otherwise actually check the state
    for (let i = 0; i < part.ratings.length; i++) {
      const r: Rating = part.ratings[i];
      if (this.rating!.name === r.name) {
        if (this.op === ">") return r.value > this.rating!.value;
        else if (this.op === "<") return r.value < this.rating!.value;
      }
    }
    return false;
  }
}

class Workflow {
  name: string;
  states: State[];

  constructor(line: string) {
    const match: RegExpMatchArray = line.match(/(\w+)\{(.+)\}/)!;
    this.name = match[1];
    this.states = [];
    match[2].split(",").forEach((stage) => {
      this.states.push(new State(stage));
    });
  }

  process(part: Part): string | undefined {
    // run the part through each state until we
    // hit one that is valid, otherwise this is invalid
    for (let i = 0; i < this.states.length; i++) {
      const stage: State = this.states[i];
      const valid: boolean = stage.process(part);
      if (valid) return stage.next;
    }
    return undefined;
  }
}

function processParts(
  workflows: Map<string, Workflow>,
  parts: Set<Part>
): number {
  const accepted: number[] = [];
  parts.forEach((part) => {
    let workflow: Workflow = workflows.get("in")!; // start at "in" state
    let next: string | undefined;
    do {
      next = workflow.process(part); // run the workflow
      if (next) {
        // if we're at an Accepted or Rejected state
        // then we can stop, otherwise keep moving through
        // the workflows
        if (next === "A") {
          accepted.push(part.sum());
          return;
        } else if (workflows.has(next)) {
          workflow = workflows.get(next)!;
        } else return;
      }
    } while (next);
  });
  return accepted.reduce((sum, a) => (sum += a), 0);
}

function part1(input: string[]): number {
  // could use a normal object with dynamic keys, but Maps are
  // a bit faster if you're only needing key:value pairs
  const workflows: Map<string, Workflow> = new Map<string, Workflow>();
  input[0].split(/\r?\n/).forEach((line) => {
    const w: Workflow = new Workflow(line);
    workflows.set(w.name, w);
  });

  // could use a normal array, but Sets are a bit faster
  // if you don't need exact indexes
  const parts: Set<Part> = new Set<Part>();
  input[1].split(/\r?\n/).forEach((line) => {
    parts.add(new Part(line));
  });

  return processParts(workflows, parts);
}

function part2(input: string[]): number {
  const workflows: Map<string, Workflow> = new Map<string, Workflow>();
  input[0].split(/\r?\n/).forEach((line) => {
    const w: Workflow = new Workflow(line);
    workflows.set(w.name, w);
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
