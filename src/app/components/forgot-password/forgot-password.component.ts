import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Client, UserQuestionAnswers, UserQuestionAnswersDto, WAccessRequests } from '../../services/api-client';
import { LoadingService } from '../../services/loader.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AppConstants } from '../../constants/app.constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup; // FormGroup to handle form controls
  feedbackOptions: string[] = []; // Options for the dropdown
  AppConstants = AppConstants; // Constants for the application
  Header = "Forgot Password";
  Step = 0;
  RT = "";
  ARI = "";
  passwordsDoNotMatch: boolean = false;
  passwordsInvalid: boolean = false;
  questions: UserQuestionAnswers[] = []
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
    this.resetPasswordForm = this.fb.group({
      qfcNumber: [{ value: '', disabled: false }, Validators.required], // QFC Number field (disabled when logged in)
      email: [{ value: '', disabled: false }, [Validators.required, Validators.email]], // Email field (disabled when logged in)
      answer: [{ value: '', disabled: false }],
      selectedQuestion: [{ value: '', disabled: false }],
      newPassword: [{ value: '', disabled: false }],
      confirmPassword: [{ value: '', disabled: false }],
      captcha: [''] // Captcha field (required)
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      const formValues = this.resetPasswordForm.getRawValue(); // Get raw values, including disabled fields
      if (this.Step == 0 || this.Step == 1) {
        this.loadingService.show();
        this.client.checkAccountExists(formValues.qfcNumber, formValues.email, "", true).subscribe({
          next: (response) => {
            if (response.isSuccess && response.response) {
              if (this.Step == 0) {
                if (response.response.wAccessRequestID != null && response.response.wAccessRequestID != 0) {
                  this.client.sendEmailToWebsiteUserFp(formValues.email, response.response.wAccessRequestID, formValues.qfcNumber).subscribe({
                    next: (response2) => {
                      this.loadingService.hide();
                      const message = "Thank you for contacting QFCRA IT Support. You will receive an email from us shortly with instructions on how to reset your password. If you do not receive such an email in your Inbox, please check your Junk/Spam folders before contacting us.";
                      // Display confirmation dialog
                      Swal.fire({
                        html: message,
                        confirmButtonColor: '#a51e36',
                        confirmButtonText: 'Close',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          this.navigateToLogin();
                        }
                      });
                    },
                    error: (error) => {
                      this.loadingService.hide();
                      console.error('Error occurred while submitting forget password:', error);
                      this.toastr.error('Failed to submit forget password.', 'Error');
                    },
                  });
                }
                else {
                  this.client.insertResetPasswordAudit(formValues.email, "", "").subscribe({
                    next: (response) => {
                      this.loadingService.hide();
                      const message = "Thank you for contacting QFCRA IT Support. You will receive an email from us shortly with instructions on how to reset your password. If you do not receive such an email in your Inbox, please check your Junk/Spam folders before contacting us.";
                      // Display confirmation dialog
                      Swal.fire({
                        html: message,
                        confirmButtonColor: '#a51e36',
                        confirmButtonText: 'Close',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          this.navigateToLogin();
                        }
                      });
                    },
                    error: (error) => {
                      this.loadingService.hide();
                      console.error('Error while submitting forget password:', error);
                      this.toastr.error('Failed to submit forget password.', 'Error');
                    }
                  });
                }
              }
              else if (this.Step == 1) {
                if (response.response.accountLocked) {
                  this.loadingService.hide();
                  const lockedMessage = 'Your account has been locked for security reasons.<br/> Please contact QFCRA IT Support <a href="../contactus" onclick="/contactus()" style="color: #9c1f2f; text-decoration:underline;">here</a>.'
                  Swal.fire({
                    html: lockedMessage,
                    confirmButtonColor: '#a51e36',
                    confirmButtonText: 'Close',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.navigateToLogin();
                    }
                  });
                }
                this.client.checkResetPasswordToken(formValues.email, this.RT, formValues.qfcNumber).subscribe({
                  next: (response2) => {
                    this.loadingService.hide();
                    if (response2.isSuccess && response2.response) {
                      this.client.getUserQaFp(this.ARI).subscribe({
                        next: (response3) => {
                          this.loadingService.hide();
                          if (response3.isSuccess && response3.response) {
                            this.Step = 2;
                            this.questions = response3.response;
                          }
                          else {
                            console.error('Fetching security questions: empty response');
                          }
                        },
                        error: (error) => {
                          this.loadingService.hide();
                          console.error('Error occurred while fetching security questions:', error);
                          this.toastr.error('Failed fetching security questions.', 'Error');
                        },
                      });
                    }
                    else {
                      const invalidRequestMessage = 'We are unable to validate your request. It could be because the email address you entered is incorrect or your password has already been reset using this link or your account has been locked for security reasons. Please enter the correct email address or click <a href="../forgotpassword" style="color: #9c1f2f;text-decoration:underline;">Forgot Password</a>. If you need further assistance with your account, please contact QFCRA IT Support <a href="../contactus" style="color: #9c1f2f;text-decoration:underline;">here</a>.'
                      Swal.fire({
                        html: invalidRequestMessage,
                        confirmButtonColor: '#a51e36',
                        confirmButtonText: 'Close',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          // this.navigateToLogin();
                        }
                      });
                    }

                  },
                  error: (error) => {
                    this.loadingService.hide();
                    console.error('Error occurred while checking forget password request:', error);
                    this.toastr.error('Failed checking forget password request.', 'Error');
                  },
                });
              }
            } else {
              this.loadingService.hide();
              this.toastr.error('Failed to submit forget password. Please try again.', 'Error');
            }
          },
          error: (error) => {
            this.loadingService.hide();
            console.error('Error while submitting forget password:', error);
            this.toastr.error('An unexpected error occurred. Please try again.', 'Error');
          }
        });
      }
      else if (this.Step == 2) {
        if (formValues.selectedQuestion == "") {
          this.toastr.error('Please choose a question.', 'Error');
        }
        else if (formValues.answer == "") {
          this.toastr.error('Please provide an answer to the question.', 'Error');
        }
        else {
          const objUserQA = new UserQuestionAnswersDto();
          objUserQA.wAccessRequestID = this.ARI;
          objUserQA.wLoginQuestionTypeID = formValues.selectedQuestion;
          objUserQA.uqa = formValues.answer;
          objUserQA.individualEmailAddress = formValues.email;
          objUserQA.userSessionID = "SessionID";

          this.loadingService.show();
          this.client.checkUserAnswerForResetPassword(objUserQA).subscribe({
            next: (response4) => {
              this.loadingService.hide();
              if (response4.isSuccess && response4.response) {
                this.Step = 3;
              }
              else {
                formValues.answer = "";
                this.toastr.error('The answer you have provided to the security question is invalid.', 'Error');
              }
            },
            error: (error) => {
              this.loadingService.hide();
              console.error('Error occurred while validating security question:', error);
              this.toastr.error('Failed validating security question.', 'Error');
            },
          });
        }
      }
      else if (this.Step == 3) {
        if(formValues.newPassword == '' || formValues.confirmPassword == ''){
          this.toastr.error('Please fill the required fields.', 'Error');
        }
        if (formValues.newPassword !== formValues.confirmPassword) {
          this.passwordsDoNotMatch = true;
          this.toastr.error('Passwords do not match.', 'Error');
          return;
        }
        else {
          this.passwordsDoNotMatch = false;
        }
    
        if (!this.isValidPassword(formValues.newPassword)) {
          this.toastr.error('Password should contain at least one upper case, one lower case and one number and the length between 8 to 14 characters.', 'Error');
          this.passwordsInvalid = true
          return;
        }
        else {
          this.passwordsInvalid = false;
        }
    
    
        this.loadingService.show(); // Show loader before API call
        //TODO: Encryption here
        this.client.refreshFp(this.ARI + '!@#$@#!-' + formValues.newPassword).subscribe({
          next: (response) => {
            this.loadingService.hide(); // Hide loader after API call
            if (response && response.response) {
              this.toastr.success('Your password has been reset successfully!', 'Success');
              this.router.navigate(['/login']); // Navigate to login page
            } else {
              this.toastr.error('Failed to reset password. Please try again.', 'Error');
            }
          },
          error: (error) => {
            this.loadingService.hide(); // Hide loader on error
            console.error('Error resetting password:', error);
            this.toastr.error('An unexpected error occurred. Please try again later.', 'Error');
          },
        });
      }

    } else {
      console.error('Form is invalid');
      this.resetPasswordForm.markAllAsTouched(); // Highlight invalid fields
      this.toastr.warning('Please fill all required fields before submitting.', 'Validation Error');
    }
  }

  // Reset the form to its initial state
  resetForm(): void {
    this.resetPasswordForm.reset();
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
