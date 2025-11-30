import { ComponentFixture, TestBed } from '@angular/core/testing';



describe('MatrimonialHome', () => {
  let component: MatrimonialHome;
  let fixture: ComponentFixture<MatrimonialHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrimonialHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrimonialHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
