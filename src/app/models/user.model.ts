export class User {
  emailAddress: string;
  userName: string;
  roles: string[];
  serviceRequestId: string;
  note: string;

  constructor(emailAddress: string, userName: string, roles: string[], serviceRequestId: string, note: string) {
    this.emailAddress = emailAddress;
    this.userName = userName;
    this.roles = roles;
    this.serviceRequestId = serviceRequestId;
    this.note = note;
  }
}

export interface User {
  emailAddress: string;
  userName: string;
  roles: string[];
  serviceRequestId: string;
  note: string;
  wUserId: number;
  wAccessRequestId: string;
  qfcNumber: string;
  firmName: string;
  individualName: string;
  individualEmailAddress: string;
  isRegistered: boolean;
  isActive: boolean;
  createdDate: Date;
  updatedDate: Date;
  createdBy: string;
  updatedBy: string;
  

   modifiedDate: Date;
}

export interface UserSearchCriteria {
  qfcNumber?: string;
  firmName?: string;
  aiNumber?: string;
  emailAddress?: string;
  userRole?: number;
  isAccountActive?: boolean;
  isAccountLocked?: boolean;
  isRegistered?: boolean;
  firmType?: number;
  isUserAuthorized?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export interface Project {
  projectId: number;
  projectName: string;
  projectDescription: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

export interface User {
  wUserId: number;
  wAccessRequestId: string;
  qfcNumber: string;
  firmName: string;
  individualName: string;
  individualEmailAddress: string;
  isRegistered: boolean;
  isActive: boolean;
  isAccountLocked: boolean;
  isUserAccessAuthorised: boolean;
  firmTypeId: number;
  firmTypeDesc: string;
  roleIds: number[];
  activeRoleIds: number[];
  roleDescription: string;
  emailAddress: string;
  userName: string;
  roles: string[];
  serviceRequestId: string;
  note: string;
  createdDate: Date;
  updatedDate: Date;
  createdBy: string;
  updatedBy: string;
  modifiedDate: Date;
}
