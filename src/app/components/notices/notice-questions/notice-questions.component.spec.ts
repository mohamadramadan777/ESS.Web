import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeQuestionsComponent } from './notice-questions.component';

describe('NoticeQuestionsComponent', () => {
  let component: NoticeQuestionsComponent;
  let fixture: ComponentFixture<NoticeQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoticeQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticeQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
