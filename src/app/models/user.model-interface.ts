export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}