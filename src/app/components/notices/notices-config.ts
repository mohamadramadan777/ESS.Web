import { themeQuartz,themeAlpine,themeBalham } from 'ag-grid-community';
import { colorSchemeVariable,DateFilter } from 'ag-grid-community';



export const paginationPageSize = 10;
// export const theme = themeAlpine.withPart(colorSchemeVariable);
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


 export const colDef = [
  { headerName: 'Notice Type', field: 'wNoticeTypeDesc', flex: 1,minWidth: 175,maxWidth: 175 },
  { headerName: 'Sent Date', field: 'wNotificationSentDate', flex: 1 ,minWidth: 120,maxWidth: 120}, //TODO: Fix Date Filter // cellDataType: 'dateString',  filter: 'agDateColumnFilter'
  { headerName: 'Notice Ref. Number', field: 'wReferenceNumber', flex: 1,minWidth: 185,maxWidth: 185 },
  { headerName: 'Subject', field: 'wSubject', flex: 2,  minWidth: 450},
  // {
  //   headerName: 'View/Respond',
  //   cellRenderer: () => `<button class="view-button">View</button>`,
  //   flex: 1,
  //   cellStyle: { textAlign: 'center' },
  // },
  { headerName: 'Due Date', field: 'responseDueDate', flex: 1,minWidth: 120,maxWidth: 120 },
  { headerName: 'Signed By', field: 'responseSignedBy', flex: 1,minWidth: 150,maxWidth: 150 },
  { headerName: 'Sign Date', field: 'responseProvidedDate', flex: 1,minWidth: 120, maxWidth: 120 },
];