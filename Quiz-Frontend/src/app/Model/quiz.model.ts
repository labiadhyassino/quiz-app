export class Quiz {
  _id?: string; // MongoDB ID
  type: string = ""; // Type of quiz (e.g., "math", "science")
  question: string = ""; // The question text
  options: string[] = []; // Array of options
  correctAnswer: string = ""; // Correct answer
}