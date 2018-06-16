import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentBorrowedBooksComponent } from './student-borrowed-books.component';

describe('StudentBorrowedBooksComponent', () => {
  let component: StudentBorrowedBooksComponent;
  let fixture: ComponentFixture<StudentBorrowedBooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentBorrowedBooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentBorrowedBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
