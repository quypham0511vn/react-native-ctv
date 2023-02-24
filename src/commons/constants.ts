import { CONTACT } from '@/api/constants';
import Languages from '@/commons/Languages';
import { ItemPropsModel } from '@/models/common';
import { NotifyTypeModel } from '@/models/notify-type';

export const PHONE_PREFIX = '+84';

export const PHONE_REGEX = /^0+[3,5,7,8,9]{1}[0-9]{1}[1-9]{1}[0-9]{6}$/;
export const NUMBER_REGEX = /^[0-9]*$/;
export const EMAIL_REGEX = /^[\w+][\w\.\-]+@[\w\-]+(\.\w{2,10})+$/;
export const PASSWORD_REGEX = /^\w{6,20}$/;

export const SECONDS_IN_DAY = 864e5;
export const DELAY_CLICK = 3e2;
export const INDEX_ITEM = 4;
export const ITEM_CALL_PHONE = `${Languages.itemInForAccount.hotline}${': '}${CONTACT.PHONE}`;

export enum StorageKeys {
    KEY_ACCESS_TOKEN = 'KEY_ACCESS_TOKEN',
    KEY_DEVICE_TOKEN = 'KEY_DEVICE_TOKEN',
    KEY_DEVICE_TOKEN_FIREBASE = 'KEY_DEVICE_TOKEN_FIREBASE',
    KEY_USER_INFO = 'KEY_USER_INFO',
    KEY_SKIP_ONBOARDING = 'KEY_SKIP_ONBOARDING',
    KEY_LAST_POSITION = 'KEY_LAST_POSITION',
    KEY_LAST_LOGIN_INFO = 'KEY_LAST_LOGIN_INFO',
    KEY_LATEST_NOTIFY_ID = 'KEY_LATEST_NOTIFY_ID',
    KEY_SAVED_API_VERSION = 'KEY_SAVED_API_VERSION',
    KEY_BIOMETRY_TYPE = 'KEY_BIOMETRY_TYPE',
    KEY_FAST_AUTHENTICATION = 'KEY_FAST_AUTHENTICATION',
    KEY_PASSCODE = 'KEY_PASSCODE',
    KEY_RATE = 'KEY_RATING',
    KEY_ENABLE_FAST_AUTHENTICATION = 'KEY_FAST_AUTHENTICATION',
    KEY_PIN = 'KEY_PIN',
    KEY_SAVE_LOGIN_PHONE = 'KEY_SAVE_LOGIN_PHONE',
    KEY_SAVE_IS_LOGOUT = 'KEY_SAVE_IS_LOGOUT',
}

export enum ENUM_BIOMETRIC_TYPE {
    TOUCH_ID = 'TouchID',
    FACE_ID = 'FaceID',
    KEY_PIN = 'KEY_PIN',
}
export enum ERROR_BIOMETRIC {
    // ios
    RCTTouchIDNotSupported = 'RCTTouchIDNotSupported',
    RCTTouchIDUnknownError = 'RCTTouchIDUnknownError',
    LAErrorTouchIDNotEnrolled = 'LAErrorTouchIDNotEnrolled',
    LAErrorTouchIDNotAvailable = 'LAErrorTouchIDNotAvailable',
    LAErrorTouchIDLockout = 'LAErrorTouchIDLockout',
    LAErrorAuthenticationFailed = 'LAErrorAuthenticationFailed',
    // android
    NOT_SUPPORTED = 'NOT_SUPPORTED',
    NOT_AVAILABLE = 'NOT_AVAILABLE',
    NOT_ENROLLED = 'NOT_ENROLLED',
    FINGERPRINT_ERROR_LOCKOUT_PERMANENT = 'FINGERPRINT_ERROR_LOCKOUT_PERMANENT',
    ErrorFaceId = 'ErrorFaceId',
    FINGERPRINT_ERROR_LOCKOUT = 'FINGERPRINT_ERROR_LOCKOUT',
}
export function messageError(value: string) {
    switch (value) {
        case ERROR_BIOMETRIC.RCTTouchIDNotSupported:
            return Languages.errorBiometryType.RCTTouchIDNotSupported;
        case ERROR_BIOMETRIC.RCTTouchIDUnknownError:
            return Languages.errorBiometryType.RCTTouchIDUnknownError;
        case ERROR_BIOMETRIC.LAErrorTouchIDNotEnrolled:
            return Languages.errorBiometryType.LAErrorTouchIDNotEnrolled;
        case ERROR_BIOMETRIC.LAErrorTouchIDLockout:
            return Languages.errorBiometryType.LAErrorTouchIDLockout;
        case ERROR_BIOMETRIC.NOT_ENROLLED:
            return Languages.errorBiometryType.NOT_ENROLLED;
        case ERROR_BIOMETRIC.ErrorFaceId:
            return Languages.errorBiometryType.ErrorFaceId;
        default:
            return Languages.errorBiometryType.NOT_DEFINE;
    }
}

export enum Events {
    TOAST = 'TOAST',
    LOGOUT = 'LOGOUT',
    SWITCH_KEYBOARD = 'SWITCH_KEYBOARD',
}

export enum ToastTypes {
    ERR = 0, //  red background
    MSG = 1, // dark blue background
    SUCCESS = 2, // green background
}

export enum PopupTypes {
    OTP = 1,
    POST_NEWS = 2,
}

export enum ErrorCodes {
    SUCCESS = 0,
    IMAGE_LIMIT_SIZE = 1,
}

export enum HistoryCodes {
    SUCCESS = 1,
    FAILS = 2,
}

export enum UseFastAuth {
    TRUE = '1',
    FALSE = '0',
}

export const configGoogleSignIn = {
    webClientId:
        '1028905605067-lubnte369m2lg5pgolkf20jmggfaf0in.apps.googleusercontent.com'
};
export enum MaxText {
    max = 40,
}

export enum PRODUCT {
    CAR = 'OTO',
    MOTOR = 'XM',
    CREDIT = 'TC',
    LAND = 'NĐ',
}

export enum Bill {
    WATER = '0',
    ELECTRIC = '1',
    FINANCE = '2',
}
export enum Type {
    Type = '2',
}

export const NotificationTypes = [
    { key: 0, label: Languages.notify.filters[0] },
    { key: 1, label: Languages.notify.filters[1] }
    // { key: 2, label: Languages.notify.filters[2] },
    // { key: 3, label: Languages.notify.filters[3] },
    // { key: 4, label: Languages.notify.filters[4] },
] as NotifyTypeModel[];

export enum ENUM_PROVIDER {
    GOOGLE = 'google',
    FACEBOOK = 'facebook',
    APPLE = 'apple',
}

export enum ENUM_PROVIDERS_SERVICE {
    LOTTERY = 'LUCKY_LOTT',
    VPS = 'VPS'
}

export const BLACK_LIST_PHONES = ['0988251903', '09734343589'];

export const enum ENUM_ERROR_QUERY_BILL {
    NOT_FOUND = '01',
    PAY_OFF = '26'
}

export enum STATE_AUTH_ACC {
    VERIFIED = '3', // Đã xác nhận thông tinÎ
    WAIT = '2', // Chờ TienNgay xác nhận thông tin
    UN_VERIFIED = '1', // Cần xác thực thông tin CMT/CCCD
    RE_VERIFIED = '4' // Xác thực lại thông tin CMT/CCCD
};

export const noteKYC = [
    '1. Mặt trước rõ, đủ 4 góc',
    '2. Không chụp giấy tờ tuỳ thân photo, chụp thông qua màn hình thiết bị điện tử.'
];

export const noteAvatar = [
    '1. Chụp cận mặt, rõ, thẳng góc, không bị che, không chụp quá xa.',
    '2. Không chụp chân dung từ ảnh, màn hình thiết bị điện tử.'
];


export enum TYPE_FILTER {
    PROCESS = 1,
    SUCCESS = 2,
    FALSE = 3,
}
export const DayOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
export const MonthName = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
export const Month = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

export enum TYPE_DATE {
    START_DATE = 'START_DATE',
    END_DATE = 'END_DATE',
}

export const dataRatingPoint = [
    { id: '1', value: 'Tệ' },
    { id: '2', value: 'Khá tệ' },
    { id: '3', value: 'Tạm được' },
    { id: '4', value: 'Tốt' },
    { id: '5', value: 'Xuất sắc' }
];

export enum TYPE_FORM_ACCOUNT {
    PRIVATE = '1',
    GROUP = '2'
};

export enum TYPE_TYPE_ACCOUNT {
    PRIVATE = '2',
    GROUP = '1'
};

export enum TYPE_COLOR {
    GREEN = 'green',
    RED = 'red'
};

export enum TYPE_GENDER {
    MALE = 'Nam',
    FEMALE = 'Nữ'
};

export enum TYPE_GENDER_ENGLISH {
    MALE = 'male',
    FEMALE = 'female'
};

export enum TYPE_SERVICE_INFO {
    LOAN = 'vay',
    GRAND_OPENING = 'khai trương',
    VP_BANK = 'vpbank'
};

export enum TYPE_RESIZE {
    COVER = 'cover',
    CONTAINER = 'container',
    STRETCH = 'stretch',
    CENTER = 'center',
    REPEAT = 'repeat'
};

export enum TYPE_STATUS_STAFF {
    ACTIVE = 'active',
    DEACTIVATE = 'deactivate'
}

export const FilterLoanList = [
    {
        id: 1,
        text: 'Đang xử lý'
    },
    {
        id: 2,
        text: 'Thành công'
    },
    {
        id: 3,
        text: 'Thất bại'
    }
] as ItemPropsModel[];

export enum CITY_DEFAULT {
    HA_NOI = '01',
    TP_HCM = '79'
}


