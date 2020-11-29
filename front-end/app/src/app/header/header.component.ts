import { Component, OnInit } from '@angular/core';
import { logined } from '../localstorage';
import { Router, NavigationEnd } from '@angular/router';
import { clearSignature, getUserInfo, clearUserInfo } from '../localstorage';
enum UserStatus {
  login = 'login',
  unlogin = 'unlogin',
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userStatus: UserStatus = UserStatus.unlogin;
  userInfo = {
    name: ''
  };
  constructor(private router: Router) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.onRouterChange();
      }
    });
  }

  onRouterChange(): void {
    const isLogin = logined();
    this.userStatus = isLogin ? UserStatus.login : UserStatus.unlogin;
    const userInfo = getUserInfo();
    this.userInfo = userInfo;
  }

  onSighOut(): void {
    clearSignature();
    clearUserInfo();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.onRouterChange();
  }
}
