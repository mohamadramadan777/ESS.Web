import { themeQuartz, themeAlpine, themeBalham } from 'ag-grid-community';
import { max } from 'rxjs';
import { ColDef } from 'ag-grid-community';

export interface ICurrentUser {
  name: string;
  WUserID: string;
  FirmQFCNo: string;
  role: string;
}
interface ISubmissionRecord {
  description: string;
  attachments: { name: string; url: string }[];
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
export const theme = themeAlpine
  .withParams(
    {
      backgroundColor: '#FFFFFF',
      foregroundColor: '#361008CC',
      browserColorScheme: 'light',
      headerBackgroundColor: 'rgb(220, 220, 220)',
      rowHoverColor: 'rgb(247, 230, 233)',
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

export const TableColDef: ColDef<any>[] = [
  {
    headerName: 'Description',
    field: 'description',
    autoHeight: true,
    sortable: true,
    filter: true,
    cellStyle:{display:'flex' , alignitems:'center'},
  },
  {
    headerName: 'Attachments',
    field: 'attachments',
    autoHeight: true, // This allows rows to expand based on content
    wrapText: true,
    valueFormatter: (params) => {
      if (params.value && Array.isArray(params.value)) {
        return params.value.map((file) => file.name).join(', '); // Converts array to a readable string
      }
      return 'No Attachments';
    },
    cellRenderer: (params: { value: { name: string; url: string }[] }) => {
      if (params.value && params.value.length > 0) {
        return params.value
          .map(
            (file: { name: string; url: string }) =>
              `
              <a href="${file.url}" target="_blank" style=" line-height:0 ; display: inline-flex; align-items: center; gap: 2px; margin-right: 5px;">
                📎 ${file.name}
              </a>
            `
          )
          .join('<br>');
      }
      return 'No Attachments';
    },
    sortable: false,
    filter: false,
    maxWidth: 400,
  },
];


export const PendingTableColDef: ColDef<any>[] = [
  {
    headerName: 'Description',
    field: 'description',
    autoHeight: true,
    sortable: true,
    filter: true,
    cellStyle:{display:'flex' , alignitems:'center'},
  },
  {
    headerName: '',
    field: 'showDelete',
    cellRenderer: (params: any) => {
      if (params.value) {
        return `
        <button class="btn-icon btn-revoke" title="Delete">
          <span class="material-icons">delete</span>
        </button>`;
      } else {
        return '';
      }
    },
    sortable: false,
    filter: false,
    maxWidth: 75
  },
];

export const defaultColDef = {
  flex: 1,
  minWidth: 150,
  resizable: true,
  wrapText: true, // Allows text to wrap
  autoHeight: true,
};
