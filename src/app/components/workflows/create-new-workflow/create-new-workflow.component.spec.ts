import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewWorkflowComponent } from './create-new-workflow.component';

describe('CreateNewWorkflowComponent', () => {
  let component: CreateNewWorkflowComponent;
  let fixture: ComponentFixture<CreateNewWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateNewWorkflowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
