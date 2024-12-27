import { themeQuartz } from 'ag-grid-community';




export const paginationPageSize = 1;
export const theme = themeQuartz;
export const paginationPageSizeSelector = [1, 5, 10];


 export const colDef = [
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    {
      headerName: 'Job Title',
      field: 'jobTitle',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Email Address',
      field: 'email',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Active Functions',
      field: 'functions',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Access Requested Date',
      field: 'accessDate',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Account Registered',
      field: 'registered',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Account Registered Date',
      field: 'registeredDate',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Revoke Access',
      field: 'revoke',
      cellRenderer: (params: any) => {
        if (params.value) {
          return `<button class="btn btn-danger revoke-button">Revoke Access</button>`;
        }
        return '';
      },
    },
  ];