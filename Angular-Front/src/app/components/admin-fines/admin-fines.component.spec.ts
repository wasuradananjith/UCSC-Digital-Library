import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFinesComponent } from './admin-fines.component';

describe('AdminFinesComponent', () => {
  let component: AdminFinesComponent;
  let fixture: ComponentFixture<AdminFinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
