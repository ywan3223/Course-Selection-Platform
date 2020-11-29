import { Component, OnInit } from '@angular/core';
import { request } from '../request';

@Component({
  selector: 'app-courses-store',
  templateUrl: './courses-store.component.html',
  styleUrls: ['./courses-store.component.css'],
})
export class CoursesStoreComponent implements OnInit {
  formData = {
    catalog: '',
    subject: '',
  };
  subjects = [];
  constructor() {}

  async loadSubjects(): Promise<void> {
    const res = await request('/subjects/all/get', {
      method: 'GET',
    });
    if (res && res.data) {
      this.subjects = res.data;
    }
  }

  ngOnInit(): void {
    this.loadSubjects();
  }
}
