export interface ISubmissionRecord {
  application: string;
  date: Date;
}


export const SUBMISSION_RECORDS_CONFIG_COLUMNS = {
  displayedColumns: ['application', 'date', 'view'],
};