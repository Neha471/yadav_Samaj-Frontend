import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrimonialLogin } from './matrimonial-login';

describe('MatrimonialLogin', () => {
  let component: MatrimonialLogin;
  let fixture: ComponentFixture<MatrimonialLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrimonialLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrimonialLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
