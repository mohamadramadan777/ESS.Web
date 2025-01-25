import { themeQuartz, themeAlpine, themeBalham } from 'ag-grid-community';
import { colorSchemeVariable, DateFilter } from 'ag-grid-community';
import { SignOffStatusType } from '../../enums/app.enums';



export const paginationPageSize = 10;
// export const theme = themeAlpine.withPart(colorSchemeVariable);
export const theme = themeAlpine.withParams(
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
  export const rowClassRules = {
    'response-required-row': (params: any) => params.data?.wResponseRequired === true,
  };
  
export const paginationPageSizeSelector = [10, 25, 50];


export const colDef = [
  { headerName: 'Notice Type', field: 'wNoticeTypeDesc', flex: 1, minWidth: 190, maxWidth: 190, },
  { headerName: 'Sent Date', field: 'wNotificationSentDate', flex: 1, minWidth: 120, maxWidth: 120 },
  { headerName: 'Notice Ref. Number', field: 'wReferenceNumber', flex: 1, minWidth: 185, maxWidth: 185 },
  {
    headerName: 'Subject', field: 'wSubject', flex: 2, minWidth: 450, cellRenderer: (params: any) => {
      const responseRequired = (params.data?.wResponseRequired && !(params.data?.wsosStatusTypeID == SignOffStatusType.Submitted));
      const iconHtml = responseRequired
        ? ` <button class="btn-icon btn-revoke" title="Response required"><span class="material-icons">warning</span></button> `
        : '';
      const htmlTag = responseRequired ? 'b' : 'span';  
      return `<div class="notice-type-cell">
              ${iconHtml}
              <${htmlTag}>${params.value || ''}</${htmlTag}>
            </div>`;
    },
  },
  { headerName: 'Due Date', field: 'responseDueDate', flex: 1, minWidth: 120, maxWidth: 120 },
  { headerName: 'Signed By', field: 'responseSignedBy', flex: 1, minWidth: 150, maxWidth: 150 },
  { headerName: 'Sign Date', field: 'responseProvidedDate', flex: 1, minWidth: 120, maxWidth: 120 },
];
