import { Id } from './id';

export interface UserInfoModel {
    type: string;
    phone_number: string;
    password: string;
    ctv_name: string;
    ctv_email: string;
    loan_purpose?: string;
    created_at: number;
    status: string;
    status_login?: boolean;
    token_active: number;
    timeExpried_active?: number;
    created_by: string;
    token_app?: string;
    _id: Id;
    indentify?: string;
    identify?: string;
    role_user?: string;
    updated_at?: string;
    updated_by?: string;
    username?: string;
    ctv_DOB?: string;
    avatar?: string,
    id_fblogin?: string;
    id_google?: string;
    user_apple?: string;
    image_cmt_matsau?: string;
    image_cmt_mattruoc?: string;
    photo?: string;
    status_verified?: string;
    rate?: number;
    isAdmin?: boolean;
    ctv_gender?: string;
    ctv_address?: string;
    account_type?: string;
    ctv_code?: string;
    ctv_phone?: string;
    form: string;
    introducer_id?: string;
    phone_introduce?: string;
    user_type?: string;
    city?: string;
    ward?: string;
    district?: string;
    exactlyAddress?: string;
    payMount?: string;
    createdProduct?: string;
    successProduct?: string;
    email: string;
    ctv_company: string;
}
interface OtpModel {
    otp1: any;
    otp2: any;
    otp3: any;
    otp4: any;
    otp5: any;
    otp6: any
}
