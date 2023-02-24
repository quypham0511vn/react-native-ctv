
import { BaseService } from './base-service';
import { API_CONFIG } from './constants';

export class LoanBillServices extends BaseService {
    createLoanBill = async (
        fullname?: string,
        phone_number?: string,
        type_finance?: string,
        hk_province?: string,
        hk_district?: string,
        hk_ward?: string
    ) => this.api().post(API_CONFIG.CREATE_LOAN_BILL, this.buildFormData({
        fullname,
        phone_number,
        type_finance,
        hk_province,
        hk_district,
        hk_ward
    }));

    getLoanForm = async () => this.api().get(API_CONFIG.GET_LOAN_FORM, {});
}
