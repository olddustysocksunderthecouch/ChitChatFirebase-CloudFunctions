import { UserStatus } from './user-status'
export interface User {
    display_name: string;
    photo_url: string;
    role: string;
    contact_number?: string;
    date_joined?: number;
    status: UserStatus
}