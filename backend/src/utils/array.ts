export function shuffleArray<T>(array: T[]): T[] {
  // Create a copy of the array to avoid mutating the original
  const shuffledArray = array.slice();
  
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    
    // Swap elements at indices i and j
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  
  return shuffledArray;
}

// Example usage
// const myArray = [1, 2, 3, 4, 5];
// const randomizedArray = shuffleArray(myArray);
// console.log(randomizedArray); // Output will be a random permutation of [1, 2, 3, 4, 5]
