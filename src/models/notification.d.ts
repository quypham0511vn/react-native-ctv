import { Id } from './id';

export interface NotificationModel {
    _id: Id;
    action_id: string;
    action: string;
    note: string;
    id_transaction: Id;
    user_id: string;
    status: number;
    contract_status: string;
    amount: string;
    message: string;
    created_at: number;
    created_by: string;
    id: Id;
}

export interface NotificationTotalModel {
    status: number,
    total_unRead: number
}
