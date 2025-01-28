import { themeQuartz,themeAlpine,themeBalham } from 'ag-grid-community';


export interface ISubmissionRecord {
  application: string;
  date: Date;
}

export const paginationPageSize = 10;
export const theme = themeAlpine .withParams(
  {
      backgroundColor: '#FFFFFF',
      foregroundColor: '#361008CC',
      browserColorScheme: 'light',
      headerBackgroundColor:'rgb(220, 220, 220)',
      rowHoverColor:'rgb(247, 230, 233)',
      borderRadius: '10px',
  },
  'light-red'
)
.withParams(
  {
      backgroundColor: '#201008',
      foregroundColor: '#FFFFFFCC',
      browserColorScheme: 'dark',
  },
  'dark-red'
);
export const paginationPageSizeSelector = [10, 25, 50];


export const TableColDef = [
  { headerName: 'Application', field: 'formType', sortable: true, filter: true },
  {
    headerName: 'Submitted Date',
    field: 'submittedDate',
    sortable: true,
    filter: true,
  },
  {
    headerName: 'Status',
    field: 'applicationStatus',
    sortable: true,
    filter: true,
  },
];

