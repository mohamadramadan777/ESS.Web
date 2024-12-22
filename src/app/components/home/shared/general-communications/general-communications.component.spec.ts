import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralCommunicationsComponent } from './general-communications.component';

describe('GeneralCommunicationsComponent', () => {
  let component: GeneralCommunicationsComponent;
  let fixture: ComponentFixture<GeneralCommunicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralCommunicationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralCommunicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
