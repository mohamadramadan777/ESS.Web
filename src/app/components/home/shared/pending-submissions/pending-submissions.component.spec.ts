import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingSubmissionsComponent } from './pending-submissions.component';

describe('PendingSubmissionsComponent', () => {
  let component: PendingSubmissionsComponent;
  let fixture: ComponentFixture<PendingSubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PendingSubmissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
