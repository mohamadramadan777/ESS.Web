import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsSubmissionComponent } from './forms-submission.component';

describe('FormsSubmissionComponent', () => {
  let component: FormsSubmissionComponent;
  let fixture: ComponentFixture<FormsSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormsSubmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormsSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
