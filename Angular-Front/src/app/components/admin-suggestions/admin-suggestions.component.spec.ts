import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSuggestionsComponent } from './admin-suggestions.component';

describe('AdminSuggestionsComponent', () => {
  let component: AdminSuggestionsComponent;
  let fixture: ComponentFixture<AdminSuggestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSuggestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
