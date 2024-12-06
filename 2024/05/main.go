package main

import (
	"bufio"
	"log"
	"os"
	"slices"
	"strconv"
	"strings"
	"time"
)

func main() {
	log.SetOutput(os.Stdout) // Log to stdout instead of stderr
	updates, rules := GetInputData(os.Stdin)

	p1Start := time.Now()
	part1 := Part1(updates, rules)
	p1End := time.Since(p1Start)
	log.Printf("Part 1: %d (%s)", part1, p1End)

	p2Start := time.Now()
	part2 := Part2(updates, rules)
	p2End := time.Since(p2Start)
	log.Printf("Part 2: %d (%s)", part2, p2End)
	log.Printf("Total time: %s", p1End+p2End)
}

// Utility function to read entire input file
func GetInputData(file *os.File) ([][]int, [][]int) {
	rules := [][]int{}
	updates := [][]int{}
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()

		// Parse parts from strings
		if line == "" { // blank
			continue
		} else if strings.Contains(line, "|") { // rule
			rules = append(rules, ParseInts(strings.Split(line, "|")))
		} else { // updates
			updates = append(updates, ParseInts(strings.Split(line, ",")))
		}
	}
	return updates, rules
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

// Utility function that will insert an element at a given position,
// shifting the remaining elements to the right.
func insertInt[T any](array []T, value T, index int) []T {
	return append(array[:index], append([]T{value}, array[index:]...)...)
}

// Utility function to remove an element from an array
func removeInt[T any](array []T, index int) []T {
	return append(array[:index], array[index+1:]...)
}

// Utility function to "move" an element in an array to a new position,
// shifting the remaining elements to the right.
func moveElement[T any](array []T, srcIndex int, dstIndex int) []T {
	value := array[srcIndex]
	return insertInt(removeInt(array, srcIndex), value, dstIndex)
}

func Part1(updates [][]int, rules [][]int) int {
	total := 0

updatesLoop:
	// Loop over each upate, and label it so we can jump out of it when needed
	for _, pages := range updates {
		// Check each "page"
		for i, page := range pages {
			// Check page against each "rule"
			for _, rule := range rules {
				// Skip rules that don't apply to this page
				if rule[0] != page {
					continue
				}

				// Check if target page exsits in the page list
				// If not, then it's ok. If it does, it must be after
				// our current position in the array.
				index := slices.Index(pages, rule[1])
				if index != -1 && index < i {
					// This list of pages is invalid, so we can stop here and
					// move to the next list.
					continue updatesLoop
				}
			}
		}

		// Add value of middle element to total
		total += pages[(len(pages)-1)/2]
	}
	return total
}

func Part2(updates [][]int, rules [][]int) int {
	total := 0

	for _, pages := range updates {
		// Check each update and track if it has been updated
		updated := false

	pagesLoop:
		// Loop over the pages in reverse, and label it so we can jump out of it when needed
		for i := len(pages) - 1; i >= 0; i-- {
			page := pages[i]

			// Check page against each "rule"
			for _, rule := range rules {
				// Skip rules that don't apply to this page
				if rule[0] != page {
					continue
				}

				// Check if target page exsits in the page list
				// If not, then it's ok. If it does, check if it appears before
				// the page, which would break the rule. If so, move the page in front
				// of it and re-check the pages again at the same position.
				index := slices.Index(pages, rule[1])
				if index == -1 || index >= i {
					continue
				} else if index < i {
					updated = true
					pages = moveElement(pages, i, index)

					// Increase the page index counter so we "recheck" the pages at this
					// point again for more breaking rules, after things have shifted around.
					i++
					continue pagesLoop
				}
			}
		}

		// Add value of middle element to total if the page was updated
		if updated {
			total += pages[(len(pages)-1)/2]
		}
	}
	return total
}
