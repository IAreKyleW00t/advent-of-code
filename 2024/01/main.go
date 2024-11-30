package main

import (
	"bufio"
	"log"
	"os"
	"time"
)

func main() {
	log.SetOutput(os.Stdout) // Log to stdout instead of stderr

	input := bufio.NewScanner(os.Stdin)
	for input.Scan() {
		log.Println(input.Text())
	}

	p1 := time.Now()
	part1()
	p2 := time.Now()
	part2()

	log.Println("================================================================")
	log.Printf("Part 1: %s", time.Since(p1))
	log.Printf("Part 2: %s", time.Since(p2))
}

func part1() int {
	return 0
}

func part2() int {
	return 0
}
