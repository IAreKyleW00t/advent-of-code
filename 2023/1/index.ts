import * as fs from "fs";

const FILE = fs.readFileSync("data/input.txt");
const NUMBERS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]

function findAndReplaceWords(word: string): string {
    NUMBERS.forEach((num, i) => {
        word = word.replace(new RegExp(num, "g"), `${num[0]}${i + 1}${num.slice(-1)}`)
    });
    return word;
}

function part1(): number {
    let sum: number = 0;
    FILE.toString().split(/\r?\n/).forEach((line) => {
        if (!line) return; // skip empty lines
        const numbers = line.replace(/[a-z]/gi, "");
        const code = parseInt(`${numbers[0]}${numbers.slice(-1)}`);
        process.env.DEBUG && console.debug(`${line} => ${numbers} => ${code}`);
        sum += +code;
    });
    return sum;
}

function part2(): number {
    let sum: number = 0;
    FILE.toString().split(/\r?\n/).forEach((line) => {
        if (!line) return; // skip empty lines
        const converted = findAndReplaceWords(line);
        const numbers = converted.replace(/[a-z]/gi, "");
        const code = parseInt(`${numbers[0]}${numbers.slice(-1)}`);
        process.env.DEBUG && console.debug(`${line} => ${converted} => ${numbers} => ${code}`);
        sum += +code;
    });
    return sum;
}

const part1_out = part1();
process.env.DEBUG && console.debug("-".repeat(80))
const part2_out = part2();
process.env.DEBUG && console.debug("-".repeat(80))

console.log(`Part 1: ${part1_out}`);
console.log(`Part 2: ${part2_out}`);
