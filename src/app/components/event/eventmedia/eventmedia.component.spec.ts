import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventmediaComponent } from './eventmedia.component';

describe('EventmediaComponent', () => {
  let component: EventmediaComponent;
  let fixture: ComponentFixture<EventmediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventmediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventmediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
