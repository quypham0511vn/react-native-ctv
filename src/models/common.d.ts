export interface ItemPropsModel {
    id?: number;
    text?: string;
    value?: string;
}


export interface AddressModel {
    _id?: string;
    code?: string;
    name?: string;
    name_with_type?: string;
    slug?: string;
    status?: string;
    type?: string;
}

export interface BankModel {
    stk_user: string;
    bank: any;
    id?: number;
    name?: string;
    code?: string;
    bin?: string;
    isTransfer?: number;
    short_name?: string;
    logo?: string;
    vietqr?: number;
},

export interface BankUserModel {
    _id: string;
    bank: BankModel;
    created_at: number;
    name_user: string;
    stk_user: string;
    user_id: string;
}

export interface LinkReferral {
    link_referral_register: string,
    link_referral_loan: string
}

export interface PersonalReportModel {
    tong_tien_thanh_toan?: string;
    tong_hoa_hong?: string;
    san_pham_da_tao?: string;
    san_pham_da_tao_thanh_cong?: string;
}

export type AddressType = {
    city?: string;
    district?: string;
    ward?: string;
}

export type PostDataType = {
    assetType?: string;
    city?: string;
    district?: string;
    ward?: string;
}

export type AddressArrayType = {
    cityArray?: ItemPropsModel[];
    districtArray?: ItemPropsModel[];
    wardArray?: ItemPropsModel[];
}
