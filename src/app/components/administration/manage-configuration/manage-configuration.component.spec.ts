import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageConfigurationComponent } from './manage-configuration.component';

describe('ManageConfigurationComponent', () => {
  let component: ManageConfigurationComponent;
  let fixture: ComponentFixture<ManageConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
