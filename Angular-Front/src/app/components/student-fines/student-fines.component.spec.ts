import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentFinesComponent } from './student-fines.component';

describe('StudentFinesComponent', () => {
  let component: StudentFinesComponent;
  let fixture: ComponentFixture<StudentFinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentFinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentFinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
