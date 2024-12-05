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
	// We can be clever about this by multiplying by 1/-1 to change the direction
	// that is being checked.
	// This is essentially the same speed as "unrolling" the loops yourself, but
	// this logic is a lot cleaner (imo).
	for _, i := range []int{1, -1} {
		// left/right
		buffer := []byte{0, 0, 0, 0}
		for j := range 4 {
			// Don't go out of bounds
			if x+(j*i) < 0 || x+(j*i) >= maxX {
				break
			}
			buffer[j] = graph[y][x+(j*i)]
		}
		if string(buffer) == "XMAS" {
			matches++
		}

		// up/down
		buffer = []byte{0, 0, 0, 0}
		for j := range 4 {
			// Don't go out of bounds
			if y+(j*i) < 0 || y+(j*i) >= maxY {
				break
			}
			buffer[j] = graph[y+(j*i)][x]
		}
		if string(buffer) == "XMAS" {
			matches++
		}

		// up-left/down-right
		buffer = []byte{0, 0, 0, 0}
		for j := range 4 {
			// Don't go out of bounds
			if x+(j*i) < 0 || x+(j*i) >= maxX || y+(j*i) < 0 || y+(j*i) >= maxY {
				break
			}
			buffer[j] = graph[y+(j*i)][x+(j*i)]
		}
		if string(buffer) == "XMAS" {
			matches++
		}

		// down-left/up-right
		buffer = []byte{0, 0, 0, 0}
		for j := range 4 {
			// Don't go out of bounds
			if x+(j*i) < 0 || x+(j*i) >= maxX || y-(j*i) < 0 || y-(j*i) >= maxY {
				break
			}
			buffer[j] = graph[y-(j*i)][x+(j*i)]
		}
		if string(buffer) == "XMAS" {
			matches++
		}
	}
	return matches
}

func SearchCrossWord(x int, y int, graph []string) int {
	maxY := len(graph)
	maxX := len(graph[0])

	// 'A' is on an edge, which is immediately invalid
	if x == 0 || x == maxX-1 || y == 0 || y == maxY-1 {
		return 0
	}

	// We know that the corners of the X must be 2 M's and 2 S's,
	// which has a total decimal value of 320. We can use this to know that
	// we possibly have a match. Then we can check if at least 1 side has 2
	// matching characters.
	crossValue := int(graph[y-1][x-1]) + int(graph[y+1][x-1]) + int(graph[y-1][x+1]) + int(graph[y+1][x+1])
	if crossValue == 320 {
		if graph[y-1][x-1] == graph[y-1][x+1] || graph[y-1][x-1] == graph[y+1][x-1] {
			return 1
		}
	}

	return 0
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
