import * as fs from "fs";

const FILE = fs.readFileSync("data/input.txt");

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

const map: { [key: string]: { [key: string]: number } } = {
    cards: {
        "A": 13,
        "K": 12,
        "Q": 11,
        "J": 10,
        "T": 9,
        "9": 8,
        "8": 7,
        "7": 6,
        "6": 5,
        "5": 4,
        "4": 3,
        "3": 2,
        "2": 1,
    }
}

function compareHands(hand1: Hand, hand2: Hand, joker?: boolean): boolean {
    for (let i = 0; i < hand1.hand.length; i++) {
        let value1 = map.cards[hand1.hand[i]];
        let value2 = map.cards[hand2.hand[i]];
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
    let cards: { [key: string]: number } = {};
    hand.hand.split("").forEach(card => {
        if (Object.keys(cards).includes(card)) cards[card]++;
        else cards[card] = 1;
    });

    const keys = Object.keys(cards);
    if (joker && keys.includes("J")) {
        keys.forEach(card => {
            if (card === "J") return;
            cards[card] += cards["J"];
        });
        if (keys.length > 1) delete cards["J"];
        console.log(`cards = ${JSON.stringify(cards)}`)
    }

    const length = Object.keys(cards).length;
    if (length === 1 && Object.values(cards)[0] === 5) {
        return CardType.FIVE_OF_A_KIND;
    }
    if (length === 2 &&
        Object.values(cards).filter(count => {return count === 4}).length >= 1) {
        return CardType.FOUR_OF_A_KIND;
    }
    if (length === 2 &&
        Object.values(cards).filter(count => {return count === 3 || count === 2}).length >= 2) {
        return CardType.FULL_HOUSE;
    }
    if (length === 3) {
        if (Object.values(cards).filter(count => {return count === 3}).length >= 1) {
            return CardType.THREE_OF_A_KIND;
        } else if (Object.values(cards).filter(count => {return count === 2}).length >= 2) {
            return CardType.TWO_PAIR;
        }
    }
    if (length === 4 &&
        Object.values(cards).filter(count => {return count === 2}).length >= 1) {
        return CardType.ONE_PAIR;
    }
    return CardType.HIGH_CARD;
}

function getLocation(hand: Hand, hands: Hand[], joker?: boolean, start?: number, end?: number): number {
    start = start || 0;
    end = end || hands.length;
    for (let i = 0; i < hands.length; i++) {
        if (compareHands(hands[i], hand, joker)) {
            console.log(`${hands[i].hand} > ${hand.hand}`);
            return (i - 1)
        }
    }
    return end;
}

function addHand(hand: Hand, hands: Hand[], joker?: boolean): Hand[] {
    return hands.splice(getLocation(hand, hands, joker) + 1, 0, hand);
}

function part1(): number {
    let types: {
        [key: string]: Hand[];
    } = {};
    Object.keys(CardType).forEach(type => {
        if (!isNaN(Number(type))) types[type] = [];
    });
    FILE.toString().split(/\r?\n/).forEach(line => {
        if (!line) return; // skip empty lines
        const split = line.split(" ");
        if (split.length !== 2) return; // invalid
        const hand = { hand: split[0], bid: parseInt(split[1]) };
        const type = calculateType(hand);
        addHand(hand, types[type]);
        process.env.DEBUG && console.debug(`${CardType[type]} + ${JSON.stringify(hand)}`)
    });
    console.log(JSON.stringify(types));

    let count:number = 0;
    let total: number = 0;
    Object.values(types).filter(type => { return type.length > 0 }).forEach(type => {
        type.forEach(hand => {
            count++;
            total += hand.bid * count;
        });
    });
    return total;
}

function part2(): number {
    let types: {
        [key: string]: Hand[];
    } = {};
    Object.keys(CardType).forEach(type => {
        if (!isNaN(Number(type))) types[type] = [];
    });
    FILE.toString().split(/\r?\n/).forEach(line => {
        if (!line) return; // skip empty lines
        const split = line.split(" ");
        if (split.length !== 2) return; // invalid
        const hand = { hand: split[0], bid: parseInt(split[1]) };
        const type = calculateType(hand, true);
        addHand(hand, types[type], true);
        process.env.DEBUG && console.debug(`${CardType[type]} + ${JSON.stringify(hand)}`)
    });
    console.log(JSON.stringify(types));

    let count:number = 0;
    let total: number = 0;
    Object.values(types).filter(type => { return type.length > 0 }).forEach(type => {
        type.forEach(hand => {
            count++;
            total += hand.bid * count;
        });
    });
    return total;
}

const part1_out = part1();
process.env.DEBUG && console.debug("-".repeat(80))
const part2_out = part2();
process.env.DEBUG && console.debug("-".repeat(80))

console.log(`Part 1: ${part1_out}`);
console.log(`Part 2: ${part2_out}`);
