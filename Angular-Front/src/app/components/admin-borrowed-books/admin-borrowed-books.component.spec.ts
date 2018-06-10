import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBorrowedBooksComponent } from './admin-borrowed-books.component';

describe('AdminBorrowedBooksComponent', () => {
  let component: AdminBorrowedBooksComponent;
  let fixture: ComponentFixture<AdminBorrowedBooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBorrowedBooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBorrowedBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
