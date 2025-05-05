import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { RegistrationService } from '../services/registration.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  personalInfoForm: FormGroup;
  documentForm: FormGroup;
  addressForm: FormGroup;
  businessForm: FormGroup;
  fileUploadForm: FormGroup;
  paymentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private snackBar: MatSnackBar
  ) {
    this.personalInfoForm = this.fb.group({
      first_name: ['', Validators.required],
      middle_name: ['', Validators.required],
      last_name: ['', Validators.required],
      father_name: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      nationality: ['', Validators.required],
    });

    this.documentForm = this.fb.group({
      pan_number: ['', Validators.required],
      gst_number: ['', Validators.required],
      aadhaar_number: ['', Validators.required],
      education: ['', Validators.required],
      marksheet_file: [null],
    });

    this.addressForm = this.fb.group({
      residential_address: ['', Validators.required],
      business_address: ['', Validators.required],
      alt_contact: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.businessForm = this.fb.group({
      local_reference: ['', Validators.required],
      business_name: ['', Validators.required],
      circle: ['', Validators.required],
      ssa: ['', Validators.required],
      area: ['', Validators.required],
      zone: ['', Validators.required],
    });

    this.fileUploadForm = this.fb.group({
      pan_file: [null, Validators.required],
      aadhaar_file: [null, Validators.required],
      photo_file: [null, Validators.required],
      video_file: [null],
    });

    this.paymentForm = this.fb.group({
      otp: ['', Validators.required],
      security_deposit: ['', Validators.required],
      notify: [true, Validators.required],
    });
  }

  onFileChange(event: any, controlName: string): void {
    const file = event.target.files[0];
    if (file) {
      this.fileUploadForm.get(controlName)?.setValue(file);
      this.documentForm.get(controlName)?.setValue(file);
    }
  }

  submitForm(stepper: any): void {
    if (this.formsAreValid()) {
      const formData = new FormData();

      const combinedData = {
        ...this.personalInfoForm.value,
        ...this.documentForm.value,
        ...this.addressForm.value,
        ...this.businessForm.value,
        ...this.paymentForm.value,
      };
      const dob = new Date(combinedData.dob);
      combinedData.dob = dob.toISOString().split('T')[0];
      for (const key in combinedData) {
        formData.append(key, combinedData[key]);
      }

      const fileControls = this.fileUploadForm.controls;
      for (const key in fileControls) {
        formData.append(key, fileControls[key].value);
      }

      this.registrationService.submitRegistration(formData).subscribe(
        (response) => {
          this.snackBar.open('Registration successful!', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
          });

          this.personalInfoForm.reset();
          this.documentForm.reset();
          this.addressForm.reset();
          this.businessForm.reset();
          this.fileUploadForm.reset();
          this.paymentForm.reset();

          stepper.reset();
        },
        (error) => {
          this.snackBar.open('Registration failed. Try again.', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
          });
          console.error('Registration failed', error);
        }
      );
    }
  }

  formsAreValid(): boolean {
    return (
      this.personalInfoForm.valid &&
      this.documentForm.valid &&
      this.addressForm.valid &&
      this.businessForm.valid &&
      this.fileUploadForm.valid &&
      this.paymentForm.valid
    );
  }
}
