import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

interface SecurityQuestion {
  question: string;
  answer: string;
  editable: boolean;
}

@Component({
  selector: 'app-change-securityquestions',
  templateUrl: './change-securityquestions.component.html',
  styleUrls: ['./change-securityquestions.component.scss'],
})
export class ChangeSecurityquestionsComponent {
  securityQuestions: SecurityQuestion[] = [
    { question: "What is your mother's maiden name?", answer: '', editable: false },
    { question: 'Who is your favourite actor?', answer: '', editable: false },
    { question: 'In which year did you graduate from high school?', answer: '', editable: false },
  ];

  availableQuestions: string[] = [
    "What is your mother's maiden name?",
    'Who is your favourite actor?',
    'In which year did you graduate from high school?',
    'What is your favourite book?',
    'What is your dream job?',
  ];

  answerForms: { [key: number]: FormGroup } = {};

  constructor(private fb: FormBuilder) {
    this.securityQuestions.forEach((_, index) => {
      this.answerForms[index] = new FormGroup({
        question: new FormControl('', Validators.required),
        answer: new FormControl('', Validators.required),
      });
    });
  }

  get isAnyRowEditable(): boolean {
    return this.securityQuestions.some((q) => q.editable);
  }

  toggleEdit(index: number): void {
    this.securityQuestions[index].editable = !this.securityQuestions[index].editable;
    if (this.securityQuestions[index].editable) {
      this.answerForms[index].patchValue({
        question: this.securityQuestions[index].question,
        answer: this.securityQuestions[index].answer,
      });
    } else {
      this.answerForms[index].reset();
    }
  }

  saveAllAnswers(): void {
    this.securityQuestions.forEach((question, index) => {
      if (this.answerForms[index].valid) {
        question.question = this.answerForms[index].get('question')?.value;
        question.answer = this.answerForms[index].get('answer')?.value;
        question.editable = false;
      } else {
        console.error(`Form is invalid for question ${index + 1}`);
      }
    });
  }

  cancelAllEdits(): void {
    this.securityQuestions.forEach((question, index) => {
      question.editable = false;
      this.answerForms[index].reset();
    });
  }
}
