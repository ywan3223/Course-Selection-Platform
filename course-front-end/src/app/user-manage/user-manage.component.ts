import { Component, OnInit } from '@angular/core';
import { request } from '../request';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css'],
})
export class UserManageComponent implements OnInit {
  users = [];
  displayedColumns = ['Name', 'Email', 'Role', 'State'];
  constructor() {}

  async onSelectState(item): Promise<void> {
    const res = await request('/user/update/state', {
      method: 'POST',
      body: JSON.stringify({
        id: item.id,
        new_state: item.state,
      }),
    });
    if (res && res.status === 0) {
      this.loadAllUser();
    }
  }

  async onSelectRole(item): Promise<void> {
    const res = await request('/user/update/role', {
      method: 'POST',
      body: JSON.stringify({
        id: item.id,
        new_role: item.role,
      }),
    });
    if (res && res.status === 0) {
      this.loadAllUser();
    }
  }

  async loadAllUser(): Promise<void> {
    const res = await request('/user/all', {
      method: 'GET',
    });
    if (res && res.data) {
      this.users = res.data;
    }
  }

  ngOnInit(): void {
    this.loadAllUser();
  }
}
