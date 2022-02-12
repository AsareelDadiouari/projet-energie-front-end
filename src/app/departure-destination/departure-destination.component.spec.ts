import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DepartureDestinationComponent} from './departure-destination.component';

describe('DepartureDestinationComponent', () => {
  let component: DepartureDestinationComponent;
  let fixture: ComponentFixture<DepartureDestinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepartureDestinationComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartureDestinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
