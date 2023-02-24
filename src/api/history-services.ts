import { BaseService } from './base-service';
import { API_CONFIG } from './constants';

export class HistoryServices extends BaseService {

    getLoanList = async (limit?: number,
        offset?: number,
        option?: number,
        start_date?: string,
        end_date?: string,
        type_finance?: string,
        text?: string
    ) => this.api().get(API_CONFIG.GET_LOAN_LIST, {
        limit,
        offset,
        option, // 1:đang xử lí, 2: thành công, 3: thất bại
        start_date,
        end_date,
        type_finance,
        text // tim kiem theo SDT hoac ho va ten
    });

    getLoanListGroup = async (limit?: number,
        offset?: number,
        option?: number,
        start_date?: string,
        end_date?: string,
        type_finance?: string,
        text?: string
    ) => this.api().get(API_CONFIG.GET_LOAN_LIST_GROUP, {
        limit,
        offset,
        option, // 1:đang xử lí, 2: thành công, 3: thất bại
        start_date,
        end_date,
        type_finance,
        text // tim kiem theo SDT hoac ho va ten
    });

    getPaymentHistoryList = async (
        limit?: number,
        offset?: number,
        datefrom?: string,
        dateto?: string
    ) => this.api().get(API_CONFIG.GET_PAYMENT_HISTORY, {
        limit,
        offset,
        datefrom,
        dateto
    });

    getPaymentAccountList = async () => this.api().get(API_CONFIG.GET_PAYMENT_ACCOUNT_LIST);

    getCollaboratorList = async (
        limit?: number,
        offset?: number
    ) => this.api().get(API_CONFIG.GET_COLLABORATOR_LIST, {
        limit,
        offset
    });

}
