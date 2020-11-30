import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { request } from '../request';
import { getUserInfo } from '../localstorage';

@Component({
  selector: 'app-schedule-courses',
  templateUrl: './schedule-courses.component.html',
  styleUrls: ['./schedule-courses.component.css'],
})
export class ScheduleCoursesComponent implements OnInit {
  courses = [];
  role = '';
  displayedColumns = [
    'ClassName',
    'Subject',
    'CatalogNbr',
    'SsrComponent',
    'Operation',
  ];
  scheduleInfo = {
    name: '',
    id: 0,
  };
  scheduleId = 0;
  constructor(private router: Router) {}

  async loadScheduleCourses(): Promise<void> {
    const url = this.router.url;
    const match = url.match(/[0-9]+/);
    if (match) {
      this.scheduleId = Number(match[0]);
    }
    if (this.scheduleId) {
      const res = await request(`/schedule/courses/get/${this.scheduleId}`, {
        method: 'GET',
      });
      if (res && res.data) {
        this.courses = res.data;
      }
    }
  }

  async getScheduleInfo(): Promise<void> {
    const url = this.router.url;
    const match = url.match(/[0-9]+/);
    if (match) {
      this.scheduleId = Number(match[0]);
    }
    const res = await request(`/schedule-info/get/${this.scheduleId}`, {
      method: 'GET',
    });
    if (res && res.data) {
      this.scheduleInfo = res.data;
    }
  }

  async onClearUp(): Promise<void> {
    const { id } = this.scheduleInfo;
    const clearRes = await request('/course/clearup', {
      method: 'POST',
      body: JSON.stringify({
        schedule_id: id,
      }),
    });
    if (clearRes && clearRes.status === 0) {
      this.loadScheduleCourses();
    }
  }

  async onDeleteCourse(item): Promise<void> {
    const courseId = item.id;
    const deleteRes = await request('/course/delete', {
      method: 'POST',
      body: JSON.stringify({
        course_id: courseId,
      }),
    });
    if (deleteRes.status === 0) {
      this.loadScheduleCourses();
    }
  }

  ngOnInit(): void {
    this.loadScheduleCourses();
    this.getScheduleInfo();
    const userInfo = getUserInfo();
    if (userInfo && userInfo.role) {
      this.role = userInfo.role;
    }
  }
}
