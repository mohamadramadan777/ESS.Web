import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { WNoticeQuestionnaireItemDto } from '../../../services/api-client';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { WResponseTypes } from '../../../enums/app.enums';

@Component({
  selector: 'app-notice-questions',
  templateUrl: './notice-questions.component.html',
  styleUrls: ['./notice-questions.component.scss'],
  animations: [
    trigger('slideToggle', [
      state('void', style({ height: 0, overflow: 'hidden', opacity: 0 })),
      state('*', style({ height: '*', overflow: 'hidden', opacity: 1 })),
      transition('void <=> *', [animate('300ms ease-in-out')])
    ])
  ]
})
export class NoticeQuestionsComponent implements OnInit, OnChanges {
  @Input() noticeQuestions: WNoticeQuestionnaireItemDto[] = [];
  @Input() noticeQuestionsLoaded: boolean = false;
  @Input() ReadOnly: boolean = false;

  options: { [key: string]: { value: string; text: string }[] } = {};
  collapsedIndexes: boolean[] = [];
  hoveredIndex: number | null = null;
  searchText: string = '';
  filteredQuestions: WNoticeQuestionnaireItemDto[] = [];
  WResponseTypes = WResponseTypes;
  ngOnInit(): void {
    this.filteredQuestions = [...this.noticeQuestions];
    this.populateListOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filteredQuestions = [...this.noticeQuestions];
    this.collapsedIndexes = this.filteredQuestions.map(() => false); // Initialize all as expanded
    this.filterQuestions();
    this.populateListOptions();
  }

  toggleCollapse(index: number): void {
    this.collapsedIndexes[index] = !this.collapsedIndexes[index];
  }

  filterQuestions(): void {
    this.filteredQuestions = this.noticeQuestions.filter(
      (question) =>
        question.wNoticeQuestion?.toLowerCase().includes(this.searchText.toLowerCase() || '') || 
        question.wNoticeQuestionNumber?.toString() === this.searchText
    );
    this.collapsedIndexes = this.filteredQuestions.map(() => false);
  }

  private populateListOptions(): void {
    for (const question of this.noticeQuestions) {
      if (question.wResponseTypeID === 4 || question.wResponseTypeID === 5) {
        // Replace this with your actual API call logic
        this.options[question.wListNameID ?? 0] = this.getOptionsFromListName(question.wListNameID?.toString());
      }
    }
  }

  private getOptionsFromListName(listName: string | undefined): { value: string; text: string }[] {
    // Dummy implementation; replace with your API call to get options based on listName
    if (!listName) {
      return [];
    }
    return [
      { value: '1', text: 'Option 1' },
      { value: '2', text: 'Option 2' },
      { value: '3', text: 'Option 3' },
    ];
  }
}
