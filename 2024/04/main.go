package main

import (
	"bufio"
	"log"
	"os"
	"strconv"
	"time"
)

func main() {
	log.SetOutput(os.Stdout) // Log to stdout instead of stderr
	data := GetInputData(os.Stdin)

	p1 := time.Now()
	log.Printf("Part 1: %d (%s)", Part1(data), time.Since(p1))

	p2 := time.Now()
	log.Printf("Part 2: %d (%s)", Part2(data), time.Since(p2))
}

// Utility function to read entire input file
func GetInputData(file *os.File) []string {
	lines := []string{}
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}
	return lines
}

// Utility function to (safely) parse int from string
func ParseInt(a string) int {
	num, err := strconv.Atoi(a)
	if err != nil {
		panic(err)
	}
	return num
}

func WordToInt(word string) int {
	sum := 0
	for _, c := range word {
		sum += int(c)
	}
	return sum
}

func IsXmas(bytes []byte) bool {
	return string(bytes) == "XMAS"
}

func SearchWord(x int, y int, graph []string) int {
	maxY := len(graph)
	maxX := len(graph[0])
	matches := 0

	// Check every cardinal and intercardinal direction for possible XMAS matches.
	// This could be a lot cleaner by multiplying 1,-1 for directions, but it works.

	// left
	buffer := []byte{0, 0, 0, 0}
	for i := range 4 {
		if x-i < 0 {
			break
		}
		buffer[i] = graph[y][x-i]
	}
	if IsXmas(buffer) {
		matches++
	}

	// right
	buffer = []byte{0, 0, 0, 0}
	for i := range 4 {
		if x+i >= maxX {
			break
		}
		buffer[i] = graph[y][x+i]
	}
	if IsXmas(buffer) {
		matches++
	}

	// up
	buffer = []byte{0, 0, 0, 0}
	for i := range 4 {
		if y-i < 0 {
			break
		}
		buffer[i] = graph[y-i][x]
	}
	if IsXmas(buffer) {
		matches++
	}

	// down
	buffer = []byte{0, 0, 0, 0}
	for i := range 4 {
		if y+i >= maxY {
			break
		}
		buffer[i] = graph[y+i][x]
	}
	if IsXmas(buffer) {
		matches++
	}

	// up-left
	buffer = []byte{0, 0, 0, 0}
	for i := range 4 {
		if x-i < 0 || y-i < 0 {
			break
		}
		buffer[i] = graph[y-i][x-i]
	}
	if IsXmas(buffer) {
		matches++
	}

	// up-right
	buffer = []byte{0, 0, 0, 0}
	for i := range 4 {
		if x+i >= maxX || y-i < 0 {
			break
		}
		buffer[i] = graph[y-i][x+i]
	}
	if IsXmas(buffer) {
		matches++
	}

	// down-left
	buffer = []byte{0, 0, 0, 0}
	for i := range 4 {
		if x-i < 0 || y+i >= maxY {
			break
		}
		buffer[i] = graph[y+i][x-i]
	}
	if IsXmas(buffer) {
		matches++
	}

	// down-right
	buffer = []byte{0, 0, 0, 0}
	for i := range 4 {
		if x+i >= maxX || y+i >= maxY {
			break
		}
		buffer[i] = graph[y+i][x+i]
	}
	if IsXmas(buffer) {
		matches++
	}
	return matches
}

func SearchCrossWord(x int, y int, graph []string) int {
	maxY := len(graph)
	maxX := len(graph[0])
	matches := 0

	// On the edge, not valid
	if x == 0 || x == maxX-1 || y == 0 || y == maxY-1 {
		return 0
	}

	// Bottom edge, also not valid
	if (x+1 >= maxX && y+1 >= maxY) || (x-1 < 0 || y-1 < 0) {
		return 0
	}

	// We know that the corners of the X must be 2 M's and 2 S's,
	// which has a total decimal value of 320. We can use this to know that
	// We possibly have a match. The we can check if at least 1 side has 2
	// matching characters.
	//
	// Valid					Invalid
	// M.S	M.M				M.S
	// .A.	.A.	etc		.A.
	// M.S	S.S				S.M
	crossValue := int(graph[y-1][x-1]) + int(graph[y+1][x-1]) + int(graph[y-1][x+1]) + int(graph[y+1][x+1])
	if crossValue == 320 {
		if graph[y-1][x-1] == graph[y-1][x+1] || graph[y-1][x-1] == graph[y+1][x-1] {
			matches++
		}
	}

	return matches
}

func Part1(data []string) int {
	total := 0
	for y, line := range data {
		for x, c := range line {
			if c == 88 { // X
				total += SearchWord(x, y, data)
			}
		}
	}
	return total
}

func Part2(data []string) int {
	total := 0
	for y, line := range data {
		for x, c := range line {
			if c == 65 { // A
				total += SearchCrossWord(x, y, data)
			}
		}
	}
	return total
}
