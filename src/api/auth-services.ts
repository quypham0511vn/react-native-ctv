import { BaseService } from './base-service';
import { API_CONFIG } from './constants';

export class AuthServices extends BaseService {
    loginPhone = async (phone_login: string, password_login: string) =>
        this.api().post(
            API_CONFIG.LOGIN,
            this.buildFormData({
                phone_login,
                password_login
            })
        );

    updateUserInfo = async (
        full_name?: string,
        birthday?: string, // format: 1992-06-10
        email?: string,
        gender?: string, // male or female
        company?: string
    ) => this.api().post(API_CONFIG.UPDATE_USER_INFO, this.buildFormData({
        full_name,
        birthday,
        email,
        gender,
        ctv_company: company
    }));


    registerAuth = async (
        phone_user: string,
        password_user: string,
        password_user_retype: string,
        form: string,
        phone_introduce: string,
        email_user: string,
        reference_id: string,
        ctv_company: string
    ) =>
        this.api().post(
            API_CONFIG.REGISTER,
            this.buildFormData({
                phone_user,
                password_user,
                password_user_retype,
                form,
                phone_introduce,
                email_user,
                reference_id,
                ctv_company
            })
        );

    changePwdAuth = async (password_old?: string, password_new?: string) => this.api().post(API_CONFIG.CHANGE_NEW_PWD,
        this.buildFormData({
            password_old,
            password_new
        })
    );

    activeAuth = async (otp_check: string, user_id: string) =>
        this.api(API_CONFIG.BASE_URL, true, true).post(
            API_CONFIG.ACTIVE_AUTH,
            this.buildFormData({
                otp_check,
                user_id
            })
        );

    resendOtp = async (user_id: string) =>
        this.api().post(
            API_CONFIG.RESEND_OTP,
            this.buildFormData({
                user_id
            })
        );

    otpResetPwd = async (qmt_phone: string) =>
        this.api().post(
            API_CONFIG.OTP_RESET_PWD,
            this.buildFormData({
                qmt_phone
            })
        );

    activeOtpPwd = async (otp: string, user_id: string) =>
        this.api(API_CONFIG.BASE_URL, true, true).post(
            API_CONFIG.ACTIVE_OTP_PWD,
            this.buildFormData({
                otp,
                user_id
            })
        );

    resendOtpPwd = async (user_id: string) =>
        this.api().post(
            API_CONFIG.RESEND_OTP_QMK,
            this.buildFormData({
                user_id
            })
        );

    updateNewPwd = async (
        new_pass: string,
        new_pass_current: string,
        user_id: string
    ) =>
        this.api().post(
            API_CONFIG.UPDATE_PWD,
            this.buildFormData({
                new_pass,
                new_pass_current,
                user_id
            })
        );

    loginWithThirdParty = async (type_login: string, provider_id: string) =>
        this.api().post(
            API_CONFIG.LOGIN_THIRD_PARTY,
            this.buildFormData({
                type_login,
                provider_id
            })
        );

    confirmPhoneNumber = async (user_id: string, phone_number: string) =>
        this.api().post(
            API_CONFIG.CONFIRM_PHONE_NUMBER,
            this.buildFormData({
                user_id,
                phone_number
            })
        );

    activeAccountSocial = async (otp: string, user_id: string) =>
        this.api().post(
            API_CONFIG.ACTIVE_ACCOUNT_SOCIAL,
            this.buildFormData({
                otp,
                user_id
            })
        );

    getUserInfo = async () => this.api().get(API_CONFIG.USER_INFO);

    linkSocialAccount = async (type_login: string, provider_id: string) =>
        this.api().post(
            API_CONFIG.LINK_SOCIAL,
            this.buildFormData({ type_login, provider_id })
        );

    uploadIdentity = async (
        image_cmt_mattruoc: string,
        image_cmt_matsau: string,
        photo: string
    ) => this.api().post(API_CONFIG.UPLOAD_IDENTITY, this.buildFormData({
        image_cmt_mattruoc,
        image_cmt_matsau,
        photo
    }));

    uploadAvatar = async (avatar?: string) => this.api().post(API_CONFIG.UPLOAD_AVATAR, this.buildFormData({ avatar }));

    resendOtpDeleteAccount = async () =>
        this.api().post(
            API_CONFIG.OTP_DELETE_ACCOUNT, this.buildFormData({})
        );

    deleteAccount = async (otp: string, checksum?: string) => this.api().post(API_CONFIG.DELETE_ACCOUNT, this.buildFormData({ otp, checksum }));

    addBankAccount = async (account_name?: string, account?: string, bank_code?: string) =>
        this.api().post(
            API_CONFIG.ADD_BANK_ACCOUNT, this.buildFormData({
                account_name,
                account,
                bank_code
            })
        );

    getLinkReferral = async () => this.api().get(API_CONFIG.GET_LINK_REFERRAL);

    getPersonalReport = async () => this.api().get(API_CONFIG.GET_PERSONAL_REPORT);

}
