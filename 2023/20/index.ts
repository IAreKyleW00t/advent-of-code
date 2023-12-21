import * as fs from "fs";

type ModuleType = "%" | "&" | "b";

class Module {
  name: string;
  dest: string[];
  type: ModuleType;
  state: boolean = false;
  memory: Map<string, boolean> = new Map<string, boolean>();

  constructor(line: string) {
    const split: string[] = line.split(" -> ");
    this.name = split[0].replace(/%|&/g, "");
    this.type = split[0][0] as ModuleType;
    this.dest = split[1].split(",").map((s) => s.trim());
  }

  checkMemory(): boolean {
    return [...this.memory.values()].filter((m) => !m).length !== 0;
  }

  pulse(from: Module): boolean {
    if (this.type === "%") {
      if (from.state) return false;
      else this.state = !this.state;
    } else if (this.type === "&") {
      this.state = false;
      this.memory.set(from.name, from.state);
      if (this.checkMemory()) this.state = true;
    } else this.state = from.state;
    return true;
  }
}

function pressButton(
  modules: Map<string, Module>,
  presses: number = 1
): number {
  let high: number = 0;
  let low: number = presses; // include all initial button presses

  while (presses--) {
    const queue: Module[] = [modules.get("broadcaster")!];
    while (queue.length > 0) {
      const module: Module = queue.shift()!; // get the first item from queue
      if (module.state) high += module.dest.length;
      else low += module.dest.length;

      module.dest.forEach((dest) => {
        const m: Module | undefined = modules.get(dest);

        // pulse has reached an end
        if (!m) return;

        // pulse the destination
        const res: boolean = m.pulse(module);
        if (!res) return; // done with pulse
        queue.push(m);
      });
    }
  }
  return low * high;
}

function print_pulse(m: Module, d: Module | string): void {
  if (d instanceof Module) {
    console.log(`${m.name} -${m.state ? "high" : "low"}-> ${d.name}`);
  } else {
    console.log(`${m.name} -${m.state ? "high" : "low"}-> ${d}`);
  }
}

function part1(input: string[]): number {
  const modules: Map<string, Module> = new Map<string, Module>();
  input.forEach((line) => {
    if (!line) return; // skip empty lines
    const module: Module = new Module(line);
    modules.set(module.name, module);
  });

  // connect conjunction modules
  // probably a better way to do this
  [...modules.values()]
    .filter((m) => m.type === "&")
    .forEach((m) => {
      [...modules.values()]
        .filter((v) => v.dest.includes(m.name))
        .forEach((v) => {
          if (!m.memory.has(v.name)) m.memory.set(v.name, false);
        });
    });
  return pressButton(modules, 1000);
}

function part2(input: string[]): number {
  const modules: Map<string, Module> = new Map<string, Module>();
  input.forEach((line) => {
    if (!line) return; // skip empty lines
    const module: Module = new Module(line);
    modules.set(module.name, module);
  });

  // connect conjunction modules
  // probably a better way to do this
  [...modules.values()]
    .filter((m) => m.type === "&")
    .forEach((m) => {
      [...modules.values()]
        .filter((v) => v.dest.includes(m.name))
        .forEach((v) => {
          if (!m.memory.has(v.name)) m.memory.set(v.name, false);
        });
    });
  return 0;
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
