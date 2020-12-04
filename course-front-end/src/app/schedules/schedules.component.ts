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
  userInfo = {
    id: 0,
  };
  canEdit = false;
  formData = {
    name: '',
    type: 'private',
    description: '',
  };
  displayedColumns: string[] = [
    'name',
    'type',
    'creator',
    'CourseCount',
    'description',
    'timestamp',
    'operation',
  ];
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

  async onViewCourses(row): Promise<void> {
    const id = row.id;
    this.router.navigate([`/schedule-courses/${id}`]);
  }

  async onCreate(): Promise<void> {
    const formData = this.formData;
    for (const key in formData) {
      if (formData[key] === '') {
        alert(`please input the ${key}`);
        return;
      }
    }
    const createRes = await request('/schedule/create', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    this.loadSchedules();
  }

  async onDelete(item): Promise<void> {
    const confirmDel = confirm('Are you sure delete this schedule?');
    if (!confirmDel) {
      return;
    }
    const scheduleId = item.id;
    const delRes = await request('/schedule/delete', {
      method: 'POST',
      body: JSON.stringify({
        schedule_id: scheduleId,
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

  async getIfCanEdit(): Promise<void> {
    const url = this.router.url;
    if (url.includes('public')) {
      this.canEdit = true;
    }
  }

  onEdit(element): void {
    this.router.navigate([`/schedule-edit/${element.id}`]);
  }

  ngOnInit(): void {
    const userInfo = getUserInfo();
    if (userInfo && userInfo.role) {
      this.role = userInfo.role;
      this.userInfo = userInfo;
    }
    this.loadSchedules();
    this.getIfCanEdit();
  }
}
