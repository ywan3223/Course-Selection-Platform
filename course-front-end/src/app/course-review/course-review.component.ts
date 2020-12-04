import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getUserInfo } from '../localstorage';
import { request } from '../request';

@Component({
  selector: 'app-course-review',
  templateUrl: './course-review.component.html',
  styleUrls: ['./course-review.component.css'],
})
export class CourseReviewComponent implements OnInit {
  subject = '';
  catalog = '';
  userInfo = {
    id: 0,
    role: '',
  };
  courseInfo = {
    className: '',
    ssr_component: '',
    start_time: '',
    end_time: '',
  };
  reviews = [];
  displayedColumns = [
    'Review',
    'Creator',
    'ClassName',
    'Subject',
    'Catalog',
    'CreateTime',
    'Operation',
  ];
  formData = {
    reviewContent: '',
  };

  constructor(private router: Router) {}

  async onHiddenReview(element): Promise<void> {
    const id = element.id;
    element.visibility = element.visibility ? 0 : 1;
    const newVisibility = element.visibility;
    const res = await request(`/course-review/visibility/toggle`, {
      method: 'POST',
      body: JSON.stringify({
        id,
        new_visibility: newVisibility,
      }),
    });
  }

  async onSubmit(): Promise<void> {
    if (!this.userInfo.id) {
      return;
    }
    const userId = this.userInfo.id;
    const reviewContent = this.formData.reviewContent;
    if (!reviewContent) {
      alert(`review content can't be empty!`);
      return;
    }

    const res = await request('/course-review/add', {
      method: 'POST',
      body: JSON.stringify({
        subject: this.subject,
        catalog: this.catalog,
        reviewContent,
        userId,
      }),
    });
    this.formData.reviewContent = '';
    this.getCourseReviews();
  }

  async getCourseInfo(): Promise<void> {
    const { subject, catalog } = this;
    const res = await request(`/course-info/get/${subject}/${catalog}`, {
      method: 'GET',
    });
    if (res && res.data) {
      this.courseInfo = res.data;
    }
  }

  async getCourseReviews(): Promise<void> {
    const res = await request(
      `/course-review/get/${this.subject}/${this.catalog}`,
      {
        method: 'GET',
      }
    );
    if (res && res.data) {
      for (const item of res.data) {
        item.timestamp = new Date(item.timestamp).toLocaleString();
      }
      this.reviews = res.data;
    }
  }

  ngOnInit(): void {
    const url = this.router.url;
    const match = url.match(/.*course-review\/(.*)\/(.*)/);
    if (match) {
      const subject = match[1];
      const catalog = match[2];
      this.subject = subject;
      this.catalog = catalog;
    }
    this.getCourseInfo();
    this.getCourseReviews();
    const userInfo = getUserInfo();
    if (userInfo) {
      this.userInfo = userInfo;
    }
  }
}
