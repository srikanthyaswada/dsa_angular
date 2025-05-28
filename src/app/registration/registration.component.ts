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
import { ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

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
  aadhaarForm: FormGroup;
  personalInfoForm: FormGroup;
  documentForm: FormGroup;
  addressForm: FormGroup;
  businessForm: FormGroup;
  fileUploadForm: FormGroup;
  paymentForm: FormGroup;
  @ViewChild('stepper') stepper!: MatStepper;
  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private snackBar: MatSnackBar
  ) {
    this.aadhaarForm = this.fb.group({
      aadhaar_number: [
        '',
        [Validators.required, Validators.pattern(/^\d{12}$/)],
      ],
      aadhaar_file: ['', Validators.required],
    });
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
      pan_number: [
        '',
        [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)],
      ],
      gst_number: ['', Validators.required],
      education: ['', Validators.required],
      marksheet_file: [null, Validators.required],
    });

    this.addressForm = this.fb.group({
      residential_address: ['', Validators.required],
      business_address: ['', Validators.required],
      alt_contact: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
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
      photo_file: [null, Validators.required],
      video_file: [null, Validators.required],
    });

    this.paymentForm = this.fb.group({
      otp: ['', Validators.required],
      security_deposit: ['', Validators.required],
      notify: [true, Validators.required],
    });
  }

  // onFileChange(event: any, controlName: string): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.aadhaarForm.get(controlName)?.setValue(file);
  //     this.fileUploadForm.get(controlName)?.setValue(file);
  //     this.documentForm.get(controlName)?.setValue(file);
  //   }
  // }

  onFileChange(event: any, controlName: string): void {
    const file = event.target.files[0];
    if (file) {
      if (this.aadhaarForm.contains(controlName)) {
        this.aadhaarForm.get(controlName)?.setValue(file);
      } else if (this.fileUploadForm.contains(controlName)) {
        this.fileUploadForm.get(controlName)?.setValue(file);
      } else if (this.documentForm.contains(controlName)) {
        this.documentForm.get(controlName)?.setValue(file);
      }
    }
  }
onAadhaarFileChange(event: any): void {
  const file = event.target.files[0];
  if (file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      this.snackBar.open(
        'Invalid file type for Aadhaar. Allowed: JPG, PNG, PDF',
        'Close',
        { duration: 3000 }
      );
      this.aadhaarForm.get('aadhaar_file')?.setValue(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.snackBar.open('Aadhaar file size must be under 5MB', 'Close', {
        duration: 3000,
      });
      this.aadhaarForm.get('aadhaar_file')?.setValue(null);
      return;
    }

    this.aadhaarForm.get('aadhaar_file')?.setValue(file);

    // 🔴 Clear previously auto-filled personal info
    this.personalInfoForm.reset();

    // Simulate OCR result (replace with real API call)
    setTimeout(() => {
      const fakeOcrData = {
        first_name: 'Srikanth',
        middle_name: 'K',
        last_name: 'Yaswada',
        dob: new Date(1990, 4, 19),
        gender: 'Male',
        aadhaar_number: this.aadhaarForm.get('aadhaar_number')?.value || '',
        nationality: 'Indian',
      };

      // Patch the personalInfoForm with OCR data
      this.personalInfoForm.patchValue({
        first_name: fakeOcrData.first_name,
        middle_name: fakeOcrData.middle_name,
        last_name: fakeOcrData.last_name,
        dob: fakeOcrData.dob,
        gender: fakeOcrData.gender,
        nationality: fakeOcrData.nationality,
      });

      // Optionally auto-fill Aadhaar number
      if (!this.aadhaarForm.get('aadhaar_number')?.value) {
        this.aadhaarForm.patchValue({
          aadhaar_number: fakeOcrData.aadhaar_number,
        });
      }

      this.snackBar.open('Aadhaar OCR data auto-filled', 'Close', {
        duration: 2000,
      });
    }, 1500);
  }
}


  submitForm(stepper: any): void {
    if (this.formsAreValid()) {
      const formData = new FormData();

      const combinedData = {
        ...this.aadhaarForm.value,
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
            panelClass: ['snackbar-success'],
          });
          this.aadhaarForm.reset();
          this.personalInfoForm.reset();
          this.documentForm.reset();
          this.addressForm.reset();
          this.businessForm.reset();
          this.fileUploadForm.reset();
          this.paymentForm.reset();
          this.stepper.reset();
        },
        (error) => {
          this.snackBar.open('Registration failed. Try again.', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['snackbar-error'],
          });
          console.error('Registration failed', error);
        }
      );
    }
  }

  formsAreValid(): boolean {
    return (
      this.aadhaarForm.valid &&
      this.personalInfoForm.valid &&
      this.documentForm.valid &&
      this.addressForm.valid &&
      this.businessForm.valid &&
      this.fileUploadForm.valid &&
      this.paymentForm.valid
    );
  }

  markAllFormsTouched() {
    [
      this.aadhaarForm,
      this.personalInfoForm,
      this.documentForm,
      this.addressForm,
      this.businessForm,
      this.fileUploadForm,
      this.paymentForm,
    ].forEach((form) => form.markAllAsTouched());
  }
}
