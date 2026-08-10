import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationtypeComponent } from './organizationtype.component';

describe('OrganizationtypeComponent', () => {
  let component: OrganizationtypeComponent;
  let fixture: ComponentFixture<OrganizationtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationtypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
