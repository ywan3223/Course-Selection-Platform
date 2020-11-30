import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleCoursesComponent } from './schedule-courses.component';

describe('ScheduleCoursesComponent', () => {
  let component: ScheduleCoursesComponent;
  let fixture: ComponentFixture<ScheduleCoursesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleCoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
