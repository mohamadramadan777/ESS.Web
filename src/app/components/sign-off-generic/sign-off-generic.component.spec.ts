import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignOffGenericComponent } from './sign-off-generic.component';

describe('SignOffGenericComponent', () => {
  let component: SignOffGenericComponent;
  let fixture: ComponentFixture<SignOffGenericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignOffGenericComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignOffGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
