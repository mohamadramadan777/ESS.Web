import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GensubComponent } from './gensub.component';

describe('GensubComponent', () => {
  let component: GensubComponent;
  let fixture: ComponentFixture<GensubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GensubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GensubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
