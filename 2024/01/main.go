package main

import (
	"bufio"
	"log"
	"math"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"
)

func main() {
	log.SetOutput(os.Stdout) // Log to stdout instead of stderr
	inputs := GetInputData(os.Stdin)

	p1 := time.Now()
	log.Printf("Part 1: %d (%s)", Part1(inputs), time.Since(p1))

	p2 := time.Now()
	log.Printf("Part 2: %d (%s)", Part2(inputs), time.Since(p2))
}

// Utility function to read entire input file
func GetInputData(file *os.File) []string {
	lines := []string{}
	input := bufio.NewScanner(file)
	for input.Scan() {
		lines = append(lines, input.Text())
	}
	return lines
}

func ParseInt(a string) int {
	i, err := strconv.Atoi(a)
	if err != nil {
		panic(err)
	}
	return i
}

func Part1(inputs []string) int {
	left := []int{}
	right := []int{}
	for _, line := range inputs {
		fields := strings.Fields(line)
		left = append(left, ParseInt(fields[0]))
		right = append(right, ParseInt(fields[1]))
	}

	// Sort both sides so all numbers are lowest -> highest
	// In this case, it is faster to bulk sort the entire array vs
	// inserting the numbers in order as they are parsed.
	sort.Ints(left)
	sort.Ints(right)

	sum := 0
	for i := range left {
		sum += int(math.Abs(float64(left[i] - right[i])))
	}
	return sum
}

func Part2(inputs []string) int {
	left := []int{}
	heatmap := make(map[int]int)
	for _, line := range inputs {
		fields := strings.Fields(line)
		left = append(left, ParseInt(fields[0]))
		right := ParseInt(fields[1])

		// Keep track of number of occurrences for right side numbers
		heatmap[right] = heatmap[right] + 1
	}

	total := 0
	for i := range left {
		total += left[i] * heatmap[left[i]]
	}
	return total
}