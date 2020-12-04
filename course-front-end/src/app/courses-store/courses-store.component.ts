import { Component, OnInit } from '@angular/core';
import { request } from '../request';
import { getUserInfo } from '../localstorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses-store',
  templateUrl: './courses-store.component.html',
  styleUrls: ['./courses-store.component.css'],
})
export class CoursesStoreComponent implements OnInit {
  courses = [];
  schedules = [];
  displayedColumns = [
    'ClassName',
    'Subject',
    'CatalogNbr',
    'SsrComponent',
    'StartTime',
    'EndTime',
    'Operation',
  ];
  searchData = {
    className: '',
    catalog: '',
  };
  formData = {
    catalog: '',
    subject: '',

    schedule: '',
  };
  subjects = [];
  role = '';
  constructor(private router: Router) {}

  async onSearchByClassNameAndCatalog(): Promise<void> {
    const { className, catalog } = this.searchData;
    const res = await request(
      `/course/search?className=${className}&catalog=${catalog}`,
      {
        method: 'GET',
      }
    );
    if (res && res.data) {
      this.courses = res.data;
    }
  }

  async loadAllSchedules(): Promise<void> {
    const publicSchedulesPromise = request('/private-schedules/get', {
      method: 'GET',
    });
    const privateSchedulesPromise = request('/public-schedules/get', {
      method: 'GET',
    });
    const res = await Promise.all([
      publicSchedulesPromise,
      privateSchedulesPromise,
    ]);
    const schedules = [];
    res.forEach((item) => {
      schedules.push(...item.data);
    });
    this.schedules = schedules;
  }

  async loadSubjects(): Promise<void> {
    const res = await request('/subjects/all/get', {
      method: 'GET',
    });
    if (res && res.data) {
      this.subjects = res.data;
    }
  }

  async onSearchBySubjectAndCatalog(): Promise<void> {
    const { subject, catalog } = this.formData;
    if (!subject) {
      alert(`please select the subject!`);
      return;
    }
    const searchRes = await request(`/course/select/${subject}/${catalog}`, {
      method: 'GET',
    });
    if (searchRes && searchRes.data) {
      this.courses = searchRes.data;
    }
  }

  async onAddCourseToSchedule(course): Promise<void> {
    const formData = this.formData;
    if (!formData.schedule) {
      alert('please select the schedule first!');
      return;
    }
    const schedule = formData.schedule;
    const { subject, catalog_nbr } = course;
    const addRes = await request('/course/put', {
      method: 'POST',
      body: JSON.stringify({
        subject,
        catalog: catalog_nbr,
        schedule_id: schedule,
      }),
    });
  }

  onLookReviews(element): void {
    this.router.navigate([
      `course-review/${element.subject}/${element.catalog_nbr}`,
    ]);
  }

  ngOnInit(): void {
    this.loadSubjects();
    this.loadAllSchedules();
    const userInfo = getUserInfo();
    if (userInfo && userInfo.role) {
      this.role = userInfo.role;
    }
  }
}
