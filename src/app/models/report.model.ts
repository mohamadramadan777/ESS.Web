
export class Report {
    ServiceProcessID: number = 0;
    ServiceRequestNo: string;
    ServiceProcessDesc: string;
    ServiceProcessUserNote: string;
    CreatedByName: string;
    CreatedDate: string;
    constructor(
        ServiceProcessID: number = 0,
        ServiceRequestNo: string = '',
        ServiceProcessDesc: string = '',
        ServiceProcessUserNote: string = '',
        CreatedByName: string = '',
        CreatedDate: string = ''
    ) {
        this.ServiceProcessID = ServiceProcessID;
        this.ServiceRequestNo = ServiceRequestNo;
        this.ServiceProcessDesc = ServiceProcessDesc;
        this.ServiceProcessUserNote = ServiceProcessUserNote;
        this.CreatedByName = CreatedByName;
        this.CreatedDate = CreatedDate;
    }
}

export class Firm {
    FirmTypeDesc: string = '';
    FirmName: string = '';
    LicensedTypeDesc: string = '';
    AuthorisationStatus: string = '';
    isEssActivestr: string = '';
    UserName: string = '';
    EmailAddress: string = '';
    ActiveRoles: string = '';
    ApproveFunctions: string = '';
    IsUserAccessAuthorised: boolean = false;
    IsRegistered: boolean = false;
    IsActive: boolean = false;
    IsLocked: boolean = false;
}
