import * as fs from "fs";

const maxes: { [key: string]: number } = {
  red: 12,
  green: 13,
  blue: 14,
};

function parseGameId(input: string): number {
  return parseInt(input.split(":")[0].split(" ")[1]);
}

function parseBlocks(input: string): { [key: string]: number }[] {
  const totals: { [key: string]: number }[] = [];
  const games = input
    .split(":")[1]
    .split(";")
    .map((g) => g.trim());
  games.forEach((game) => {
    const game_total: { [key: string]: number } = {};
    const blocks = game.split(",").map((b) => b.trim());
    blocks.forEach((block) => {
      const [count, color] = block.split(" ");
      if (Object.keys(game_total).includes(color)) {
        game_total[color] += parseInt(count);
      } else {
        game_total[color] = parseInt(count);
      }
    });
    totals.push(game_total);
  });

  return totals;
}

function part1(input: string[]): number {
  let sum: number = 0;

  input.forEach((line) => {
    if (!line) return; // skip empty lines

    const id = parseGameId(line);
    const game_blocks = parseBlocks(line);
    let valid: boolean = true;

    game_blocks.forEach((blocks) => {
      Object.keys(blocks).forEach((color) => {
        const count = blocks[color];
        if (Object.keys(maxes).includes(color)) {
          valid = valid && count <= maxes[color];
        }
      });
    });

    if (valid) sum += id;
  });
  return sum;
}

function part2(input: string[]): number {
  let sum: number = 0;

  input.forEach((line) => {
    if (!line) return; // skip empty lines

    const game_blocks = parseBlocks(line);
    const mins: { [key: string]: number } = {};

    game_blocks.forEach((blocks) => {
      Object.keys(blocks).forEach((color) => {
        const count = blocks[color];
        if (Object.keys(mins).includes(color)) {
          if (count > mins[color]) {
            mins[color] = count;
          }
        } else {
          mins[color] = count;
        }
      });
    });

    sum += Object.values(mins).reduce((sum, count) => sum * count, 1);
  });
  return sum;
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
