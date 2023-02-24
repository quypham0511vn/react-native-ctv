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
    GET_NEWS = '/banner/news', // tin tức truyền thông
    GET_INSURANCES = '/banner/handbook', // danh sách bảo hiểm
    CHECK_APP_REVIEW = '/ctv-tienngay/app/review', // sử dụng để ẩn 1 số tính năng khi apple store, google play review app

    // authentication
    LOGIN = '/ctv-tienngay/login',
    TOKEN = '/token',
    USER_INFO = '/ctv-tienngay/app/user/info', // thông tin tài khoản
    REGISTER = '/ctv-tienngay/register_store', // đăng kí tài khoản
    ACTIVE_AUTH = '/ctv-tienngay/check_otp_register', // kích hoạt tài khoản: OTP
    RESEND_OTP = 'ctv-tienngay/gui_lai_otp', // gửi lại otp
    UPDATE_USER_INFO = '/ctv-tienngay/app/user/update_info', // cập nhật thông tin user
    CHANGE_NEW_PWD = '/ctv-tienngay/app/user/update_password', // change mật khẩu mới
    LOGIN_THIRD_PARTY = 'auth/login', // login bên thứ 3  facebook, google, apple,
    CONFIRM_PHONE_NUMBER = 'auth/update_phone_number', // xác thực số điện thoại
    ACTIVE_ACCOUNT_SOCIAL = '/ctv-tienngay/check_otp_register', // active tài khoản sau khi xác thực OTP
    OTP_RESET_PWD = '/ctv-tienngay/quen_mat_khau', // otp reset pwd
    ACTIVE_OTP_PWD = '/ctv-tienngay/check_otp_qmk',
    RESEND_OTP_QMK = 'ctv-tienngay/gui_lai_otp_qmk',
    UPDATE_PWD = '/ctv-tienngay/register_new_password',
    LINK_SOCIAL = '/user/link_social',
    OTP_DELETE_ACCOUNT = '/user/block_account',
    DELETE_ACCOUNT = '/user/confirm_block_account',

    // upload ảnh
    UPLOAD_HTTP_IMAGE = '/ctv-tienngay/app/upload',// lay duong dan cua anh
    UPLOAD_IDENTITY = '/ctv-tienngay/app/user/identity', // upload eKyc
    UPLOAD_AVATAR = '/ctv-tienngay/app/user/update_avatar', // upload anh dai dien

    // notification
    NOTIFICATION = '/user/get_notification_user',
    CREATE_FCM_TOKEN = '/ctv-tienngay/app/user/save_device_token_user', // tao token device gui thong bao firebase. 
    GET_UNREAD_COUNT_NOTIFICATION = 'user/get_count_notification_user',

    // API
    CREATE_LOAN_BILL = '/ctv-tienngay/app/don-vay/create', //  tạo đơn vay
    GET_LOAN_FORM = '/ctv-tienngay/app/config/lead_type_finance',//  lấy danh sách hình thức vay
    GET_BANK_LIST = '/ctv-tienngay/app/config/get_list_bank',// Lấy ds ngân hàng
    GET_PERSONAL_REPORT = '/ctv-tienngay/app/don-vay/report_general_by_user',// lay ds bao cao ca nhan 
    ADD_BANK_ACCOUNT = '/ctv-tienngay/app/user/add_bank_payment', // them tai khoan ngan hang
    GET_LINK_REFERRAL = '/ctv-tienngay/app/user/referral_link', // lay link gioi thieu
    LIST_BANK_USER = '/ctv-tienngay/app/user/list_bank_user',

    // get address
    GET_CITY_LIST = '/ctv-tienngay/get_province', //  ds thành phố
    GET_DISTRICT_LIST = '/ctv-tienngay/get_district', // ds quận/huyện
    GET_WARD_LIST = '/ctv-tienngay/hk_ward', // ds phường/xã

    // Lấy danh sách đơn vay
    GET_LOAN_LIST = '/ctv-tienngay/app/don-vay/list', // lay danh sach don vay
    GET_PAYMENT_HISTORY = '/ctv-tienngay/app/don-vay/transaction',// lay ds phuong thuc thanh toan
    GET_PAYMENT_ACCOUNT_LIST = '/ctv-tienngay/app/user/list_bank_user', // lấy ds tài khoản thanh toán
    GET_LOAN_LIST_GROUP = '/ctv-tienngay/app/don-vay/doi-nhom/don_vay_member',
    GET_COLLABORATOR_LIST = '/ctv-tienngay/app/don-vay/transaction', // lấy ds cong tac vien
}
