import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentReservationComponent } from './student-reservation.component';

describe('StudentReservationComponent', () => {
  let component: StudentReservationComponent;
  let fixture: ComponentFixture<StudentReservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentReservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
