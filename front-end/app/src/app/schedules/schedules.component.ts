import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { getUserInfo } from '../localstorage';
import { request } from '../request';

enum ScheduleType {
  public = 'public',
  private = 'private',
}

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css'],
})
export class SchedulesComponent implements OnInit {
  type = 'public';
  role = '';
  formData = {
    name: '',
    type: 'private',
  };
  displayedColumns: string[] = ['name', 'type', 'timestamp', 'operation'];
  schedules = [];
  constructor(private router: Router) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.onRouterChange();
      }
    });
  }

  onRouterChange(): void {
    const url: string = this.router.url;
    const match = url.match(/\/schedules\/(.*)/);
    if (match && match[1]) {
      this.type = match[1];
      this.loadSchedules();
    }
  }

  async onCreate(): Promise<void> {
    const formData = this.formData;
    const createRes = await request('/schedule/create', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    this.loadSchedules();
  }

  async onDelete(item): Promise<void> {
    const scheduleId = item.id;
    const delRes = await request('/schedule/delete', {
      method: 'POST',
      body: JSON.stringify({
        schedule_id: scheduleId
      }),
    });
    this.loadSchedules();
  }

  async loadSchedules(): Promise<void> {
    const url = this.router.url;
    const type = this.type;
    const res = await request(`/${type}-schedules/get`, {
      method: 'GET',
    });
    if (res && res.data) {
      this.schedules = res.data;
    }
  }

  ngOnInit(): void {
    const userInfo = getUserInfo();
    if (userInfo && userInfo.role) {
      this.role = userInfo.role;
    }
    this.loadSchedules();
  }
}
