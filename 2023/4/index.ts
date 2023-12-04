import * as fs from "fs";

const FILE = fs.readFileSync("data/input.txt");

function parseCardId(line: string): number {
    return parseInt(line.split(":")?.[0].split(" ").filter(t => t)?.[1]);
}

function parseCard(id: number, line: string): { id: number, winning: number[], card: number[] } {
    const card = {
        id: id,
        winning: new Array<number>(),
        card: new Array<number>()
    }

    line.split(":")?.[1].split("|").forEach((numbers, i) => {
        numbers.split(" ").filter(c => c).map(num => {
            if (i === 0) card.winning.push(parseInt(num));
            if (i === 1) card.card.push(parseInt(num));
        })
    });

    return card;
}

function getMatchingNumbers(winning: number[], card: number[]): number[] {
    return card.filter((num) => {
        return winning.includes(num);
    });
}

function calculateScore(matches: number): number {
    if (matches === 0 || matches === 1) return matches;
    else return 2 ** (matches - 1);
}

function part1(): number {
    let sum: number = 0;
    FILE.toString().split(/\r?\n/).forEach(line => {
        if (!line) return; // skip empty lines
        const id = parseCardId(line);
        const card = parseCard(id, line);
        const matches = getMatchingNumbers(card.winning, card.card);
        const score = calculateScore(matches.length);
        sum += score;

        process.env.DEBUG && console.debug(`${id} => ${JSON.stringify(card)} => ${matches} => ${score}`)
    });
    return sum;
}

function part2(): number {
    const all_cards: { id: number, winning: number[], card: number[] }[][] = [];
    FILE.toString().split(/\r?\n/).forEach(line => {
        if (!line) return; // skip empty lines
        const id = parseCardId(line);
        const card = parseCard(id, line);
        all_cards[id - 1] = [card];
    });

    for (let i = 0; i < all_cards.length; i++) {
        const cards = all_cards[i];

        let done = false;
        cards.forEach(card => {
            const matches = getMatchingNumbers(card.winning, card.card);
            if (matches) {
                [...Array(matches.length).keys()].map(i => i + card.id).forEach(m => {
                    all_cards[m].push(all_cards[m][0]);
                });
            } else done = true;

            process.env.DEBUG && console.debug(`${card.id} (${cards.length}) => ${JSON.stringify(card)} => ${matches}`)
        });
        if (done) break;
    }

    return all_cards.reduce((sum, curr) => sum += curr.length, 0);
}

const part1_out = part1();
process.env.DEBUG && console.debug("-".repeat(80))
const part2_out = part2();
process.env.DEBUG && console.debug("-".repeat(80))

console.log(`Part 1: ${part1_out}`);
console.log(`Part 2: ${part2_out}`);
