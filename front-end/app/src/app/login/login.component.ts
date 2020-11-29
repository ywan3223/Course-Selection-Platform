import { Component, OnInit } from '@angular/core';
import { request } from '../request';
import { storeSignature, storeUserInfo } from '../localstorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formData = {
    name: '',
    password: '',
  };
  constructor(private router: Router) {}

  ngOnInit(): void {}

  async onSubmit(): Promise<void> {
    // check empty value
    const formData = this.formData;
    for (const key in formData) {
      if (formData[key] === '') {
        alert(`please input the ${key}`);
        return;
      }
    }

    // login
    const loginRes = await request('/user/login', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    if (loginRes && loginRes.data && loginRes.data.signature) {
      storeSignature(loginRes.data.signature);
      storeUserInfo(loginRes.data);
      this.router.navigate(['/']);
    }
  }
}
