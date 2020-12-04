import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyrightEditComponent } from './copyright-edit.component';

describe('CopyrightEditComponent', () => {
  let component: CopyrightEditComponent;
  let fixture: ComponentFixture<CopyrightEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyrightEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyrightEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
