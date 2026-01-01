import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventmediasComponent } from './eventmedias.component';

describe('EventmediasComponent', () => {
  let component: EventmediasComponent;
  let fixture: ComponentFixture<EventmediasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventmediasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventmediasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
