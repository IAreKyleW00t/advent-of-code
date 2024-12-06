package main

import (
	"bufio"
	"log"
	"os"
	"slices"
	"time"
)

type Coordinate struct {
	value rune
	X int
	Y int
}

func main() {
	log.SetOutput(os.Stdout) // Log to stdout instead of stderr
	start, walls, size := GetInputData(os.Stdin)

	p1Start := time.Now()
	part1 := Part1(start, walls, size)
	p1End := time.Since(p1Start)
	log.Printf("Part 1: %d (%s)", part1, p1End)

	p2Start := time.Now()
	part2 := Part2(start, walls, size)
	p2End := time.Since(p2Start)
	log.Printf("Part 2: %d (%s)", part2, p2End)
	log.Printf("Total time: %s", p1End+p2End)
}

// Utility function to read entire input file
func GetInputData(file *os.File) (Coordinate, []Coordinate, []int) {
	start := Coordinate{}
	walls := []Coordinate{}

	lc := 0
	width := 0
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		width = len(line)

		// Parse from grid
		// We only care about walls and starting position
		for i, char := range line {
			if char == '#' {
				walls = append(walls, Coordinate{X: i, Y: lc, value: char})
			} else if char == '^' {
				start = Coordinate{X: i, Y: lc, value: char}
			}
		}
		lc++
	}
	return start, walls, []int{width, lc}
}

func FindNearestWall(pos Coordinate, walls []Coordinate) (Coordinate, bool) {
	nearest := Coordinate{X: -1, Y: -1, value: '.'}

	// Check each wall for ones that apply to the move
	for _, wall := range walls {
		if pos.value == '^' { // North
			// Skip walls that don't apply
			if wall.X != pos.X || wall.Y > pos.Y {
				continue
			}
			
			// If this is the first wall we've found, set it as the nearest.
			// Otherwise check if this is closer and update as needed.
			if nearest.value == '.' {
				nearest = wall
			} else if wall.Y > nearest.Y {
					nearest = wall
			}
		} else if pos.value == '>' { // East
			// Skip walls that don't apply
			if wall.Y != pos.Y || wall.X < pos.X {
				continue
			}

			// If this is the first wall we've found, set it as the nearest.
			// Otherwise check if this is closer and update as needed.
			if nearest.value == '.' {
				nearest = wall
			} else if wall.X < nearest.X {
				nearest = wall
			}
		} else if pos.value == 'v' { // South
			// Skip walls that don't apply
			if wall.X != pos.X || wall.Y < pos.Y {
				continue
			}

			// If this is the first wall we've found, set it as the nearest.
			// Otherwise check if this is closer and update as needed.
			if nearest.value == '.' {
				nearest = wall
			} else if wall.Y <nearest.Y {
				nearest = wall
			}
		} else if pos.value == '<' { // West
			// Skip walls that don't apply
			if wall.Y != pos.Y || wall.X > pos.X {
				continue
			}

			// If this is the first wall we've found, set it as the nearest.
			// Otherwise check if this is closer and update as needed.
			if nearest.value == '.' {
				nearest = wall
			} else if wall.X > nearest.X {
				nearest = wall
			}
		}
	}

	return nearest, nearest.value != '.'
}

func Part1(pos Coordinate, walls []Coordinate, size []int) int {
	// We can cram the smaller X,Y coordinates into a single int
	// with some bitshift, which is about 2x faster than using a struct.
	seen := []int{pos.X | pos.Y << 16}

	for {
		// If we found a wall then track the tiles we have not seen yet
		// that are between the current position and the wall.
		// If we don't find a wall, then we will walk to the edge of the map.
		wall, found := FindNearestWall(pos, walls)
		if pos.value == '^' { // North
			if found {
				for i := wall.Y+1; i < pos.Y; i++ {
					s := pos.X | i << 16
					if !slices.Contains(seen, s) {
						seen = append(seen, s)
					}
				}
				
				// Rotate 90
				pos.value = '>'
				pos.Y = wall.Y+1
			} else { // Edge
				for i := 0; i < pos.Y; i++ {
					s := pos.X | i << 16
					if !slices.Contains(seen, s) {
						seen = append(seen, s)
					}
				}
				break
			}
		} else if pos.value == '>' { // East
			if found {
				for i := pos.X; i < wall.X; i++ {
					s := i | pos.Y << 16
					if !slices.Contains(seen, s) {
						seen = append(seen, s)
					}
				}

				// Rotate 90
				pos.value = 'v'
				pos.X = wall.X-1
			} else { // Edge
				for i := pos.X; i < size[0]; i++ {
					s := i | pos.Y << 16
					if !slices.Contains(seen, s) {
						seen = append(seen, s)
					}
				}
				break
			}
		} else if pos.value == 'v' { // South
			if found {
				for i := pos.Y; i < wall.Y; i++ {
					s := pos.X | i << 16
					if !slices.Contains(seen, s) {
						seen = append(seen, s)
					}
				}

				// Rotate 90
				pos.value = '<'
				pos.Y = wall.Y-1
			} else { // Edge
				for i := pos.Y; i < size[1]; i++ {
					s := pos.X | i << 16
					if !slices.Contains(seen, s) {
						seen = append(seen, s)
					}
				}
				break
			}
		} else if pos.value == '<' { // West
			if found {
				for i := wall.X+1; i < pos.X; i++ {
					s := i | pos.Y << 16
					if !slices.Contains(seen, s) {
						seen = append(seen, s)
					}
				}

				// Rotate 90
				pos.value = '^'
				pos.X = wall.X+1
			} else { // Edge
				for i := 0; i < pos.X; i++ {
					s := i | pos.Y << 16
					if !slices.Contains(seen, s) {
						seen = append(seen, s)
					}
				}
				break
			}
		}
	}
	return len(seen)
}

func Part2(start Coordinate, walls []Coordinate, size []int) int {
	total := 0
	return total
}
