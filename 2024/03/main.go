package main

import (
	"bufio"
	"log"
	"os"
	"regexp"
	"strconv"
	"strings"
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
func GetInputData(file *os.File) string {
	lines := []string{}
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}
	return strings.Join(lines, "")
}

// Utility function to (safely) parse int from string
func ParseInt(a string) int {
	num, err := strconv.Atoi(a)
	if err != nil {
		panic(err)
	}
	return num
}

func Part1(data string) int {
	total := 0

	// Simple regex matching - not crazy fast, but certainly the easiest.
	r := regexp.MustCompile(`mul\(([0-9]{1,3}),([0-9]{1,3})\)`)
	for _, match := range r.FindAllStringSubmatch(data, -1) {
		prod := ParseInt(match[1]) * ParseInt(match[2])
		total += prod
	}
	return total
}

func Part2(data string) int {
	total := 0
	doing := true

	// We can still use regex since the matches will be in order,
	// so we can just flip back and forth.
	r := regexp.MustCompile(`(don't\(\)|do\(\)|mul\(([0-9]{1,3}),([0-9]{1,3})\))`)
	for _, match := range r.FindAllStringSubmatch(data, -1) {
		if match[1] == `do()` { // enabled
			doing = true
		} else if match[1] == `don't()` { // disabled
			doing = false
		} else if doing { // numbers
			prod := ParseInt(match[2]) * ParseInt(match[3])
			total += prod
		}
	}
	return total
}
