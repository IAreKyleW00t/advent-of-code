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
	inputs := GetInputs()

	p1 := time.Now()
	log.Printf("Part 1 = %d", Part1(inputs))
	log.Println(time.Since(p1).String())

	p2 := time.Now()
	log.Printf("Part 2 = %d", Part2(inputs))
	log.Println(time.Since(p2).String())

}

// Utility function to read entire input files into memory
func GetInputs() []string {
	lines := []string{}
	stdin := bufio.NewScanner(os.Stdin)
	for stdin.Scan() {
		lines = append(lines, stdin.Text())
	}
	return lines
}

func Part1(inputs []string) int {
	left := []int{}
	right := []int{}
	for _, line := range inputs {
		fields := strings.Fields(line)

		i, err := strconv.Atoi(fields[0])
		if err != nil {
			panic(err)
		}
		left = append(left, i)

		i, err = strconv.Atoi(fields[1])
		if err != nil {
			panic(err)
		}
		right = append(right, i)
	}

	// Sort both sides so all numbers are lowest -> highest
	// In this case, it is faster to bulk sort the entire array at once vs
	// sorting them as they are inserted.
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

		i, err := strconv.Atoi(fields[0])
		if err != nil {
			panic(err)
		}
		left = append(left, i)

		i, err = strconv.Atoi(fields[1])
		if err != nil {
			panic(err)
		}

		// Keep track of number of occurrences for right side numbers
		heatmap[i] = heatmap[i] + 1
	}

	sum := 0
	for i := range left {
		sum += int(math.Abs(float64(left[i] * heatmap[left[i]])))
	}
	return sum
}
