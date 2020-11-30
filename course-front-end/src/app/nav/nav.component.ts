import { Component, OnInit } from '@angular/core';
import { getUserInfo } from '../localstorage';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  role = '';
  constructor() {}

  ngOnInit(): void {
    const userInfo = getUserInfo();
    if (userInfo && userInfo.role) {
      this.role = userInfo.role;
    }
  }
}
