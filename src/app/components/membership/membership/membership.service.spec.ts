import { TestBed } from '@angular/core/testing';

import { MembershipService } from './membership.service';

describe('MembershipService', () => {
  let service: MembershipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MembershipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
