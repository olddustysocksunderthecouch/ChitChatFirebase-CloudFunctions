export interface ChatPreviewItem {
    message: string;
    message_status: string;
    sender_name: string;
    sender_uid: string;
    sender_photo_url;
    unread_count: number;
    last_read: number;
    timestamp: number;
}