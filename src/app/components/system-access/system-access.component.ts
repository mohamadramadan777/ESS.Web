import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';

@Component({
  selector: 'app-system-access',
  templateUrl: './system-access.component.html',
  styleUrls: ['./system-access.component.scss'],
})
export class SystemAccessComponent {
  public modules = [ClientSideRowModelModule];

  columnDefs: ColDef[] = [
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

  rowData = [
    {
      name: 'Tad Ondricka',
      jobTitle: 'Senior Executive',
      email: 'OndrickaTad975@test.com',
      functions: 'Senior Executive',
      accessDate: '28/May/2019 12:01PM',
      registered: 'Yes',
      registeredDate: '28/May/2019 12:19PM',
      revoke: false,
    },
    {
      name: 'Cindy Torp',
      jobTitle: 'CFO',
      email: 'TorpCindy328@test.com',
      functions: 'Finance',
      accessDate: '12/May/2020 2:42PM',
      registered: 'Yes',
      registeredDate: '14/Jul/2020 7:38PM',
      revoke: true,
    },
  ];

  defaultColDef = {
    flex: 1,
    minWidth: 150,
    resizable: true,
  };

  onCellClicked(event: any) {
    if (
      event.colDef.field === 'revoke' &&
      event.event.target.classList.contains('revoke-button')
    ) {
      const rowData = event.data;
      alert(`Revoke access for ${rowData.name}`);
      // Add your logic to handle revoke access here
    }
  }
}
