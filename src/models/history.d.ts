import { Id } from './id';

export interface HistoryModel {
    id: Id;
    type: string;
    status: string;
    money: string;
    created_at: string;
    year: number;
    month: number;
}
export interface DetailsHistoryModel {
    id: Id;
    type: string;
    customer_name: string;
    code: string;
    money: string;
    status: string;
    status_eng: string;
    created_at: string;
}

export interface HistoryPaymentModel {
    id?: string | number;
    bankName?: string;
    bankOwner?: string;
    bankNumber?: string;
    content?: string;
    date?: string;
}
