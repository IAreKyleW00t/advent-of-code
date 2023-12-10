import * as fs from "fs";

const stdin: string = fs.readFileSync(0).toString();

function hasAdjacentSymbol(
  board: string[][],
  start: number,
  end: number,
  y: number
): boolean {
  // before
  if (start - 1 >= 0) {
    const val = board[y][start - 1];
    if (val && val.match(/[^\d.]/)) return true;
  }

  // after
  if (end < board[y].length) {
    const val = board[y][end];
    if (val && val.match(/[^\d.]/)) return true;
  }

  for (let i = start - 1; i <= end; i++) {
    // above
    if (y - 1 >= 0 && i >= 0 && i < board[0].length) {
      const val = board[y - 1][i];
      if (val && val.match(/[^\d.]/)) return true;
    }

    // below
    if (y + 1 < board.length && i >= 0 && i < board[0].length) {
      const val = board[y + 1][i];
      if (val && val.match(/[^\d.]/)) return true;
    }
  }

  return false;
}

function addAdjacentNumber(board: string[][], x: number, y: number): number {
  let numbers: number[] = [];

  // before
  if (x - 1 >= 0) {
    const val = board[y][x - 1];
    if (val && val.match(/\d/)) {
      numbers.push(parseNumber(board, x - 1, y));
    }
  }

  // after
  if (x + 1 < board[y].length) {
    const val = board[y][x + 1];
    if (val && val.match(/\d/)) {
      numbers.push(parseNumber(board, x + 1, y));
    }
  }

  for (let i = x - 1; i <= x + 1; i++) {
    // above
    if (y - 1 >= 0 && i >= 0 && i < board[0].length) {
      const val = board[y - 1][i];
      if (val && val.match(/\d/)) {
        numbers.push(parseNumber(board, i, y - 1));
      }
    }
  }

  for (let i = x - 1; i <= x + 1; i++) {
    // below
    if (y + 1 < board.length && i >= 0 && i < board[0].length) {
      const val = board[y + 1][i];
      if (val && val.match(/\d/)) {
        numbers.push(parseNumber(board, i, y + 1));
      }
    }
  }

  // Remove duplicate numbers
  numbers = numbers.filter((number, index, self) => {
    return index === self.indexOf(number);
  });

  if (numbers.length === 2) {
    return numbers.reduce((sum, current) => (sum = sum * current), 1);
  } else return 0;
}

function parseNumber(board: string[][], x: number, y: number): number {
  const line = board[y].join("");
  const start = regexFirstIndexOf(line, /[^\d]/, x) ?? x;
  const end = regexIndexOf(line, /[^\d]/, x) ?? x;

  const number = line.slice(start, end + 1);
  return parseInt(number);
}

function regexIndexOf(
  input: string,
  regex: RegExp,
  offset: number = 0
): number | undefined {
  for (let i = offset; i <= input.length; i++) {
    const char = input[i];
    if (char && char.match(regex)) return i - 1;
  }
  return input.length;
}

function regexFirstIndexOf(
  input: string,
  regex: RegExp,
  offset: number = 0
): number | undefined {
  for (let i = offset; i >= 0; i--) {
    const char = input[i];
    if (char && char.match(regex)) return i + 1;
  }
  return 0;
}

function part1(): number {
  const board: string[][] = [];

  stdin.split(/\r?\n/).forEach((line, i) => {
    if (!line) return; // skip empty lines

    board[i] = line.split("");
  });

  let sum: number = 0;
  board.forEach((line, y) => {
    let number: string = "";
    let start: number = -1;
    let end: number = -1;

    for (let x = 0; x <= line.length; x++) {
      const item = board[y][x];
      if (item?.match(/\d/)) {
        if (start === -1) start = x;
        number += item;
      } else if (start !== -1) {
        end = x;

        const valid = hasAdjacentSymbol(board, start, end, y);
        if (valid) sum += parseInt(number);

        start = -1;
        number = "";
      }
    }
  });
  return sum;
}

function part2(): number {
  const board: string[][] = [];

  stdin.split(/\r?\n/).forEach((line, i) => {
    if (!line) return; // skip empty lines

    board[i] = line.split("");
  });

  let sum: number = 0;
  board.forEach((line, y) => {
    line.forEach((item, x) => {
      if (item === "*") {
        const ratio = addAdjacentNumber(board, x, y);
        sum += ratio;
      }
    });
  });
  return sum;
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
