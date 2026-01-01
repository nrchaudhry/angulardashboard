import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventmediaviewComponent } from './eventmediaview.component';

describe('EventmediaviewComponent', () => {
  let component: EventmediaviewComponent;
  let fixture: ComponentFixture<EventmediaviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventmediaviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventmediaviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
