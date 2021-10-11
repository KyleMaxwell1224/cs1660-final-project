package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	input := bufio.NewScanner(os.Stdin)
	fmt.Println("Welcome to Kyle's Big Data Processing Application")

	for input.Scan() {
		fmt.Println("Please type the number that corresponds to which application you'd like to run:")
		fmt.Println("1. Apache Hadoop")
		fmt.Println("2. Apache Spark")
		fmt.Println("3. Jupyter Notebook")
		fmt.Printf("4. SonarQube and SonarScanner\n")
		fmt.Print("Enter your number here > ")

	}

}
