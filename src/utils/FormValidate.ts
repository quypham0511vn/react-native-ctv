// import { CommonServices } from '@/api';
import Languages from '@/commons/Languages';
import Utils from './Utils';
import Validate from './Validate';

const validateEmoji = (username: string) => /!(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/.test(
    username
);
const validateSpecialCharacters = (username: string) => {
    const reg = /^[a-zA-Z- ]+$/;
    return reg.test(removeAscent(username));
};
const validateNumber = (username: string) => {
    const reg = /^([^0-9]*)$/;
    return reg.test(username);
};
const validatePhone = (username: string) => {
    const reg = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    return reg.test(username);
};
const validateEmail = (email: string) => email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/);
function removeAscent(str: string) {
    if (str === null || str === undefined) return str;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    return str;
}

function userNameValidate(userName: string, checkEmpty?: boolean) {
    let errMsg = '';
    if (Validate.isStringEmpty(userName)) {
        if (!checkEmpty) {
            errMsg = Languages.errorMsg.userNameRequired;
        } else {
            errMsg = '';
        }
    } else if (userName.length < 6) {
        errMsg = Languages.errorMsg.userNameLength;
    } else if (!validateEmoji(userName) && !validateNumber(userName)) {
        errMsg = Languages.errorMsg.userNameRegex;
    } else if (!validateSpecialCharacters(userName)) {
        errMsg = Languages.errorMsg.userNameRegex;
    }
    return errMsg;
}

function emailValidate(email: string, checkEmpty?: boolean) {
    let errMsg = '';
    if (Validate.isStringEmpty(email)) {
        if (!checkEmpty) {
            errMsg = Languages.errorMsg.emailNull;
        } else {
            errMsg = '';
        }
    } else if (!validateEmail(email)) {
        errMsg = Languages.errorMsg.emailRegex;
    }
    return errMsg;
}
function cardValidate(card: string) {
    let errMsg = '';
    if (Validate.isStringEmpty(card)) {
        errMsg = Languages.errorMsg.cardNull;
    } else if (Number(card.length) !== 9 && card.length !== 12) {
        errMsg = Languages.errorMsg.cardCheck;
    } else if (validateNumber(card)) {
        errMsg = Languages.errorMsg.cardRegex;
    }
    return errMsg;
}

function passValidate(pwd: string) {
    let errMsg = '';
    if (Validate.isStringEmpty(pwd)) {
        errMsg = Languages.errorMsg.pwdNull;
    } else if (pwd.length < 6 || pwd.length > 16) {
        errMsg = Languages.errorMsg.pwdCheck;
    }
    return errMsg;
}
function passConFirmValidate(pwd: string, conFirmPwd: string) {
    let errMsg = '';
    if (Validate.isStringEmpty(conFirmPwd)) {
        errMsg = Languages.errorMsg.pwdNull;
    } else if (pwd !== conFirmPwd) {
        errMsg = Languages.errorMsg.conFirmPwd;
    }
    return errMsg;
}
function passConFirmPhonePresenter(phone: string) {
    let errMsg = '';
    if (!validatePhone(phone) && phone) {
        errMsg = Languages.errorMsg.phoneRegex;
    } else if ((phone.length < 10 || phone.length > 10) && phone !== '') {
        errMsg = Languages.errorMsg.phoneCount;
    }
    return errMsg;
}

function passConFirmPhone(phone: string) {
    let errMsg = '';
    if (Validate.isStringEmpty(phone)) {
        errMsg = Languages.errorMsg.phoneIsEmpty;
    } else if (!validatePhone(phone)) {
        errMsg = Languages.errorMsg.phoneRegex;
    } else if (phone.length < 10 || phone.length > 10) {
        errMsg = Languages.errorMsg.phoneCount;
    }
    return errMsg;
}

function passConFirmKeyRefer(keyRefer: string) {
    let errMsg = '';
    if (!validatePhone(keyRefer)) {
        errMsg = Languages.errorMsg.keyReferRegex;
    } else if (keyRefer.length < 10 || keyRefer.length > 10) {
        errMsg = Languages.errorMsg.keyReferCount;
    }
    return errMsg;
}
function birthdayValidator(value: string) {
    let errMsg = '';
    const regexVar = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/; // add anchors; use literal
    const regexVarTest = regexVar.test(value); // pass the string, not the Date
    const userBirthDate = new Date(value.replace(regexVar, '$3-$2-$1')); // Use YYYY-MM-DD format
    const todayYear = new Date().getFullYear(); // Always use FullYear!!
    const cutOff19 = new Date(); // should be a Date
    cutOff19.setFullYear(todayYear - 18); // ...
    const cutOff95 = new Date();
    cutOff95.setFullYear(todayYear - 95);
    if (Validate.isStringEmpty(value)) {
        errMsg = Languages.errorMsg.birthdayEmpty;
    } else if (!regexVarTest) {
        // Test this before the other tests
        errMsg = Languages.errorMsg.birthdayNotNumber;
    } else if (userBirthDate > cutOff19) {
        errMsg = Languages.errorMsg.birthdayAge18;
    } else if (userBirthDate < cutOff95) {
        errMsg = Languages.errorMsg.birthdayAge95;
    } else {
        errMsg = '';
    }
    return errMsg;
}
function validateMoneyLoan(value: string, money: number) {
    let err = '';
    const temp = Utils.formatTextToNumber(value) || 0;
    if (parseInt(temp.toString(), 10) === 0) {
        err = Languages.errorMsg.notEqualZero;
    }
    if (Validate.isStringEmpty(value)) {
        err = Languages.errorMsg.loanMoneyEmpty;
    }
    if (temp > money) {
        err = Languages.errorMsg.loanMoneyNotValid;
    }
    return err;
}
function inputNameEmpty(value: any, errEmpty: string) {
    let errMsg = '';
    if (Validate.isStringEmpty(value)) {
        errMsg = errEmpty;
    }
    return errMsg;
}
function validateCustomCode(value: string) {
    let error = '';
    if (Validate.isStringEmpty(value)) {
        error = Languages.errorMsg.customerCodeEmpty;
    }
    return error;
}

export default {
    userNameValidate,
    emailValidate,
    cardValidate,
    passValidate,
    passConFirmValidate,
    passConFirmPhone,
    birthdayValidator,
    validateMoneyLoan,
    validateCustomCode,
    inputNameEmpty,
    passConFirmKeyRefer,
    passConFirmPhonePresenter
};
