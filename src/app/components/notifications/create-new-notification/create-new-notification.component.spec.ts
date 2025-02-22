import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewNotificationComponent } from './create-new-notification.component';

describe('CreateNewNotificationComponent', () => {
  let component: CreateNewNotificationComponent;
  let fixture: ComponentFixture<CreateNewNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateNewNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
