
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Client, UserQuestionAnswers, UserQuestionAnswersDto, WAccessRequests } from '../../services/api-client';
import { LoadingService } from '../../services/loader.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AppConstants } from '../../constants/app.constants';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup; // FormGroup to handle form controls
  feedbackOptions: string[] = []; // Options for the dropdown
  AppConstants = AppConstants; // Constants for the application
  Header = "User Registration";
  SubmitLabel = "Submit";
  Step = 0;
  RT = "";
  ARI = "";
  RegisteredEmail = "";
  passwordsDoNotMatch: boolean = false;
  passwordsInvalid: boolean = false;
  questions1: UserQuestionAnswers[] | undefined = []
  questions2: UserQuestionAnswers[] | undefined = []
  questions3: UserQuestionAnswers[] | undefined = []
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private client: Client,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['rt'] != undefined) {
        this.Header = "Change Password";
        this.Step = 1;
        this.RT = params['rt'];
        this.ARI = params['ari'];

      }
    });
    this.initializeForm();
  }

  // Initialize the form with default values and validation rules
  initializeForm(): void {
    this.registerForm = this.fb.group({
      qfcNumber: [{ value: '', disabled: false }, Validators.required],
      dob: [{ value: '', disabled: false }, Validators.required],
      question1: [{ value: '0', disabled: false }],
      question2: [{ value: '0', disabled: false }],
      question3: [{ value: '0', disabled: false }],
      answer1: [{ value: '', disabled: false }],
      answer2: [{ value: '', disabled: false }],
      answer3: [{ value: '', disabled: false }],
      newPassword: [{ value: '', disabled: false }],
      confirmPassword: [{ value: '', disabled: false }],
      // captcha: [''] // Captcha field (required)
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValues = this.registerForm.getRawValue(); // Get raw values, including disabled fields
      if (this.Step == 0) {
        this.loadingService.show();
        const dob: Date = formValues.dob;
        const dobString = `${dob.getFullYear()}-${(dob.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${dob.getDate().toString().padStart(2, '0')}`;
        this.client.submitRegister(formValues.qfcNumber, localStorage.getItem(this.AppConstants.Session.SESSION_EMAIL_ID) ?? "", new Date(dobString), localStorage.getItem(this.AppConstants.Session.SESSION_REG_PASS) ?? "").subscribe({
          next: (response) => {
            this.loadingService.hide();
            if (response.isSuccess && response.response) {
              if (response.response?.errorMessage != "") {
                Swal.fire({
                  html: response.response?.errorMessage,
                  confirmButtonColor: '#a51e36',
                  confirmButtonText: 'Close',
                }).then((result) => {
                  if (result.isConfirmed) {
                    // this.navigateToLogin();
                  }
                });
              }
              else {
                this.Step = 1;
                this.SubmitLabel = "Create Account";
                this.RegisteredEmail = localStorage.getItem(this.AppConstants.Session.SESSION_EMAIL_ID) ?? "";
                this.questions1 = response.response.questionAnswers1;
                this.questions2 = response.response.questionAnswers2;
                this.questions3 = response.response.questionAnswers3;
              }
            }
            else {
              this.toastr.error('Failed to fetch your request.', 'Error');
            }
          },
          error: (error) => {
            this.loadingService.hide();
            console.error('Error occurred while checking forget password request:', error);
            this.toastr.error('Failed checking forget password request.', 'Error');
          },
        });
      }
      else if (this.Step == 1) {

        if (formValues.newPassword == '' || formValues.confirmPassword == '') {
          this.toastr.error('Please fill the required fields.', 'Error');
          return;
        }

        if (formValues.newPassword !== formValues.confirmPassword) {
          this.passwordsDoNotMatch = true;
          this.toastr.error('Passwords do not match.', 'Error');
          return;
        }
        else {
          this.passwordsDoNotMatch = false;
        }

        if (formValues.question1 == "") {
          this.toastr.error('Please choose all the questions.', 'Error');
          return;
        }
        else if (formValues.answer1 == "") {
          this.toastr.error('Please provide an answer to all the questions.', 'Error');
          return;
        }

        if (formValues.question2 == "") {
          this.toastr.error('Please choose all the questions.', 'Error');
          return;
        }
        else if (formValues.answer2 == "") {
          this.toastr.error('Please provide an answer to all the questions.', 'Error');
          return;
        }

        if (formValues.question3 == "") {
          this.toastr.error('Please choose all the questions.', 'Error');
          return;
        }
        else if (formValues.answer3 == "") {
          this.toastr.error('Please provide an answer to all the questions.', 'Error');
          return;
        }

        if (!this.isValidPassword(formValues.newPassword)) {
          this.toastr.error('Password should contain at least one upper case, one lower case and one number and the length between 8 to 14 characters.', 'Error');
          this.passwordsInvalid = true
          return;
        }
        else {
          this.passwordsInvalid = false;
        }

        this.loadingService.show();
        this.client.createAccount(this.RegisteredEmail, localStorage.getItem(this.AppConstants.Session.SESSION_REG_PASS) ?? "", formValues.question1, formValues.answer1, formValues.question2, formValues.answer2, formValues.question3
          , formValues.answer3).subscribe({
            next: (response) => {
              this.loadingService.hide();
              if (response.isSuccess && response.response) {
                localStorage.setItem(this.AppConstants.Session.SESSION_B_IS_REGISTERED, "true");
                this.toastr.success('Account Created Successfully!', 'Success');
                this.router.navigate(['/home']);
              }
              else {
                this.toastr.error('Failed to fetch your create account request.', 'Error');
              }
            },
            error: (error) => {
              this.loadingService.hide();
              console.error('Error occurred while checking create account request:', error);
              this.toastr.error('Failed checking create account request.', 'Error');
            },
          });

      }



    } else {
      console.error('Form is invalid');
      this.registerForm.markAllAsTouched(); // Highlight invalid fields
      this.toastr.warning('Please fill all required fields before submitting.', 'Validation Error');
    }
  }

  // Reset the form to its initial state
  resetForm(): void {
    this.registerForm.reset();
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']); // Replace '/login' with the actual login route
  }

  isLoggedIn(): boolean {
    const userId = localStorage.getItem(this.AppConstants.Session.SESSION_W_USERID);
    return userId !== null && userId !== undefined;
  }

  isValidPassword(password: string): boolean {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9\S]{8,14}$/;
    return regex.test(password);
  }

}

