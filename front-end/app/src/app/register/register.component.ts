import { Component, OnInit } from '@angular/core';
import { request } from '../request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  formData = {
    email: '',
    name: '',
    password: '',
  };
  constructor(private router: Router) {}

  ngOnInit(): void {}

  async onSubmit(): Promise<void> {
    // check empty value
    for (const key in this.formData) {
      if (this.formData[key] === '') {
        alert(`please input the ${key}!`);
        return;
      }
    }
    // check email form
    const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if (!reg.test(this.formData.email)) {
      alert('please input a correct email!');
      return;
    }
    // request register
    const registerRes = await request('/user/register', {
      method: 'POST',
      body: JSON.stringify(this.formData),
    });
    this.router.navigate(['/login']);
  }
}
