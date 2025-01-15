import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Quiz } from 'src/app/Model/quiz.model';
import { UserDataService } from 'src/app/user.data.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  quiz: Quiz[] = [];
  currentQuestionIndex: number = 0;
  enableNextButton = false;
  answer: string = "";
  optionStatus = null;
  totalBeginnerQuestion: number = 0;
  totalIntermediateQuestion: number = 0;
  tempUserDataService: UserDataService;
  isAnswerSelected: boolean = false;
  isDisableSelection: boolean = false;
  scoreCounter = 0;
  timer = 60;
  ticker: any;
  timeThreshold = "00:00";

  constructor(private userDataService: UserDataService, private router: Router, private http: HttpClient) {
    this.tempUserDataService = JSON.parse(localStorage.getItem('userDataService') || '{}');
    this.userDataService.user = this.tempUserDataService.user;
    this.userDataService.type = this.tempUserDataService.type;
    this.userDataService.getQuestions()
      .subscribe(questions => {
        this.quiz = questions;
        console.log("Questions loaded:", this.quiz);
      });
  }

  ngOnInit(): void {
    this.startTicker();
  }

  startTicker() {
    this.ticker = setInterval(() => {
      this.timer = this.timer - 1;
      if (this.toHHMMSS(this.timer) === this.timeThreshold) {
        clearInterval(this.ticker);
        this.router.navigate(['/result', { timer: this.toHHMMSS(this.timer) }]);
        this.storeAndCalculatePercent();
      }
    }, 1000);
  }

  onOptionSelected(optionSelected: any) {
    this.enableNextButton = true;
    this.answer = optionSelected;
    console.log("Selected answer:", this.answer);
    this.isAnswerSelected = true;
    this.isDisableSelection = true;
    this.quizScoreCounter();
  }

  quizScoreCounter() {
    const correctAnswer = this.quiz[this.currentQuestionIndex].correctAnswer.trim().toLowerCase();
    const userAnswer = this.answer.trim().toLowerCase();
    console.log("Correct answer:", correctAnswer);
    console.log("User answer:", userAnswer);

    if (correctAnswer === userAnswer) {
      this.scoreCounter++;
      console.log("Score updated:", this.scoreCounter);
    }
  }

  nextStep() {
    // Given answer
    console.log("User Answer: " + this.answer);

    // Pushing answered question and answer in user's object
    this.userDataService.user.question.push(this.quiz[this.currentQuestionIndex].question);
    this.userDataService.user.answers.push(this.answer);

    // Counting total questions in each category
    this.increaseCategoryQuestionCount();

    // Check answer
    const correctAnswer = this.quiz[this.currentQuestionIndex].correctAnswer.trim().toLowerCase();
    const userAnswer = this.answer.trim().toLowerCase();

    if (correctAnswer === userAnswer) {
      // Increasing score on correct answer
      if (this.quiz[this.currentQuestionIndex].type === "Beginner") {
        this.userDataService.beginnerScore++;
        console.log("Beginner score updated:", this.userDataService.beginnerScore);
      }

      if (this.quiz[this.currentQuestionIndex].type === "Intermediate") {
        this.userDataService.intermediateScore++;
        console.log("Intermediate score updated:", this.userDataService.intermediateScore);
      }

      this.answer = "";
    }

    // Next question
    this.currentQuestionIndex++;

    // Show result
    if (this.quiz.length === this.currentQuestionIndex) {
      // Storing answered questions and answers in db
      this.userDataService.storeUserAnswersInDb();

      // Calculating percentage score
      this.userDataService.beginnerScore = (this.userDataService.beginnerScore / this.totalBeginnerQuestion) * 100;
      this.userDataService.intermediateScore = (this.userDataService.intermediateScore / this.totalIntermediateQuestion) * 100;
      localStorage.setItem('userDataService', JSON.stringify(this.userDataService));
      if (this.currentQuestionIndex + 1 === 10) { clearInterval(this.ticker); }
      this.router.navigate(['/result', { timer: this.toHHMMSS(this.timer) }]);
    }

    // Deselect all the options
    this.enableNextButton = false;
    this.optionStatus = null;
    this.isAnswerSelected = false;
    this.isDisableSelection = false;
  }

  storeAndCalculatePercent(): void {
    this.userDataService.storeUserAnswersInDb();
    this.userDataService.beginnerScore = (this.userDataService.beginnerScore / this.totalBeginnerQuestion) * 100;
    this.userDataService.intermediateScore = (this.userDataService.intermediateScore / this.totalIntermediateQuestion) * 100;
    localStorage.setItem('userDataService', JSON.stringify(this.userDataService));
  }

  increaseCategoryQuestionCount() {
    // Counting different category questions
    if (this.quiz[this.currentQuestionIndex].type === "Beginner") {
      this.totalBeginnerQuestion++;
      console.log("Total Beginner questions:", this.totalBeginnerQuestion);
    }

    if (this.quiz[this.currentQuestionIndex].type === "Intermediate") {
      this.totalIntermediateQuestion++;
      console.log("Total Intermediate questions:", this.totalIntermediateQuestion);
    }
  }

  reviewAnswer(answer: string) {
    const correctAnswer = this.quiz[this.currentQuestionIndex].correctAnswer.trim().toLowerCase();
    const userAnswer = answer.trim().toLowerCase();
    return correctAnswer === userAnswer;
  }

  toHHMMSS(sec_num: any) {
    var hours = Math.floor(sec_num / 3600).toString();
    var minutes = Math.floor((sec_num - (parseInt(hours) * 3600)) / 60).toString();
    var seconds = (sec_num - (parseInt(hours) * 3600) - (parseInt(minutes) * 60)).toString();
    if (parseInt(hours) < 10) { hours = "0" + hours; }
    if (parseInt(minutes) < 10) { minutes = "0" + minutes; }
    if (parseInt(seconds) < 10) { seconds = "0" + seconds; }
    return minutes + ':' + seconds + '';
  }
} 

