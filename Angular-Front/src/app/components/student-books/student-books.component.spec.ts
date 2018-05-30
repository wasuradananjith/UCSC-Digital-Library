import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentBooksComponent } from './student-books.component';

describe('StudentBooksComponent', () => {
  let component: StudentBooksComponent;
  let fixture: ComponentFixture<StudentBooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentBooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
