import * as fs from "fs";

type Memory = { [key: string]: { [key: string]: boolean } };

interface Pulse {
  from: string;
  to: string;
  state: boolean;
}
interface Module {
  name: string;
  type: string;
  dest: string[];
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

// set initial conjunction modules
// probably a better way to do this
function loadMemory(modules: Map<string, Module>): Memory {
  const memory: Memory = {};
  modules.forEach((mod) => {
    if (mod.type !== "&") return;
    memory[mod.name] = {};
    modules.forEach((m) => {
      if (!m.dest.includes(mod.name)) return;
      memory[mod.name][m.name] = false;
    });
  });
  return memory;
}

function nextPulses(
  pulse: Pulse,
  to: Module,
  on: Set<string>,
  memory: Memory
): Pulse[] {
  let nstate: boolean = pulse.state;
  if (to.type === "%") {
    if (pulse.state) return [];
    else {
      if (on.has(pulse.to)) {
        on.delete(pulse.to);
        nstate = false;
      } else {
        on.add(pulse.to);
        nstate = true;
      }
    }
  } else if (to.type === "&") {
    memory[pulse.to][pulse.from] = pulse.state;
    if (Object.values(memory[pulse.to]).every(Boolean)) nstate = false;
    else nstate = true;
  }

  return to.dest.map((d) => {
    return { from: pulse.to, to: d, state: nstate };
  });
}

function press(modules: Map<string, Module>, presses: number = 1): number {
  // conjunction memory and flipflop states
  const memory: Memory = loadMemory(modules);
  const on: Set<string> = new Set<string>();

  let high: number = 0;
  let low: number = 0;
  while (presses--) {
    const queue: Pulse[] = [
      { from: "button", to: "broadcaster", state: false },
    ];

    while (queue.length > 0) {
      const pulse: Pulse = queue.shift()!;

      // track low and high states
      if (pulse.state) high += 1;
      else low += 1;

      // stop here if this is a null output
      if (!modules.has(pulse.to)) continue;
      const to: Module = modules.get(pulse.to)!;

      // process the pulse and queue up the next pulses
      const next: Pulse[] = nextPulses(pulse, to, on, memory);
      queue.push(...next);
    }
  }
  return low * high;
}

function pressUntil(
  modules: Map<string, Module>,
  outputs: Map<string, string[]>,
  until: string,
  state: boolean,
  depth: number = 1
): number {
  // Get the leaf nodes we need to watch cycles for
  // this assumes the top-level node is the one to trace down.
  // ideally I would trace down all of them, but that's not necessary here.
  let leaves: string[] = outputs.get(until)!;
  while (--depth) leaves = outputs.get(leaves[0])!;

  // keep track of each cycle for each leaf node
  const cycles: Map<string, number> = new Map<string, number>();

  // conjunction memory and flipflop states
  const memory: Memory = loadMemory(modules);
  const on: Set<string> = new Set<string>();

  let count: number = 0;
  while (++count) {
    const queue: Pulse[] = [
      { from: "button", to: "broadcaster", state: false },
    ];

    while (queue.length > 0) {
      const pulse: Pulse = queue.shift()!;

      // track when we encounter one of the leaf nodes in the state
      // we want it in. Once we've encountered it, we can note how long
      // it took to get there as it's cycle length.
      if (pulse.state === state && leaves.includes(pulse.to)) {
        cycles.set(pulse.to, count);
      }

      // if we've tracked a cycle lenght for all leaf nodes then
      // we're done. We can do the LCM to find how long it would take for
      // all of them to "synchronize"
      if (cycles.size === leaves.length) {
        return [...cycles.values()].reduce((a, b) => lcm(a, b));
      }

      // stop here if this is a null output
      if (!modules.has(pulse.to)) continue;
      const to: Module = modules.get(pulse.to)!;

      // process the pulse and queue up the next pulses
      const next: Pulse[] = nextPulses(pulse, to, on, memory);
      queue.push(...next);
    }
  }
  return -1;
}

function part1(input: string[]): number {
  const modules: Map<string, Module> = new Map<string, Module>();
  input.forEach((line) => {
    if (!line) return; // skip empty lines

    const split: string[] = line.split(" -> ");
    const name: string = split[0].replace(/%|&/g, "");
    const type: string = split[0][0];
    const dest: string[] = split[1].split(",").map((s) => s.trim());
    modules.set(name, { name: name, type: type, dest: dest });
  });

  return press(modules, 1000);
}

function part2(input: string[]): number {
  const outputs: Map<string, string[]> = new Map<string, string[]>();
  const modules: Map<string, Module> = new Map<string, Module>();
  input.forEach((line) => {
    if (!line) return; // skip empty lines

    const split: string[] = line.split(" -> ");
    const name: string = split[0].replace(/%|&/g, "");
    const type: string = split[0][0];
    const dest: string[] = split[1].split(",").map((s) => s.trim());
    modules.set(name, { name: name, type: type, dest: dest });

    // keep track conjunction outputs and what feeds into them
    if (type === "&") {
      dest.forEach((d) => {
        const src: string[] = [name];
        if (outputs.has(d)) {
          src.push(...outputs.get(d)!);
        }
        outputs.set(d, src);
      });
    }
  });

  // depth of 2 because [rx] <- [1 node] <- [4 nodes] <- ...
  // the trick is that the input sets up a bitwise operation (AND) and all
  // 4 inputs need to be "on" in order for the next pulse to move through.
  return pressUntil(modules, outputs, "rx", false, 2);
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
