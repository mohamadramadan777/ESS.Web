import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Client, UserQuestionAnswers,UserQuestionAnswersDto } from '../../services/api-client'; 
import { ToastrService } from 'ngx-toastr';

interface DropdownQuestion {
  value: number | undefined;
  text: string | undefined;
}

@Component({
  selector: 'app-change-securityquestions',
  templateUrl: './change-securityquestions.component.html',
  styleUrls: ['./change-securityquestions.component.scss'],
})


export class ChangeSecurityquestionsComponent {
  // Editable flags
  question1Editable = false;
  question2Editable = false;
  question3Editable = false;

  // Current questions
  question1 = '';
  question2 = '';
  question3 = '';

  // Available questions
  availableQuestions1: DropdownQuestion[] = [];
  availableQuestions2: DropdownQuestion[] = [];
  availableQuestions3: DropdownQuestion[] = [];


  // Form groups
  question1Form: FormGroup;
  question2Form: FormGroup;
  question3Form: FormGroup;

  constructor(private fb: FormBuilder,
    private client: Client,
    private toastr: ToastrService ) {
    this.question1Form = this.fb.group({
      question: new FormControl('', Validators.required),
      answer: new FormControl('', Validators.required),
    });

    this.question2Form = this.fb.group({
      question: new FormControl('', Validators.required),
      answer: new FormControl('', Validators.required),
    });

    this.question3Form = this.fb.group({
      question: new FormControl('', Validators.required),
      answer: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.loadQuestionsDD();
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.client.getUserQa().subscribe({
      next: (response) => {
        if (response && response.response) {
          const lstQA = response.response;
  
          if (lstQA.length > 0) {
            if (lstQA.length > 2) {
              this.question3 = lstQA[2].loginQuestion ?? '';
              this.question3Form.patchValue({
                question: lstQA[2].wLoginQuestionTypeID ?? null,
              });
            }
  
            if (lstQA.length > 1) {
              this.question2 = lstQA[1].loginQuestion ?? '';
              this.question2Form.patchValue({
                question: lstQA[1].wLoginQuestionTypeID ?? null,
              });
            }
  
            this.question1 = lstQA[0].loginQuestion ?? '';
            this.question1Form.patchValue({
              question: lstQA[0].wLoginQuestionTypeID ?? null,
            });
          }
        } else {
          console.error('No data received for user QA.');
        }
      },
      error: (error) => {
        console.error('Failed to fetch user QA:', error);
      },
    });
  }
  
  

  loadQuestionsDD(): void {
    this.client.getUserLoginQuestions(undefined).subscribe({
      next: (response) => {
        if (response && response.response) {
          const lstQA: UserQuestionAnswers[] = response.response;
  
          // Populate available questions for each dropdown based on WLoginQuestionCategoryTypeID
          this.availableQuestions1 = lstQA
            .filter((item) => item.wLoginQuestionCategoryTypeID === 1)
            .map((item) => ({
              value: item.wLoginQuestionTypeID,
              text: item.loginQuestion,
            }));
  
          this.availableQuestions2 = lstQA
            .filter((item) => item.wLoginQuestionCategoryTypeID === 2)
            .map((item) => ({
              value: item.wLoginQuestionTypeID,
              text: item.loginQuestion,
            }));
  
          this.availableQuestions3 = lstQA
            .filter((item) => item.wLoginQuestionCategoryTypeID === 3)
            .map((item) => ({
              value: item.wLoginQuestionTypeID,
              text: item.loginQuestion,
            }));
        } else {
          console.error('No data received for login questions.');
        }
      },
      error: (error) => {
        console.error('Failed to fetch login questions:', error);
      },
    });
  }

  toggleEdit(index: number): void {
    if (index === 1) {
      this.question1Editable = !this.question1Editable;
      if (this.question1Editable) {
        // Explicitly set the dropdown value
        const question1Value = this.question1Form.get('question')?.value;
        this.question1Form.patchValue({
          question: question1Value || this.question1Form.get('question')?.value,
        });
      }
    } else if (index === 2) {
      this.question2Editable = !this.question2Editable;
      if (this.question2Editable) {
        // Explicitly set the dropdown value
        const question2Value = this.question2Form.get('question')?.value;
        this.question2Form.patchValue({
          question: question2Value || this.question2Form.get('question')?.value,
        });
      }
    } else if (index === 3) {
      this.question3Editable = !this.question3Editable;
      if (this.question3Editable) {
        // Explicitly set the dropdown value
        const question3Value = this.question3Form.get('question')?.value;
        this.question3Form.patchValue({
          question: question3Value || this.question3Form.get('question')?.value,
        });
      }
    }
  }

  saveAll(): void {
    // Validate only editable forms and gather data
    if (
      (!this.question1Editable || this.question1Form.valid) &&
      (!this.question2Editable || this.question2Form.valid) &&
      (!this.question3Editable || this.question3Form.valid)
    ) {
      // Get the user question answers list
      const userQuestionAnswers = this.getUserQuestionAnswerList();
  
      // Call the save API with the gathered data
      this.client.saveUserQuestionAnswer(userQuestionAnswers).subscribe({
        next: (response) => {
          if (response && response.response) {
            // Show success toast
            this.toastr.success(
              "Your security questions have been updated successfully!",
              "Success"
            );
  
            // Refresh the page or reset the state
            this.refreshPage();
          } else {
            this.toastr.error(
              "Failed to update security questions. Please try again.",
              "Error"
            );
          }
        },
        error: (error) => {
          console.error("Failed to save security questions:", error);
          this.toastr.error(
            "An unexpected error occurred while saving.",
            "Error"
          );
        },
      });
    } else {
      // Show validation error if forms are invalid
      this.toastr.warning(
        "Please complete all required fields before saving.",
        "Validation Error"
      );
    }
  }
  
  
  getUserQuestionAnswerList(): UserQuestionAnswers[] {
    const lstUserQuestionAnswers: UserQuestionAnswers[] = [];
  
    try {
      // For Question 1
      if (this.question1Editable && this.question1Form.valid) {
        const objUserFirstQuestionAnswer = new UserQuestionAnswersDto();
        objUserFirstQuestionAnswer.wLoginQuestionTypeID = Number(this.question1Form.value.question);
        objUserFirstQuestionAnswer.answer = this.encryptFields(this.question1Form.value.answer.toLowerCase().trim());
        objUserFirstQuestionAnswer.wLoginQuestionCategoryTypeID = 1;
        lstUserQuestionAnswers.push(objUserFirstQuestionAnswer);
      }
  
      // For Question 2
      if (this.question2Editable && this.question2Form.valid) {
        const objUserSecondQuestionAnswer = new UserQuestionAnswersDto();
        objUserSecondQuestionAnswer.wLoginQuestionTypeID = Number(this.question2Form.value.question);
        objUserSecondQuestionAnswer.answer = this.encryptFields(this.question2Form.value.answer.toLowerCase().trim());
        objUserSecondQuestionAnswer.wLoginQuestionCategoryTypeID = 2;
        lstUserQuestionAnswers.push(objUserSecondQuestionAnswer);
      }
  
      // For Question 3
      if (this.question3Editable && this.question3Form.valid) {
        const objUserThirdQuestionAnswer = new UserQuestionAnswersDto();
        objUserThirdQuestionAnswer.wLoginQuestionTypeID = Number(this.question3Form.value.question);
        objUserThirdQuestionAnswer.answer = this.encryptFields(this.question3Form.value.answer.toLowerCase().trim());
        objUserThirdQuestionAnswer.wLoginQuestionCategoryTypeID = 3;
        lstUserQuestionAnswers.push(objUserThirdQuestionAnswer);
      }
    } catch (error) {
      console.error('Error generating question-answer list:', error);
      throw error;
    }
  
    return lstUserQuestionAnswers;
  }
  
  encryptFields(value: string): string {
    // Placeholder for encryption logic; currently returns the input value as is
    return value; //TODO: Implemetn Encryption (Also in Login)
  }

  cancelAll(): void {
    this.question1Editable = false;
    this.question2Editable = false;
    this.question3Editable = false;
    this.question1Form.reset();
    this.question2Form.reset();
    this.question3Form.reset();
  }

  refreshPage(): void {
    // Reset all editable states and forms
    this.question1Editable = false;
    this.question2Editable = false;
    this.question3Editable = false;
    this.question1Form.reset();
    this.question2Form.reset();
    this.question3Form.reset();
    
    // Reload the dropdowns and data
    this.loadQuestions();
    this.loadQuestionsDD();
  }
  isAnyQuestionEditable(): boolean {
    return this.question1Editable || this.question2Editable || this.question3Editable;
  }
  
}
