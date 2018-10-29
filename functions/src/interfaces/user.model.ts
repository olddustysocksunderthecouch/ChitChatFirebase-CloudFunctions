import { UserStatus } from './user-status.model'

export interface User {
    display_name: string;
    photo_url: string;
    contact_number?: string;
    date_joined?: number;
    status: UserStatus
}
