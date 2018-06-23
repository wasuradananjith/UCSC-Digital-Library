import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestBooksSliderComponent } from './latest-books-slider.component';

describe('LatestBooksSliderComponent', () => {
  let component: LatestBooksSliderComponent;
  let fixture: ComponentFixture<LatestBooksSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestBooksSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestBooksSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
