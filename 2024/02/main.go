package main

import (
	"bufio"
	"log"
	"math"
	"os"
	"strconv"
	"strings"
	"time"
)

func main() {
	log.SetOutput(os.Stdout) // Log to stdout instead of stderr
	lines := GetInputData(os.Stdin)

	p1Start := time.Now()
	part1 := Part1(lines)
	p1End := time.Since(p1Start)
	log.Printf("Part 1: %d (%s)", part1, p1End)

	p2Start := time.Now()
	part2 := Part2(lines)
	p2End := time.Since(p2Start)
	log.Printf("Part 2: %d (%s)", part2, p2End)
	log.Printf("Total time: %s", p1End+p2End)
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

// Utility function to (safely) parse ints from strings
func ParseInts(a []string) []int {
	nums := make([]int, len(a))
	for i, x := range a {
		num, err := strconv.Atoi(x)
		if err != nil {
			panic(err)
		}
		nums[i] = num
	}
	return nums
}

func CheckNumbers(numbers []int, min int, max int) bool {
	inc := false
	dec := false
	for i := 0; i < len(numbers)-1; i++ {
		// Check if list is increasing or decreasing
		diff := numbers[i] - numbers[i+1]
		if diff == 0 { // No change
			return false
		} else if diff < 0 { // Increasing
			inc = true
			if dec {
				return false
			}
		} else if diff > 0 { // Dreceasing
			dec = true
			if inc {
				return false
			}
		}

		// Check if diff is within range
		diff = int(math.Abs(float64(diff)))
		if diff < min || diff > max {
			return false
		}
	}
	return true
}

func Part1(inputs []string) int {
	total := 0
	for _, line := range inputs {
		fields := strings.Fields(line)
		numbers := ParseInts(fields)

		safe := CheckNumbers(numbers, 1, 3)
		if safe {
			total++
		}
	}
	return total
}

func Part2(inputs []string) int {
	total := 0
	for _, line := range inputs {
		fields := strings.Fields(line)
		numbers := ParseInts(fields)

		safe := CheckNumbers(numbers, 1, 3)
		if !safe {
			// If list is not considered safe then try the list again with
			// a number removed and move to the next once a safe subset is found.
			// Not the best approach, but simple and easy to use with my Part 1 solution.
			for i := range numbers {
				// Create a copy of the list in memory so we don't mangle it
				// after each iteration (???)
				clone := make([]int, len(numbers))
				copy(clone, numbers)

				// Remove the i'th element from the cloned list and check it
				sub := append(clone[:i], clone[i+1:]...)
				safe = CheckNumbers(sub, 1, 3)
				if safe {
					total++
					break // Don't test anymore subsets once a safe one is found
				}
			}
		} else {
			// Original list was already safe
			total++
		}
	}
	return total
}
