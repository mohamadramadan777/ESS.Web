import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewAiApplicationComponent } from './create-new-ai-application.component';

describe('CreateNewAiApplicationComponent', () => {
  let component: CreateNewAiApplicationComponent;
  let fixture: ComponentFixture<CreateNewAiApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateNewAiApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewAiApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
