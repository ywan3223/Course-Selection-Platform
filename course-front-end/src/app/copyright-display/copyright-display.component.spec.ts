import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyrightDisplayComponent } from './copyright-display.component';

describe('CopyrightDisplayComponent', () => {
  let component: CopyrightDisplayComponent;
  let fixture: ComponentFixture<CopyrightDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyrightDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyrightDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
