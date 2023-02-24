import { ViewStyle } from 'react-native';

export enum TypeKeyBoard {
    DEFAULT = 'default',
    NUMBER = 'number-pad',
    NUMERIC = 'numeric',
    // number with dot
    DECIMAL = 'decimal-pad',
    EMAIL = 'email-address',
    PHONE = 'phone-pad'
}

export enum TypeCapitalized {
    NONE = 'none',
    WORDS = 'words',
    CHARACTERS = 'characters',
    SENTENCES = 'sentences',
}

export type TextFieldProps = {
    keyboardType?: keyof typeof TypeKeyBoard,
    label?: string;
    value?: string | number;
    placeHolder?: string;
    isPassword?: boolean;
    rightIcon?: any;
    disabled?: boolean;
    hasUnderline?: boolean;
    multiline?: boolean;
    maxLength?: number;
    formatPrice?: boolean;
    formatNumber?: boolean;
    formatEmail?: boolean;
    verified?: boolean;
    showRestriction?: boolean;
    priceSuffix?: string;
    placeHolderColor?:string;
    // true:  unit  vndong: 'VNĐ', false: unit dong: 'đ',
    backgroundColor?: any;
    leftIcon?: string;
    iconSize?: number;
    inputStyle?: any;
    inputStylePwDIcon?:ViewStyle,
    containerInput?:ViewStyle;
    hideIconClear?: boolean;
    minHeight?: number | string;
    maxHeight?: number | string;
    testID?: string;
    autoFocus?:boolean;
    onKeyPress?: (text: any, tag?: any) => any
    onChangeText?: (text: string, tag?: string) => any;
    onEndEditing?: (text: string, tag?: string) => any;
    onClickRightIcon?: () => void;
    onFocusCallback?: (tag?: string) => any;
    defaultValue?:string;
    labelStyle?: any;
    optional?: boolean;
    wrapErrText?: ViewStyle;
    customerRightIcon?: any;
    autoCapitalized?: any;// keyof typeof TypeCapitalized ;
    stylesContainer?: ViewStyle,
    refArr?: Array<any>;
    orderRef?: number | undefined;
    inputAccessoryViewID?: string;
    textContentType?: | 'none'
    | 'URL'
    | 'addressCity'
    | 'addressCityAndState'
    | 'addressState'
    | 'countryName'
    | 'creditCardNumber'
    | 'emailAddress'
    | 'familyName'
    | 'fullStreetAddress'
    | 'givenName'
    | 'jobTitle'
    | 'location'
    | 'middleName'
    | 'name'
    | 'namePrefix'
    | 'nameSuffix'
    | 'nickname'
    | 'organizationName'
    | 'postalCode'
    | 'streetAddressLine1'
    | 'streetAddressLine2'
    | 'sublocality'
    | 'telephoneNumber'
    | 'username'
    | 'password'
    | 'newPassword'
    | 'oneTimeCode'
    | undefined;
}

export type TextFieldActions = {
    setValue: (text: string | number) => void;
    fillValue: (text: string | number) => void;
    getValue: () => string;
    focus: () => void;
    blur: () => void;
    setErrorMsg: (msg?: string) => void;
};

