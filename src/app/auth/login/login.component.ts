import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  myform = new FormGroup({
    myemail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    mypassword: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        mustContainQuestionMark,
      ],
      asyncValidators: [emailIsUnique],
    }),
  });

  onSubmit() {
    console.log('submit button clicked');
    console.log(this.myform.value.myemail);
    console.log(this.myform.value.mypassword);
  }

  checkEmailValidity() {
    return (
      this.myform.controls.myemail.touched &&
      this.myform.controls.myemail.dirty &&
      this.myform.controls.myemail.invalid
    );
  }

  checkPasswordValidity() {
    return (
      this.myform.controls.mypassword.touched &&
      this.myform.controls.mypassword.dirty &&
      this.myform.controls.mypassword.invalid
    );
  }

  ngOnInit(): void {

    // get and set
    const savedForm = window.localStorage.getItem('saved-login-form');
    if(savedForm){
      const loadedForm = JSON.parse(savedForm);
      this.myform.controls.myemail.setValue(loadedForm.email);
    }

    const sub = this.myform.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (value) => {
        console.log(value);
        window.localStorage.setItem(
          'saved-login-form' ,JSON.stringify({ email: value.myemail })
        );
      },
    });
    this.destroyRef.onDestroy(() => {
      sub.unsubscribe(); 
      console.log('component destroyed');
    });
  }
}

function mustContainQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    console.log('question mark found');
    return null;
  }
  return { noQuestionMark: true };
}

function emailIsUnique(control: AbstractControl) {
  if (control.value !== 'test@abc.com') {
    console.log('emailIsUnique called');
    // existing emails
    return of(null);
  }
  return of({ emailIsUnique: false });
}
function ngOnInit() {
  throw new Error('Function not implemented.');
}
