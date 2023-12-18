import * as fs from "fs";

interface Card {
  id: number;
  winning: number[];
  card: number[];
}

function parseCardId(line: string): number {
  return parseInt(
    line
      .split(":")?.[0]
      .split(" ")
      .filter((t) => t)?.[1]
  );
}

function parseCard(id: number, line: string): Card {
  const card: Card = {
    id: id,
    winning: [],
    card: [],
  };

  line
    .split(":")[1]
    .split("|")
    .forEach((numbers, i) => {
      numbers
        .split(" ")
        .filter((c) => c)
        .map((num) => {
          if (i === 0) card.winning.push(parseInt(num));
          if (i === 1) card.card.push(parseInt(num));
        });
    });

  return card;
}

function getMatchingNumbers(card: Card): number[] {
  return card.card.filter((num) => {
    return card.winning.includes(num);
  });
}

function calculateScore(matches: number): number {
  if (matches === 0 || matches === 1) return matches;
  else return 2 ** (matches - 1);
}

function part1(input: string[]): number {
  let sum: number = 0;

  input.forEach((line) => {
    if (!line) return; // skip empty lines

    const id = parseCardId(line);
    const card = parseCard(id, line);
    const matches = getMatchingNumbers(card);
    const score = calculateScore(matches.length);
    sum += score;
  });
  return sum;
}

function part2(input: string[]): number {
  const cards: number[] = [];

  input.forEach((line) => {
    if (!line) return; // skip empty lines

    const id = parseCardId(line);
    const card = parseCard(id, line);

    // if we have encountered a copy of this card already, just add
    // set what the card is and add 1, otherwise add it in fresh.
    if (id - 1 in cards) cards[id - 1] = cards[id - 1] + 1;
    else cards[id - 1] = 1;

    // if we match any cards increment the count of those
    // cards by the number of these cards we have.
    const matches = getMatchingNumbers(card);
    if (matches) {
      [...Array(matches.length).keys()]
        .map((i) => i + id)
        .forEach((m) => {
          // if we haven't seen the card yet, then it will
          // have the same number of copies as the current card by default.
          if (!(m in cards)) cards[m] = cards[id - 1];
          else cards[m] += cards[id - 1];
        });
    }
  });

  return cards.reduce((sum, curr) => (sum += curr), 0);
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
