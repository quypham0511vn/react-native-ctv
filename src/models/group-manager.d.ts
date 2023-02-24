export interface GroupManagerModel {
    payment_amount: string;
    bonus: string;
    staff: number;
    product: string;
    successful_product: string;
    monthly_sales_rate: MonthlySalasRateModel[];
}

export interface MonthlySalasRateModel {
    id: string;
    month: string;
    disbursement: number;
    insurance: number;
    monthly_sales_rate_staff: MonthlySalasRateStaffModel[];
}

export interface MonthlySalasRateStaffModel {
    id: string;
    name: string;
    disbursement: number;
    insurance: number;
    index?: number;
}

export interface StaffModel {
    id: string;
    vi_tri: string;
    name: string;
    thoi_gian: string;
    status: string;
}
export interface BonusGroupModel {
    application_ctv_individual: string;
    created_at: string;
    end_date: string;
    group_ctv: string[];
    note_commission: string;
    product_list: ProductModel[];
    product_type: ProductTypeModel;
    start_date: string;
    status: string;
    title_commission: string;
    _id: string;
}
export interface ProductModel {
    name: string;
    percent: string;
    slug: string;
}

export interface ProductTypeModel {
    code: string;
    id: string;
    text: string;
}

//

export interface ReportGroupModel {
    tong_tien_thanh_toan: string;
    tong_hoa_hong: string;
    san_pham_da_tao: number;
    san_pham_da_tao_thanh_cong: string;
    tong_so_thanh_vien: string;
}
export interface ReportGroupByYear {
    price_bh_month: number;
    price_giaingan_month: number;
    month: string;
}
export interface ReportGroupByMonth {
    price_bh_month: number;
    price_giaingan_month: number;
}

export interface RateMemberModel {
    stt?: string;
    id: string;
    name: string;
    price_bh_month: number;
    price_giaingan_month: number;
}

export interface PagingConditionTypes {
    offset: number;
    isLoading: boolean;
    canLoadMore: boolean;
}

export interface MessageModel {
    message: string;
    status: number;
}




