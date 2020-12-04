import { Component, OnInit } from '@angular/core';
import { request } from '../request';

@Component({
  selector: 'app-copyright-edit',
  templateUrl: './copyright-edit.component.html',
  styleUrls: ['./copyright-edit.component.css'],
})
export class CopyrightEditComponent implements OnInit {
  formData = {
    copyright: '',
  };
  constructor() {}

  async onSubmit(): Promise<void> {
    const copyright = this.formData.copyright;
    const res = await request('/copyright/set', {
      method: 'POST',
      body: JSON.stringify({
        copyright,
      }),
    });
    this.loadCopyright();
  }

  async loadCopyright(): Promise<void> {
    const res = await request('/copyright/get', {
      method: 'GET',
    });
    if (res && res.data) {
      this.formData.copyright = res.data;
    }
  }

  ngOnInit(): void {
    this.loadCopyright();
  }
}
