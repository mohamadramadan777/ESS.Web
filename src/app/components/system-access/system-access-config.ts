import { themeQuartz,themeAlpine,themeBalham } from 'ag-grid-community';




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

export const systemAccountColDef = [
  { headerName: 'Name', field: 'individualName', sortable: true, filter: true },
  {
    headerName: 'Email Address',
    field: 'individualEmailAddress',
    sortable: true,
    filter: true,
  },
  {
    headerName: 'Request Type',
    field: 'wRequestTypeDesc',
    sortable: true,
    filter: true,
  },
  {
    headerName: 'Date Requested',
    field: 'createdDate',
    sortable: true,
    filter: true,
  },
];

 export const individualsColDef = [
    { headerName: 'Name', field: 'individualName', sortable: true, filter: true },
    {
      headerName: 'Job Title',
      field: 'individualJobTitle',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Email Address',
      field: 'individualEmailAddress',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Active Functions',
      field: 'roleDesc',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Access Requested Date',
      field: 'createdDate',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Account Registered',
      field: 'isRegistered',
      cellRenderer: (params: any) => {
        if (params.value) {
          return `Yes`;
        }
        return 'No';
      },
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Account Registered Date',
      field: 'registrationDate',
      sortable: true,
      filter: true,
    },
    {
      headerName: '',
      field: 'isSEF', // Boolean field indicating if the user can be revoked
      cellRenderer: (params: any) => {
        if (!params.value) {
          return `
            <button class="btn-icon btn-revoke" title="Revoke Access">
              <span class="material-icons">block</span>
            </button>`;
        } else {
          return `
            <button class="btn-icon btn-info" title="Access cannot be revoked for an individual currently performing the Senior Executive Function">
              <span class="material-icons">info</span>
            </button>`;
        }
      },
      sortable: false,
      filter: false,
      maxWidth: 75
    }
  ];