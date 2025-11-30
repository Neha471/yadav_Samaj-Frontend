import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumPlans } from './premium-plans';

describe('PremiumPlans', () => {
  let component: PremiumPlans;
  let fixture: ComponentFixture<PremiumPlans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremiumPlans]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PremiumPlans);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
