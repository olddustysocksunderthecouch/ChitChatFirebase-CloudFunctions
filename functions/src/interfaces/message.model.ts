import { UID } from './uid-list.model'

export interface Message {
    message: string;
    sender_uid: string;
    sender_name: string;
    sender_photo_url: string;
    read: Array<UID>;
    timestamp: number;
}
