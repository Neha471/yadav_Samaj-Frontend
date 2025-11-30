import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitStory } from './submit-story';

describe('SubmitStory', () => {
  let component: SubmitStory;
  let fixture: ComponentFixture<SubmitStory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitStory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitStory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
