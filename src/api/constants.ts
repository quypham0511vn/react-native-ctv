import { isIOS } from '@/commons/Configs';

// README: Should be using react native config

export enum LINKS {
    WEB = 'https://tienngay.vn/',
    VPS = 'https://openaccount.vps.com.vn/?MKTID=H787',
    ABOUT_US = 'https://tienngay.vn/gioi-thieu-app',
    POLICY = 'https://tienngay.vn/app-privacy-policy',
    FAQ = 'https://tienngay.vn/faqs-app',
    FB_FAN_PAGE = 'https://www.facebook.com/tienngay.vn',
    STORE_ANDROID = 'https://play.google.com/store/apps/details?id=vn.tienngay.ctv',
    STORE_IOS = 'https://apps.apple.com/id/app/tienngay-customer/id1560920806',
    ONE_LINK = 'https://onelink.to/66ada6',
    LUCKY_LOTT_ANDROID = 'https://play.google.com/store/apps/details?id=com.luckylott.store',
    LUCKY_LOTT_IOS = 'https://apps.apple.com/vn/app/luckylott/id1518746631',
    LINK_TIENNGAY_WEB = 'https://tienngay.vn/',
    LINK_TIENNGAY_FACEBOOK = 'https://www.facebook.com/tienngay.vn/',
    PAYMENT_POLICY = 'https://ctv.tienvui.vn/payment',

}

export enum CONTACT {
    PHONE = '19006907'
}

export const PAGE_LENGTH = 10;

export const STORE_APP_LINK = isIOS ? LINKS.STORE_IOS : LINKS.STORE_ANDROID;
export const STORE_LUCKY_LOTT = isIOS ? LINKS.LUCKY_LOTT_IOS : LINKS.LUCKY_LOTT_ANDROID;

export const BASE_URL_CUSTOMER = 'https://appkh.tienngay.vn/V2';

export enum API_CONFIG {
    BASE_URL = 'https://cpanelv2.tienngay.vn',
    // BASE_URL = 'https://apiv2.tienvui.vn',
    DOMAIN_SHARE = 'https://',

    // group manager
    LIST_STAFF = '/ctv-tienngay/app/user/doi-nhom/member',
    UPDATE_STATUS = '/ctv-tienngay/app/user/doi-nhom/status_member',
    REPORT_GROUP = '/ctv-tienngay/app/don-vay/doi-nhom/report_group_general',
    TOTAL_MEMBER = '/ctv-tienngay/app/don-vay/doi-nhom/total_member',
    REPORT_GROUP_BY_YEAR = '/ctv-tienngay/app/don-vay/doi-nhom/report_by_year',
    REPORT_GROUP_BY_MONTH = '/ctv-tienngay/app/don-vay/doi-nhom/report_rate_by_month',
    REPORT_RATE_MEMBER = '/ctv-tienngay/app/don-vay/doi-nhom/report_rate_month_by_member',
    LIST_BONUS = '/ctv-tienngay/get_list_commission',
    CREATE_STAFF = '/ctv-tienngay/app/user/doi-nhom/add-member',
    // common
    GET_VERSION = '/api/VersionApiStatic',
    GET_BANNERS = '/banner/get_all_home', // banner app
    GET_NEWS = '/banner/news', // tin t???c truy???n th??ng
    GET_INSURANCES = '/banner/handbook', // danh s??ch b???o hi???m
    CHECK_APP_REVIEW = '/ctv-tienngay/app/review', // s??? d???ng ????? ???n 1 s??? t??nh n??ng khi apple store, google play review app

    // authentication
    LOGIN = '/ctv-tienngay/login',
    TOKEN = '/token',
    USER_INFO = '/ctv-tienngay/app/user/info', // th??ng tin t??i kho???n
    REGISTER = '/ctv-tienngay/register_store', // ????ng k?? t??i kho???n
    ACTIVE_AUTH = '/ctv-tienngay/check_otp_register', // k??ch ho???t t??i kho???n: OTP
    RESEND_OTP = 'ctv-tienngay/gui_lai_otp', // g???i l???i otp
    UPDATE_USER_INFO = '/ctv-tienngay/app/user/update_info', // c???p nh???t th??ng tin user
    CHANGE_NEW_PWD = '/ctv-tienngay/app/user/update_password', // change m???t kh???u m???i
    LOGIN_THIRD_PARTY = 'auth/login', // login b??n th??? 3  facebook, google, apple,
    CONFIRM_PHONE_NUMBER = 'auth/update_phone_number', // x??c th???c s??? ??i???n tho???i
    ACTIVE_ACCOUNT_SOCIAL = '/ctv-tienngay/check_otp_register', // active t??i kho???n sau khi x??c th???c OTP
    OTP_RESET_PWD = '/ctv-tienngay/quen_mat_khau', // otp reset pwd
    ACTIVE_OTP_PWD = '/ctv-tienngay/check_otp_qmk',
    RESEND_OTP_QMK = 'ctv-tienngay/gui_lai_otp_qmk',
    UPDATE_PWD = '/ctv-tienngay/register_new_password',
    LINK_SOCIAL = '/user/link_social',
    OTP_DELETE_ACCOUNT = '/user/block_account',
    DELETE_ACCOUNT = '/user/confirm_block_account',

    // upload ???nh
    UPLOAD_HTTP_IMAGE = '/ctv-tienngay/app/upload',// lay duong dan cua anh
    UPLOAD_IDENTITY = '/ctv-tienngay/app/user/identity', // upload eKyc
    UPLOAD_AVATAR = '/ctv-tienngay/app/user/update_avatar', // upload anh dai dien

    // notification
    NOTIFICATION = '/user/get_notification_user',
    CREATE_FCM_TOKEN = '/ctv-tienngay/app/user/save_device_token_user', // tao token device gui thong bao firebase. 
    GET_UNREAD_COUNT_NOTIFICATION = 'user/get_count_notification_user',

    // API
    CREATE_LOAN_BILL = '/ctv-tienngay/app/don-vay/create', //  t???o ????n vay
    GET_LOAN_FORM = '/ctv-tienngay/app/config/lead_type_finance',//  l???y danh s??ch h??nh th???c vay
    GET_BANK_LIST = '/ctv-tienngay/app/config/get_list_bank',// L???y ds ng??n h??ng
    GET_PERSONAL_REPORT = '/ctv-tienngay/app/don-vay/report_general_by_user',// lay ds bao cao ca nhan 
    ADD_BANK_ACCOUNT = '/ctv-tienngay/app/user/add_bank_payment', // them tai khoan ngan hang
    GET_LINK_REFERRAL = '/ctv-tienngay/app/user/referral_link', // lay link gioi thieu
    LIST_BANK_USER = '/ctv-tienngay/app/user/list_bank_user',

    // get address
    GET_CITY_LIST = '/ctv-tienngay/get_province', //  ds th??nh ph???
    GET_DISTRICT_LIST = '/ctv-tienngay/get_district', // ds qu???n/huy???n
    GET_WARD_LIST = '/ctv-tienngay/hk_ward', // ds ph?????ng/x??

    // L???y danh s??ch ????n vay
    GET_LOAN_LIST = '/ctv-tienngay/app/don-vay/list', // lay danh sach don vay
    GET_PAYMENT_HISTORY = '/ctv-tienngay/app/don-vay/transaction',// lay ds phuong thuc thanh toan
    GET_PAYMENT_ACCOUNT_LIST = '/ctv-tienngay/app/user/list_bank_user', // l???y ds t??i kho???n thanh to??n
    GET_LOAN_LIST_GROUP = '/ctv-tienngay/app/don-vay/doi-nhom/don_vay_member',
    GET_COLLABORATOR_LIST = '/ctv-tienngay/app/don-vay/transaction', // l???y ds cong tac vien
}
