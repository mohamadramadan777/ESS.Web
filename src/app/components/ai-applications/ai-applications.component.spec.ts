import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiApplicationsComponent } from './ai-applications.component';

describe('AiApplicationsComponent', () => {
  let component: AiApplicationsComponent;
  let fixture: ComponentFixture<AiApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiApplicationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
