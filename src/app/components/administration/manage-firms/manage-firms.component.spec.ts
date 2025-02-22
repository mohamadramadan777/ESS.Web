import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFirmsComponent } from './manage-firms.component';

describe('ManageFirmsComponent', () => {
  let component: ManageFirmsComponent;
  let fixture: ComponentFixture<ManageFirmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageFirmsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageFirmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
