import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeightTrackerData } from './weight-tracker-data';

describe('WeightTrackerData', () => {
  let component: WeightTrackerData;
  let fixture: ComponentFixture<WeightTrackerData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeightTrackerData],
    }).compileComponents();

    fixture = TestBed.createComponent(WeightTrackerData);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
