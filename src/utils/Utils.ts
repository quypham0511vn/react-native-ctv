import messaging from '@react-native-firebase/messaging';
import { Linking, Platform, Share } from 'react-native';
import AndroidOpenSettings from 'react-native-android-open-settings';
import PushNotification from 'react-native-push-notification';

import { isIOS } from '@/commons/Configs';
import { TYPE_GENDER, TYPE_GENDER_ENGLISH } from '../commons/constants';
import Languages from '@/commons/Languages';
import Validate from './Validate';

function formatFloatNumber(num: string, decimal?: number) {
    return Number(num || 0)
        .toFixed(decimal || 0)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

function formatTextToNumber(textNumber: string) {
    const num = (`${textNumber}`).replace(/[^0-9]/g, '');
    return num;
}

function callNumber(phone: string) {
    const phoneNumber = isIOS ? `telprompt:${phone}` : `tel:${phone}`;
    Linking.canOpenURL(phoneNumber).then((supported) => {
        if (supported) {
            Linking.openURL(phoneNumber);
        } else {
            console.log('Don\'t know how to go');
        }
    }).catch((err) => console.error('An error occurred', err));
};

function share(text: string) {
    if (Validate.isStringEmpty(text)) {
        return;
    }
    try {
        Share.share({
            message: text
        });
    } catch (error) {
        console.log(error);
    }
}

function openURL(url: string) {
    if (Platform.OS === 'ios') {
        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    console.error(`Unsupported url: ${url}`);
                } else {
                    Linking.openURL(url);
                }
            })
            .catch((err) => {
                console.error('An error occurred', err);
            });
    }
    else {
        Linking.openURL(url);
    }
};

function capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function isInvalidMoney(number?: number) {
    if (Number.isNaN(number) || Number(number) < 0) {
        return true;
    }
    return false;
}

function formatMoney(number: string | number | undefined) {
    if (!number) {
        return '0 đ';
    }
    return (
        `${Math.ceil(Number(number))
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ`
    );
}

function formatLoanMoney(number: string) {
    if (!number) {
        return '';
    }
    return (
        `${parseInt(number.replace(/\./g, ''), 10)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
    );
}
function getFileNameByPath(file: any) {
    return (
        `${Math.floor(Math.random() * Math.floor(999999999))}.jpg`
    );
}
function openSetting() {
    const app = 'app-settings:';
    if (Platform.OS === 'ios') {
        Linking.canOpenURL(app)
            .then((supported) => {
                if (supported && Platform.OS === 'ios') {
                    Linking.openURL(app);
                }
            })
            .catch((err) => console.error('An error occurred', err));
    } else {
        AndroidOpenSettings.generalSettings();
    }
}

function convertNameImageAccuracies(name: string) {
    let nameConverted;
    switch (name) {
        case 'identify':
            nameConverted = Languages.document.identify;
            break;
        case 'household':
            nameConverted = Languages.document.household;
            break;
        case 'driver_license':
            nameConverted = Languages.document.driverLicense;
            break;
        case 'vehicle':
            nameConverted = Languages.document.vehicle;
            break;
        case 'agree':
            nameConverted = Languages.document.agree;
            break;
        case 'expertise':
            nameConverted = Languages.document.expertise;
            break;
        case 'extension':
            nameConverted = Languages.document.expertise;
            break;
        default:
            break;
    }
    return nameConverted;
}

function checkMomoIsAvailable(callback: any) {
    // AppInstalledChecker.checkURLScheme('momo').then((isInstalled: boolean) => {
    //     callback(isInstalled);
    // });
}
async function getFcmToken() {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
        return fcmToken;
    }
    return null;
}

async function requestUserPermissionNotify() {
    const authStatus = await messaging().requestPermission({
        alert: false
    });
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
    }
};
const createChannel = () => {
    PushNotification.createChannel(
        {
            channelId: 'notify', // (required)
            channelName: 'TienNgay.vn', // (required)
            channelDescription: 'A channel to categories your notifications' // (optional) default: undefined.
        },
        (created: any) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
};

async function configNotification(onNotification: () => void) {
    requestUserPermissionNotify();
    createChannel();

    PushNotification.configure({
        async onNotification(notification: any) {
            if (notification.channelId) {
                onNotification();
            }
        },

        onAction(notification: any) {
            console.log('ACTION:', notification.action);
            console.log('NOTIFICATION:', notification);
        },
        onRegistrationError(err: any) {
            console.error(err.message, err);
        },
        permissions: {
            alert: true,
            badge: true,
            sound: true
        },
        popInitialNotification: true,
        requestPermissions: true
    });
}

function convertSecondToMinutes(value: number) {
    return `${Math.floor(value / 60)}:${value % 60 ? value % 60 : '00'}`;
}

function convertGender(genderEnglish?: string) {
    switch (genderEnglish) {
        case TYPE_GENDER_ENGLISH.MALE:
            return TYPE_GENDER.MALE;
        case TYPE_GENDER_ENGLISH.FEMALE:
            return TYPE_GENDER.FEMALE;
        default:
            return '';
    }
}

export default {
    callNumber,
    share,
    openURL,
    formatFloatNumber,
    formatTextToNumber,
    capitalizeFirstLetter,
    formatMoney,
    getFileNameByPath,
    convertNameImageAccuracies,
    formatLoanMoney,
    checkMomoIsAvailable,
    openSetting,
    isInvalidMoney,
    getFcmToken,
    requestUserPermissionNotify,
    configNotification,
    convertSecondToMinutes,
    convertGender
};
