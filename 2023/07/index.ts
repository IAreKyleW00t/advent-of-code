import * as fs from "fs";

const stdin: string = fs.readFileSync(0).toString();

interface Hand {
  hand: string;
  bid: number;
}

enum CardType {
  HIGH_CARD,
  ONE_PAIR,
  TWO_PAIR,
  THREE_OF_A_KIND,
  FULL_HOUSE,
  FOUR_OF_A_KIND,
  FIVE_OF_A_KIND,
}

class HandMap {
  [key: string]: Hand[];

  constructor() {
    Object.keys(CardType).forEach((type) => {
      if (!isNaN(Number(type))) this[type] = [];
    });
  }
}

const card_values: { [key: string]: number } = {
  A: 13,
  K: 12,
  Q: 11,
  J: 10,
  T: 9,
  "9": 8,
  "8": 7,
  "7": 6,
  "6": 5,
  "5": 4,
  "4": 3,
  "3": 2,
  "2": 1,
};

function compareHands(hand1: Hand, hand2: Hand, joker?: boolean): boolean {
  for (let i = 0; i < hand1.hand.length; i++) {
    let value1 = card_values[hand1.hand[i]];
    let value2 = card_values[hand2.hand[i]];
    if (joker) {
      if (hand1.hand[i] === "J") value1 = 0;
      if (hand2.hand[i] === "J") value2 = 0;
    }
    if (value1 > value2) return true;
    if (value1 < value2) return false;
  }
  return false;
}

function calculateType(hand: Hand, joker?: boolean): CardType {
  const cards: { [key: string]: number } = {};
  hand.hand.split("").forEach((card) => {
    if (Object.keys(cards).includes(card)) cards[card]++;
    else cards[card] = 1;
  });

  const keys = Object.keys(cards);
  if (joker && keys.includes("J")) {
    keys.forEach((card) => {
      if (card === "J") return;
      cards[card] += cards["J"];
    });
    if (keys.length > 1) delete cards["J"];
  }

  const length = Object.keys(cards).length;
  if (length === 1 && Object.values(cards)[0] === 5) {
    return CardType.FIVE_OF_A_KIND;
  }
  if (
    length === 2 &&
    Object.values(cards).filter((count) => {
      return count === 4;
    }).length >= 1
  ) {
    return CardType.FOUR_OF_A_KIND;
  }
  if (
    length === 2 &&
    Object.values(cards).filter((count) => {
      return count === 3 || count === 2;
    }).length >= 2
  ) {
    return CardType.FULL_HOUSE;
  }
  if (length === 3) {
    if (
      Object.values(cards).filter((count) => {
        return count === 3;
      }).length >= 1
    ) {
      return CardType.THREE_OF_A_KIND;
    } else if (
      Object.values(cards).filter((count) => {
        return count === 2;
      }).length >= 2
    ) {
      return CardType.TWO_PAIR;
    }
  }
  if (
    length === 4 &&
    Object.values(cards).filter((count) => {
      return count === 2;
    }).length >= 1
  ) {
    return CardType.ONE_PAIR;
  }
  return CardType.HIGH_CARD;
}

function getLocation(
  hand: Hand,
  hands: Hand[],
  joker?: boolean,
  start?: number,
  end?: number
): number {
  start = start || 0;
  end = end || hands.length;
  for (let i = 0; i < hands.length; i++) {
    if (compareHands(hands[i], hand, joker)) return i - 1;
  }
  return end;
}

function addHand(hand: Hand, hands: Hand[], joker?: boolean): Hand[] {
  return hands.splice(getLocation(hand, hands, joker) + 1, 0, hand);
}

function calculateTotal(hands: HandMap): number {
  let count: number = 0;
  let total: number = 0;
  Object.values(hands)
    .filter((type) => type.length > 0)
    .forEach((type) => {
      type.forEach((hand) => {
        count++;
        total += hand.bid * count;
      });
    });
  return total;
}

function part1(): number {
  const hands: HandMap = new HandMap();

  stdin.split(/\r?\n/).forEach((line) => {
    if (!line) return; // skip empty lines

    const split = line.split(" ");
    const hand = { hand: split[0], bid: parseInt(split[1]) };
    const type = calculateType(hand);
    addHand(hand, hands[type]);
  });

  return calculateTotal(hands);
}

function part2(): number {
  const hands: HandMap = new HandMap();

  stdin.split(/\r?\n/).forEach((line) => {
    if (!line) return; // skip empty lines

    const split = line.split(" ");
    const hand = { hand: split[0], bid: parseInt(split[1]) };
    const type = calculateType(hand, true);
    addHand(hand, hands[type], true);
  });

  return calculateTotal(hands);
}

const tstart: bigint = process.hrtime.bigint();
const p1: number = part1();
const tpart: bigint = process.hrtime.bigint();
const p2: number = part2();
const tend: bigint = process.hrtime.bigint();

console.log(`Part 1: ${p1} (${Number(tpart - tstart) / 1e6}ms)`);
console.log(`Part 2: ${p2} (${Number(tend - tpart) / 1e6}ms)`);
console.log(`Total time: ${Number(tend - tstart) / 1e6}ms`);
