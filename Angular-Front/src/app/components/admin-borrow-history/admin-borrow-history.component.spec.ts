import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBorrowHistoryComponent } from './admin-borrow-history.component';

describe('AdminBorrowHistoryComponent', () => {
  let component: AdminBorrowHistoryComponent;
  let fixture: ComponentFixture<AdminBorrowHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBorrowHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBorrowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
