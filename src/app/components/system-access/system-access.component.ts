import { ColDef } from 'ag-grid-community';
import { Component, ViewChild } from '@angular/core';
import { AccessModalComponent } from './access-modal/access-modal.component';
import * as config from './system-access-config';
import {
  TextFilterModule,
  ClientSideRowModelModule,
  NumberEditorModule,
  ValidationModule,
  TextEditorModule,
  themeQuartz,
  PaginationModule,
  NumberFilterModule,
  PaginationNumberFormatterParams,
  RowSelectionModule,
} from 'ag-grid-community';

@Component({
  selector: 'app-system-access',
  templateUrl: './system-access.component.html',
  styleUrls: ['./system-access.component.scss'],
})
export class SystemAccessComponent {
  public modules = [
    TextFilterModule,
    NumberEditorModule,
    TextEditorModule,
    ClientSideRowModelModule,
    ValidationModule,
    PaginationModule,
    NumberFilterModule,
    RowSelectionModule,
  ];
  @ViewChild('accessModal') accessModal!: AccessModalComponent;
  paginationPageSize = config.paginationPageSize;
  theme = config.theme;
  paginationPageSizeSelector = config.paginationPageSizeSelector;
  paginationNumberFormatter = (params: PaginationNumberFormatterParams) => {
    return '[' + params.value.toLocaleString() + ']';
  };
   paginationPageSize=10;
   theme=themeQuartz
  paginationPageSizeSelector= [1, 5, 10];
  paginationNumberFormatter= (params: PaginationNumberFormatterParams) => {
    return "[" + params.value.toLocaleString() + "]";
  }
  openAccessModal(): void {
    document.body.classList.add('modal-open');
    this.accessModal.openModal();
  }

  onModalClosed(): void {
    document.body.classList.remove('modal-open');
  }

  columnDefs: ColDef[] = config.colDef

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
    
    // Add more rows to test pagination
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
