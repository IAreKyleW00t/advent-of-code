package main

import (
	"bufio"
	"log"
	"os"
	"time"
)

func main() {
	log.SetOutput(os.Stdout) // Log to stdout instead of stderr
	data := GetInputData(os.Stdin)

	p1Start := time.Now()
	part1 := Part1(data)
	p1End := time.Since(p1Start)
	log.Printf("Part 1: %d (%s)", part1, p1End)

	p2Start := time.Now()
	part2 := Part2(data)
	p2End := time.Since(p2Start)
	log.Printf("Part 2: %d (%s)", part2, p2End)
	log.Printf("Total time: %s", p1End+p2End)
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

func SearchWord(x int, y int, graph []string) int {
	maxY := len(graph)
	maxX := len(graph[0])
	matches := 0

	// Check every cardinal and intercardinal direction for possible XMAS matches.
	// We can be clever about this by multiplying by 1/-1 to change the direction
	// that is being checked. This is essentially the same speed as "unrolling"
	// the loops yourself, but this logic is a lot cleaner (imo).
	//
	// To be efficient with memory/cache thrashing and reduce array operations we
	// cram the 4 bytes that we are checking against into an integer by
	// bitshifting it into it. This is a small bit faster than dealing with array,
	// especially zero'ing it out after each check.
	//
	// 1396788568 is the magic integer number for XMAS, which actually spells SAMX
	// because we push data in from the right side of the integer.
	// 01010011 01000001 01001101 01011000
	//     S       A        M        X
	for _, i := range []int{1, -1} {
		// left/right
		buffer := 0
		for j := range 4 {
			// Don't go out of bounds
			if x+(j*i) < 0 || x+(j*i) >= maxX {
				break
			}
			buffer |= int(graph[y][x+(j*i)]) << (8 * j)
		}
		if buffer == 1396788568 {
			matches++
		}

		// up/down
		buffer = 0
		for j := range 4 {
			// Don't go out of bounds
			if y+(j*i) < 0 || y+(j*i) >= maxY {
				break
			}
			buffer |= int(graph[y+(j*i)][x]) << (8 * j)
		}
		if buffer == 1396788568 {
			matches++
		}

		// up-left/down-right
		buffer = 0
		for j := range 4 {
			// Don't go out of bounds
			if x+(j*i) < 0 || x+(j*i) >= maxX || y+(j*i) < 0 || y+(j*i) >= maxY {
				break
			}
			buffer |= int(graph[y+(j*i)][x+(j*i)]) << (8 * j)
		}
		if buffer == 1396788568 {
			matches++
		}

		// down-left/up-right
		buffer = 0
		for j := range 4 {
			// Don't go out of bounds
			if x+(j*i) < 0 || x+(j*i) >= maxX || y-(j*i) < 0 || y-(j*i) >= maxY {
				break
			}
			buffer |= int(graph[y-(j*i)][x+(j*i)]) << (8 * j)
		}
		if buffer == 1396788568 {
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
