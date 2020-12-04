import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { request } from '../request';

@Component({
  selector: 'app-schedule-edit',
  templateUrl: './schedule-edit.component.html',
  styleUrls: ['./schedule-edit.component.css'],
})
export class ScheduleEditComponent implements OnInit {
  formData = {
    name: '',
    type: '',
    description: '',
  };
  constructor(private router: Router) {}

  async getScheduleInfo(id): Promise<void> {
    const res = await request('/schedule-info/get/' + id, {
      method: 'GET',
    });
    if (res && res.data) {
      this.formData = res.data;
    }
  }

  async onSubmit(): Promise<void> {
    const formData = this.formData;
    if (!formData.name) {
      alert(`name can't be empty!`);
      return;
    }
    const editRes = await request('/schedule/edit', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  ngOnInit(): void {
    const url = this.router.url;
    const match = url.match(/[0-9]+/);
    if (match && match[0]) {
      this.getScheduleInfo(Number(match[0]));
    }
  }
}
