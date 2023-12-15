import * as fs from "fs";

const stdin: string = fs.readFileSync(0).toString();

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

function part1(): number {
  let sum: number = 0;

  stdin.split(/\r?\n/).forEach((line) => {
    if (!line) return; // skip empty lines

    const id = parseCardId(line);
    const card = parseCard(id, line);
    const matches = getMatchingNumbers(card);
    const score = calculateScore(matches.length);
    sum += score;
  });
  return sum;
}

function part2(): number {
  const all_cards: Card[][] = [];

  stdin.split(/\r?\n/).forEach((line) => {
    if (!line) return; // skip empty lines

    const id = parseCardId(line);
    const card = parseCard(id, line);
    all_cards[id - 1] = [card];
  });

  all_cards.forEach((cards) => {
    cards.forEach((card) => {
      const matches = getMatchingNumbers(card);
      if (matches) {
        [...Array(matches.length).keys()]
          .map((i) => i + card.id)
          .forEach((m) => {
            all_cards[m].push(all_cards[m][0]);
          });
      } else return;
    });
  });

  return all_cards.reduce((sum, curr) => (sum += curr.length), 0);
}

const tstart: bigint = process.hrtime.bigint();
const p1: number = part1();
const tpart: bigint = process.hrtime.bigint();
const p2: number = part2();
const tend: bigint = process.hrtime.bigint();

console.log(`Part 1: ${p1} (${Number(tpart - tstart) / 1e6}ms)`);
console.log(`Part 2: ${p2} (${Number(tend - tpart) / 1e6}ms)`);
console.log(`Total time: ${Number(tend - tstart) / 1e6}ms`);
