import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter  } from '@angular/core';
import { WNoticeQuestionnaireItemDto, Client } from '../../../services/api-client';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { WResponseTypes, WEvaluationRequirementType } from '../../../enums/app.enums';

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
  @Output() unsavedChange = new EventEmitter<void>();
  options: { [key: string]: { value: string; text: string }[] } = {};
  collapsedIndexes: boolean[] = [];
  hoveredIndex: number | null = null;
  searchText: string = '';
  filteredQuestions: WNoticeQuestionnaireItemDto[] = [];
  WResponseTypes = WResponseTypes;
  WEvaluationRequirementType = WEvaluationRequirementType;
  processedListNames = new Set<number>();
  multiSelectValues: { [key: number]: string[] } = {}; // Holds the array representation for multi-select values
  constructor(
    private client: Client,
  ) { }

  ngOnInit(): void {
    this.filteredQuestions = [...this.noticeQuestions];
    this.populateListOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filteredQuestions = [...this.noticeQuestions];
    this.collapsedIndexes = this.filteredQuestions.map(() => false); // Initialize all as expanded
    this.filterQuestions();
    this.populateListOptions();
    this.initializeMultiSelectValues();
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


  private async populateListOptions(): Promise<void> {
    for (const question of this.noticeQuestions) {
      const listNameID = question.wListNameID ?? 0;
      if ((question.wResponseTypeID === WResponseTypes.List_of_values_Single_Response || question.wResponseTypeID === WResponseTypes.List_of_values_Multiple_Response) &&
        !this.options[listNameID] && !this.processedListNames.has(listNameID)) {
        this.processedListNames.add(listNameID);
        const options = await this.getOptionsFromListName(listNameID);
        this.options[listNameID] = options;
      }
    }
  }

  private initializeMultiSelectValues(): void {
    for (const question of this.noticeQuestions) {
      if (question.wResponseTypeID === WResponseTypes.List_of_values_Multiple_Response) {
        this.multiSelectValues[question.wNoticeQuestionnaireItemID ?? 0] = question.wResponseAnswer
          ? question.wResponseAnswer.split(',').map(value => value.trim())
          : [];
      }
    }
  }

  private async getOptionsFromListName(listName: number | undefined): Promise<{ value: string; text: string }[]> {
    if (!listName || listName === 0) {
      return [];
    }
    try {
      const response = await this.client.getListValues(listName).toPromise();
      if (response && response.isSuccess && response.response) {
        return Object.entries(response.response).map(([key, value]) => ({
          value: key,
          text: value
        }));
      } else {
        console.error('Failed to load list:', response?.errorMessage);
        return [];
      }
    } catch (error) {
      console.error('Error occurred while fetching list:', error);
      return [];
    }
  }

  getOptionText(listNameID: number | undefined, value: string | undefined): string | undefined {
    if (!listNameID || !this.options[listNameID]) {
      return value;
    }
    const option = this.options[listNameID]?.find(opt => opt.value === value);
    return option ? option.text : value;
  }

  convertToArray(value: string | undefined): string[] {
    return value ? value.split(',').map(item => item.trim()) : [];
  }

  processWResponseAnswers(): void {
    for (const question of this.noticeQuestions) {
      if (question.wResponseTypeID === WResponseTypes.List_of_values_Multiple_Response) {
        // Ensure `wResponseAnswer` is updated with the current `multiSelectValues`
        const selectedValues = this.multiSelectValues[question.wNoticeQuestionnaireItemID ?? 0] || [];
        question.wResponseAnswer = selectedValues.join(','); // Convert array to a comma-separated string
      }
    }
  }

  onQuestionChange(): void {
    this.unsavedChange.emit();
  }

}
