import { TestBed } from '@angular/core/testing';

import { EventmediaService } from './eventmedia.service';

describe('EventmediaService', () => {
  let service: EventmediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventmediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
