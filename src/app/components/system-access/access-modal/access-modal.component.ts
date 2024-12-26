import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-access-modal',
  templateUrl: './access-modal.component.html',
  styleUrls: ['./access-modal.component.scss']
})
export class AccessModalComponent {
  @Output() modalClosed = new EventEmitter<void>();

  isOpen = false; // Track whether the modal is open or closed
  selectedAccessType: string = ''; // Track the selected access type

  // Form data for each access type
  documentAdminForm = {
    name: '',
    jobTitle: '',
    dob: '',
    nationality: '',
    email: '',
    confirmEmail: ''
  };

  approvedIndividualForm = {
    name: '',
    controlledFunctions: ''
  };

  // Open the modal
  openModal(): void {
    this.isOpen = true;
  }

  // Close the modal and reset its state
  closeModal(): void {
    this.isOpen = false;
    this.resetForm(); // Reset the dropdown and form fields
    this.modalClosed.emit(); // Notify parent component if needed
  }

  // Handle dropdown selection change
  onAccessTypeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedAccessType = target.value;
  }

  // Reset the form fields and dropdown
  private resetForm(): void {
    this.selectedAccessType = ''; // Reset dropdown
    this.documentAdminForm = {
      name: '',
      jobTitle: '',
      dob: '',
      nationality: '',
      email: '',
      confirmEmail: ''
    };
    this.approvedIndividualForm = {
      name: '',
      controlledFunctions: ''
    };
  }

  // Check if all fields are filled for the current form
  isFormValid(): boolean {
    if (this.selectedAccessType === 'documentAdmin') {
      const { name, jobTitle, dob, nationality, email, confirmEmail } = this.documentAdminForm;
      return (
        name.trim() !== '' &&
        jobTitle.trim() !== '' &&
        dob.trim() !== '' &&
        nationality.trim() !== '' &&
        email.trim() !== '' &&
        confirmEmail.trim() !== '' &&
        email === confirmEmail // Ensure email and confirmEmail match
      );
    } else if (this.selectedAccessType === 'approvedIndividual') {
      const { name, controlledFunctions } = this.approvedIndividualForm;
      return name.trim() !== '' && controlledFunctions.trim() !== '';
    }
    return false;
  }

  // Handle Request button click
  onRequest(): void {
    if (this.isFormValid()) {
      console.log('Form submitted successfully!');
      // Add your form submission logic here
    }
  }
}
