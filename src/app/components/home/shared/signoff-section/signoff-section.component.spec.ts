import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignoffSectionComponent } from './signoff-section.component';

describe('SignoffSectionComponent', () => {
  let component: SignoffSectionComponent;
  let fixture: ComponentFixture<SignoffSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignoffSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignoffSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
