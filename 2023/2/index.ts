import * as fs from "fs";

const FILE = fs.readFileSync("data/input.txt");
const MAXES: Record<string, number> = {
    red: 12,
    green: 13,
    blue: 14
}

function parseGameId(input: string): number {
    if (!input.includes(":")) return -1; // invalid
    return parseInt(input.split(":")[0].split(" ")[1]);
}

function parseBlocks(input: string): Record<string, number>[] {
    const totals: Record<string, number>[] = [];
    if (!input.includes(":")) return totals; // invalid

    const games = input.split(":")[1].split(";").map(g => g.trim());
    games.forEach((game) => {
        const game_total: Record<string, number> = {};
        const blocks = game.split(",").map(b => b.trim());
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

function part1(): number {
    let sum: number = 0;
    FILE.toString().split(/\r?\n/).forEach((line) => {
        if (!line) return; // skip empty lines
        const id = parseGameId(line);
        const game_blocks = parseBlocks(line);

        let valid: boolean = true;
        game_blocks.forEach((blocks) => {
            Object.keys(blocks).forEach((color) => {
                const count = blocks[color];
                if (Object.keys(MAXES).includes(color)) {
                    valid = valid && count <= MAXES[color];
                }
            });
        });
        if (valid) sum += id;
        process.env.DEBUG && console.debug(`Game #${id} => ${JSON.stringify(game_blocks)} => ${valid}`)
    });
    return sum;
}

function part2(): number {
    let sum: number = 0;
    FILE.toString().split(/\r?\n/).forEach((line) => {
        if (!line) return; // skip empty lines
        const id = parseGameId(line);
        const game_blocks = parseBlocks(line);

        const mins: Record<string, number> = {}
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
        sum += Object.values(mins).reduce((sum, count) => sum * count, 1)
        process.env.DEBUG && console.debug(`Game #${id} => ${JSON.stringify(game_blocks)} => ${JSON.stringify(mins)}`)
    });
    return sum;
}

const part1_out = part1();
process.env.DEBUG && console.debug("-".repeat(80))
const part2_out = part2();
process.env.DEBUG && console.debug("-".repeat(80))

console.log(`Part 1: ${part1_out}`);
console.log(`Part 2: ${part2_out}`);
