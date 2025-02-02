import { themeQuartz,themeAlpine,themeBalham } from 'ag-grid-community';
import { max } from 'rxjs';


export interface ICurrentUser {
  name: string;
  WUserID: string;
  FirmQFCNo: string;
  role: string;
}

export interface ISignatoryStatus {
  objectID: number;
  objectInstanceID: number;
  soTaskAssignedTo: number;
  soTaskCompletionDate: string;
  soTaskSeqNo: number;
  groupSignOff: boolean;
  isLoggedInUser: boolean;
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
  { headerName: 'Application', field: 'description', sortable: true, filter: true },
  {
    headerName: 'Attachments',
    field: 'attachments',
    // cellRenderer: (params) => {
    //   if (params.value && params.value.length > 0) {
    //     return params.value.map(file => `<a href="${file.url}" target="_blank">${file.name}</a>`).join('<br>');
    //   }
    //   return 'No Attachments';
    // },
    sortable: false,
    filter: false,
    maxWidth: 300
  }
];



export const defaultColDef = 
  {flex: 1,
  minWidth: 150,
  resizable: true,
  wrapText: true,  // Allows text to wrap
  autoHeight: true }

