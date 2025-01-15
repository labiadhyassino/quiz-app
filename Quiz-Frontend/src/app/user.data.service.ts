import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Quiz } from './Model/quiz.model';
import { User } from './Model/user.model';
import { map } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class UserDataService {

    user: User = new User();
    quiz: Quiz = new Quiz();
    type: string = "";
    beginnerScore: number = 0;
    intermediateScore: number = 0;

    constructor(private http: HttpClient) { }

    // Get user data
    getUserData() {
        return this.user;
    }

    // Fetch questions from the backend based on the quiz type
    getQuestions() {
        return this.http.get<Quiz[]>('http://localhost:3000/questions/' + this.type).pipe(
            map((result: Quiz[]) => {
                return result;
            })
        );
    }

    // Save user answers to the backend
    storeUserAnswersInDb() {
        const payload = {
            name: this.user.name,
            email: this.user.email,
            question: this.user.question,
            answers: this.user.answers
        };

        this.http.post<any>('http://localhost:3000/saveAnswers', payload).subscribe({
            next: (data) => {
                console.log("Success", data);
            },
            error: (error) => {
                console.error('There was an error!', error);
            }
        });
    }
}