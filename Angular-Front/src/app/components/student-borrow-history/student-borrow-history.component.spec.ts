import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentBorrowHistoryComponent } from './student-borrow-history.component';

describe('StudentBorrowHistoryComponent', () => {
  let component: StudentBorrowHistoryComponent;
  let fixture: ComponentFixture<StudentBorrowHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentBorrowHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentBorrowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
