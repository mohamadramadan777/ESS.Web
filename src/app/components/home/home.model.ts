export interface RequiredSignoff {
  title: string;
  overdueDays: number;
  dueDate: string;
}

export interface GeneralCommunication {
  title: string;
  wNoticeID: number;
  wFirmNoticeID: number;
  wsosStatusTypeID: number;
}

export interface GeneralSubmissionForm {
  title: string;
  link: string;
  WIndFromTypeID: number;
  DocTypeId: number;
}