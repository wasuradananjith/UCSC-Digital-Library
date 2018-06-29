import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageUserComponent } from './admin-manage-user.component';

describe('AdminManageUserComponent', () => {
  let component: AdminManageUserComponent;
  let fixture: ComponentFixture<AdminManageUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminManageUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
