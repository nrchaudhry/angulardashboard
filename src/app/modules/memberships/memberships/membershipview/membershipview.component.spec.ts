import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipviewComponent } from './membershipview.component';

describe('MembershipviewComponent', () => {
  let component: MembershipviewComponent;
  let fixture: ComponentFixture<MembershipviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembershipviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
