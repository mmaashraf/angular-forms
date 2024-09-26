import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  imports: [ReactiveFormsModule],
})
export class SignupComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    passwordGroup: new FormGroup({
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmpassword: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
    }, {
      validators: [equalValues]
    }),
    firstname: new FormControl('', {
      validators: [Validators.required],
    }),
    lastname: new FormControl('', {
      validators: [Validators.required],
    }),
    address: new FormGroup({
      //create required form controls for street, postalcode, city number
      street: new FormControl('', {
        validators: [Validators.required],
      }),
      number: new FormControl('', {
        validators: [Validators.required],
      }),
      postalcode: new FormControl('', {
        validators: [Validators.required],
      }),
      city: new FormControl('', {
        validators: [Validators.required],
      }),
    }),
    role: new FormControl<
      'student' | 'teacher' | 'employee' | 'founder' | 'other'
    >('student', {
      validators: [Validators.required],
    }),
    // check/ubcheck options
    source: new FormArray([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
    ]),
    agree: new FormControl(false, {
      validators: [Validators.requiredTrue],
    }),
  });
  onSubmit() {
    console.log('submit method ');
    console.log("forms status ", this.form.status);
    console.log("forms value ", this.form.value);
    if(this.form.invalid){
      console.log("form is invalid");
      return;
    }
    console.log(this.form);
  }
  //reset
  onReset() {
    console.log('reset method ');
    this.form.reset();
  }
}
function equalValues(control: AbstractControl){
  const pwd = control.get('password')?.value;
  const cpwd = control.get('confirmpassword')?.value;

  if(pwd === cpwd){
    return null;
  }

  return {passwordMismatch: true};
}