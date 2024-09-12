import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors, FormBuilder, ValidatorFn, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  formSubmitted = false;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        null,
        Validators.compose([
          Validators.required,
          CustomValidators.patternValidator(/\d/, {
            hasNumber: true
          }),
          CustomValidators.patternValidator(/[A-Z]/, {
            hasCapitalCase: true
          }),
          CustomValidators.patternValidator(/[a-z]/, {
            hasSmallCase: true
          }),
          Validators.minLength(8)
        ])
      ],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value == form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    this.formSubmitted=true;
    if (this.contactForm.valid) {
      console.log('Form submitted', this.contactForm.value);
    } else {
      this.contactForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  }
} 
  export class CustomValidators {
    static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any} => {
        if(!control.value){
          return null;
        }

        const valid = regex.test(control.value);
        return valid ? null : error;
      }
   }
}
