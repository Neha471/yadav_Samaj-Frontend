import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipLogin } from './membership-login';

describe('MembershipLogin', () => {
  let component: MembershipLogin;
  let fixture: ComponentFixture<MembershipLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
