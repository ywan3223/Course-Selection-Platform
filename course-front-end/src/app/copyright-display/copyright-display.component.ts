import { Component, OnInit } from '@angular/core';
import { request } from '../request';

@Component({
  selector: 'app-copyright-display',
  templateUrl: './copyright-display.component.html',
  styleUrls: ['./copyright-display.component.css'],
})
export class CopyrightDisplayComponent implements OnInit {
  formData = {
    copyright: '',
  };
  constructor() {}
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
