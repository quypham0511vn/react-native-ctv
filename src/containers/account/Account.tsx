import PasscodeAuth from '@el173/react-native-passcode-auth';
import { BottomSheetModal, useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Dash from 'react-native-dash';
import { AirbnbRating } from 'react-native-ratings';
import TouchID from 'react-native-touch-id';

import { CONTACT, LINKS, STORE_APP_LINK } from '@/api/constants';
import FaceIdActive from '@/assets/images/ic_faceid_big.svg';
import IcChangePass from '@/assets/images/ic_green_change_pass.svg';
import IcHotLine from '@/assets/images/ic_green_hot_line.svg';
import IcShare from '@/assets/images/ic_green_invite_friend.svg';
import IcManage from '@/assets/images/ic_green_manage.svg';
import IcPaymentMethod from '@/assets/images/ic_green_payment_method.svg';
import IcPolicy from '@/assets/images/ic_green_policy.svg';
import IcTienNgayWeb from '@/assets/images/ic_green_tien_ngay_web.svg';
import IcTienNgayFaceBook from '@/assets/images/ic_tien_ngay_face_book.svg';
import Warning from '@/assets/images/ic_warning.svg';
import Fingerprint from '@/assets/images/user/fingerprint.svg';
import RightArrows from '@/assets/images/user/right-arrow.svg';
import IcPerson from '@/assets/images/ic_green_person.svg';
import Woman from '@/assets/images/user/woman.svg';
import { BOTTOM_HEIGHT, Configs, isIOS } from '@/commons/Configs';
import { ENUM_BIOMETRIC_TYPE, ERROR_BIOMETRIC, ITEM_CALL_PHONE, messageError, STATE_AUTH_ACC, StorageKeys, TYPE_FORM_ACCOUNT, TYPE_TYPE_ACCOUNT } from '@/commons/constants';
import Languages from '@/commons/Languages';
import ScreenNames, { TabNames } from '@/commons/ScreenNames';
import { Button, HeaderBar } from '@/components';
import BackgroundTienNgay from '@/components/BackgroundTienNgay';
import { CustomBackdropBottomSheet } from '@/components/CustomBottomSheet';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { Touchable } from '@/components/elements/touchable/index';
import { MyImageView } from '@/components/image';
import KeyToggleValue from '@/components/KeyToggleSwitch';
import { PinCode, PinCodeT } from '@/components/pinCode';
import PopupConfirmBiometry from '@/components/PopupConfirmBiometry';
import PopupErrorBiometry from '@/components/PopupErrorBiometry';
import PopupRate from '@/components/PopupRate';
import PopupVerifyRequest from '@/components/PopupVerifyRequest';
import { useAppStore } from '@/hooks';
import SessionManager from '@/managers/SessionManager';
import { PopupActionTypes } from '@/models/typesPopup';
import { UserInfoModel } from '@/models/user-model';
import Navigator from '@/routers/Navigator';
import { COLORS, IconSize, Styles } from '@/theme';
import AnalyticsUtils from '@/utils/AnalyticsUtils';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/ScreenUtils';
import StorageUtils from '@/utils/StorageUtils';
import ToastUtils from '@/utils/ToastUtils';
import Utils from '@/utils/Utils';

const customTexts = {
    set: Languages.setPassCode
};
const configTouchId = {
    unifiedErrors: false,
    passcodeFallback: false
};

const Account = observer(() => {
    const customStyles = MyStylesPinCodeProfile();
    const animationConfigs = useBottomSheetTimingConfigs({ duration: 800 });

    const { apiServices, userManager, fastAuthInfoManager } = useAppStore();
    const { supportedBiometry } = fastAuthInfoManager;

    const [userInfo, setUserInfo] = useState<UserInfoModel | undefined>(SessionManager.userInfo);

    const [ratingPoint, setRating] = useState<number>(SessionManager.getRatingPoint());
    const [ratingPointPopup, setRatingPointPopup] = useState<number>(0);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isEnabledSwitch, setIsEnabledSwitch] = useState<boolean>(SessionManager?.isEnableFastAuthentication || false);

    const popupAlert = useRef<PopupActionTypes>(null);
    const popupRateRef = useRef<PopupActionTypes>(null);
    const popupDeleteAccountRef = useRef<PopupActionTypes>(null);
    const popupError = useRef<PopupActionTypes>(null);
    const popupConfirm = useRef<PopupActionTypes>(null);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const isFocused = useIsFocused();

    useEffect(() => {
        AnalyticsUtils.trackEvent(ScreenNames.account);
    }, []);

    useEffect(() => {
        if (isFocused && userInfo) {
            fetchUserInfo();
            setRating(SessionManager.getRatingPoint());
        }
    }, [isFocused]);

    useEffect(() => {
        if (!userManager?.userInfo) {
            Navigator.navigateScreen(ScreenNames.auth);
        }
    }, [userManager?.userInfo, isFocused]);

    const fetchUserInfo = useCallback(async () => {
        const res = await apiServices.auth.getUserInfo();
        if (res?.success) {
            const dataUser = res.data as UserInfoModel;
            SessionManager.setUserInfo({ ...userInfo, ...dataUser } as UserInfoModel);
            setUserInfo({ ...userManager.userInfo, ...dataUser });
        }
    }, [apiServices.auth, userInfo, userManager.userInfo]);

    const callPhone = useCallback(() => {
        Utils.callNumber(CONTACT.PHONE);
    }, []);

    const identityAuthNavigate = useCallback(() => { Navigator.navigateScreen(ScreenNames.identityAuthn); }, []);

    const renderAccuracy = useCallback((_onPress: () => void) => {
        switch (userInfo?.status_verified) {
            case STATE_AUTH_ACC.VERIFIED:
                return (
                    <Touchable style={styles.accuracyWrap} onPress={_onPress}>
                        <Text style={styles.txtAccuracy}>{Languages.itemInForAccount.accVerified}</Text>
                    </Touchable>
                );
            case STATE_AUTH_ACC.UN_VERIFIED:
                return (
                    <Touchable style={styles.notAccuracyWrap} onPress={_onPress}>
                        <Text style={styles.txtNotAccuracy}>{Languages.itemInForAccount.accuracyNow}</Text>
                    </Touchable>
                );
            case STATE_AUTH_ACC.WAIT:
                return (
                    <Touchable style={styles.waitAccuracyWrap} onPress={_onPress}>
                        <Text style={styles.txtWaitAccuracy}>{Languages.itemInForAccount.waitVerify}</Text>
                    </Touchable>
                );
            case STATE_AUTH_ACC.RE_VERIFIED:
                return (
                    <Touchable style={styles.notAccuracyWrap} onPress={_onPress}>
                        <Text style={styles.txtNotAccuracy}>{Languages.itemInForAccount.reAccuracy}</Text>
                    </Touchable>
                );
            default:
                return (
                    <Touchable style={styles.notAccuracyWrap} onPress={_onPress}>
                        <Text style={styles.txtNotAccuracy}>{Languages.itemInForAccount.accuracyNow}</Text>
                    </Touchable>
                );
        }
    }, [userInfo?.status_verified]);

    const renderNavigateChildScreen = useCallback((_title: string, _image: any, hasDashBottom?: boolean) => {
        const onNavigateScreen = () => {
            switch (_title) {
                case Languages.itemInForAccount.inFor:
                    Navigator.navigateScreen(ScreenNames.profile);
                    break;
                case Languages.itemInForAccount.termSandCondition:
                    Navigator.pushScreen(ScreenNames.myWebview, {
                        title_vi: Languages.itemInForAccount.termSandCondition,
                        content_vi: LINKS.POLICY,
                        uri: true
                    });
                    break;
                case Languages.itemInForAccount.manage:
                    if (userManager.userInfo?.form === TYPE_FORM_ACCOUNT.GROUP && userManager.userInfo?.account_type === TYPE_TYPE_ACCOUNT.GROUP) Navigator.navigateScreen(ScreenNames.groupManager);
                    break;
                case Languages.itemInForAccount.paymentMethod:
                    Navigator.navigateScreen(ScreenNames.bankAccount);
                    break;
                case Languages.itemInForAccount.changePwd:
                    Navigator.navigateScreen(ScreenNames.changePassword);
                    break;
                case Languages.itemInForAccount.quicklyAuthn:
                    Navigator.navigateScreen(ScreenNames.SettingQuickAuth);
                    break;
                case Languages.itemInForAccount.introCollaborator:
                    Navigator.navigateScreen(ScreenNames.introCollaborator);
                    break;
                case Languages.itemInForAccount.web:
                    Utils.openURL(LINKS.LINK_TIENNGAY_WEB);
                    break;
                case Languages.itemInForAccount.facebook:
                    Utils.openURL(LINKS.LINK_TIENNGAY_FACEBOOK);
                    break;
                case ITEM_CALL_PHONE:
                    callPhone();
                    break;
                default:
                    break;
            }
        };
        return (
            <View style={styles.containerNavigateScreen}>
                <Touchable style={styles.row} onPress={onNavigateScreen}>
                    <View style={styles.leftIconScreen}>{_image}</View>
                    <View style={styles.rowCenter}>
                        <Text style={styles.leftText}>{_title}</Text>
                        <RightArrows {...IconSize.size8_8} />
                    </View>
                </Touchable>
                {!hasDashBottom && <Dash dashThickness={1} dashLength={10} dashGap={4} dashColor={COLORS.GRAY_14} style={styles.dash} />}
            </View>
        );
    }, [callPhone, userManager.userInfo?.form]);

    const onToggleBiometry = useCallback(
        (value: any) => {
            if (value)
                TouchID.isSupported(configTouchId)
                    .then(() => {
                        popupConfirm.current?.show();
                    })
                    .catch((error) => {
                        console.log(error);
                        let message;
                        if (isIOS) {
                            if (supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID) {
                                message = messageError(ERROR_BIOMETRIC.ErrorFaceId);
                            }
                            if (
                                supportedBiometry === ENUM_BIOMETRIC_TYPE.TOUCH_ID &&
                                !message
                            ) {
                                message = messageError(ERROR_BIOMETRIC.LAErrorTouchIDLockout);
                            } else {
                                message = messageError(ERROR_BIOMETRIC.NOT_ENROLLED);
                            }
                        } else {
                            message = messageError(error.code);
                        }
                        popupError.current?.show();
                    });
            else {
                StorageUtils.clearDataOfKey(StorageKeys.KEY_ENABLE_FAST_AUTHENTICATION);
                setIsEnabledSwitch(false);
            }
        },
        [supportedBiometry]
    );

    const renderToggle = useCallback((_label: string, _leftIcon: any) => (
        <KeyToggleValue label={_label} isEnabledSwitch={isEnabledSwitch} onToggleSwitch={onToggleBiometry} hasDash leftIcon={_leftIcon} />
    ), [isEnabledSwitch, onToggleBiometry]);

    const renderAuthnFinger = useMemo(() => {
        if (supportedBiometry === ENUM_BIOMETRIC_TYPE.TOUCH_ID) {
            return renderToggle(Languages.biometry.loginWithFinger, <Fingerprint />);
        }
        if (supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID) {
            return renderToggle(Languages.biometry.loginWithFaceId, <FaceIdActive width={15} height={15} />);
        }
        return null;
    }, [renderToggle, supportedBiometry]);

    const logOut = useCallback(() => { popupAlert.current?.show(); }, []);

    const onLogOutSuccess = useCallback(() => {
        popupAlert.current?.hide?.();
        SessionManager.logout();
        fastAuthInfoManager.setEnableFastAuthentication(false);
        userManager.updateUserInfo(undefined);
    }, [fastAuthInfoManager, userManager]);

    const onShowRatingPopup = useCallback(() => { popupRateRef.current?.show(); }, []);

    const openLink = useCallback(() => { Utils.openURL(STORE_APP_LINK); }, []);

    const onAgreeRating = useCallback(async () => {
        setLoading(true);
        if (ratingPointPopup !== 0) {
            setRatingPointPopup(0);
            SessionManager.setRatingPoint(ratingPoint);
            setTimeout(() => {
                popupRateRef.current?.hide();
                setLoading(false);
                // if (ratingPoint > 3) { // chưa có link store app CTV (google play, apple store)
                //     openLink();
                // } else {
                ToastUtils.showSuccessToast(Languages.feedback.sentSuccess);
                // }
            }, 600);
        } else {
            popupRateRef.current?.hide();
            setRatingPointPopup(0);
            ToastUtils.showErrorToast(Languages.feedback.emptyRatingPoint);
        };
    }, [ratingPoint, ratingPointPopup]);

    const renderPopupRating = useMemo(() => {
        const onRating = (_rating?: number) => {
            setRating(_rating || 0);
            setRatingPointPopup(_rating || 0);
        };
        const onCloseModalRating = () => {
            setRating(SessionManager.getRatingPoint());
        };
        return (
            <PopupRate
                ref={popupRateRef}
                onConfirm={onAgreeRating}
                ratingSwipeComplete={onRating}
                loading={isLoading}
                onClose={onCloseModalRating}
            />
        );
    }, [isLoading, onAgreeRating]);

    const renderPopupGrayButton = useCallback((_ref: any, _content: string, _onConfirm: () => void) => (
        <PopupVerifyRequest ref={_ref} icon={<Warning width={50} height={50} />} content={_content} onConfirm={_onConfirm} />
    ), []);

    const onShowOtpDeleteAccount = useCallback(() => {
        popupDeleteAccountRef.current?.hide();
        Navigator.pushScreen(ScreenNames.otpSignUp);
    }, []);

    const onSetPinCodeSuccess = useCallback((pin: string) => {
        bottomSheetModalRef.current?.close?.();
        SessionManager.setEnableFastAuthentication(true);
        StorageUtils.saveDataToKey(StorageKeys.KEY_PIN, pin);
        setIsEnabledSwitch(true);
        const message = supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID ?
            Languages.quickAuThen.successAddFaceId :
            Languages.quickAuThen.successAddTouchId;
        ToastUtils.showMsgToast(message);
    }, [supportedBiometry]);

    const onConfirm = useCallback(() => {
        if (isIOS) {
            popupConfirm?.current?.hide?.();
            PasscodeAuth.authenticate(
                supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID
                    ? Languages.quickAuThen.useFaceID
                    : Languages.quickAuThen.useTouchID
            )
                .then(() => {
                    SessionManager.setEnableFastAuthentication(true);
                    setIsEnabledSwitch(true);
                })
                .catch(() => { });
        } else {
            popupConfirm?.current?.hide?.();
            bottomSheetModalRef.current?.present?.();
        }
    }, [supportedBiometry]);

    const popupUpdatePassCode = useMemo(() => (
        <PopupConfirmBiometry ref={popupConfirm} type={supportedBiometry} onConfirm={onConfirm} />
    ), [onConfirm, supportedBiometry]);

    const renderPopupError = useMemo(() => <PopupErrorBiometry typeSupportBiometry={supportedBiometry} ref={popupError} />, [supportedBiometry]);

    const renderPinCode = useMemo(() => (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={['20%', '82%']}
            keyboardBehavior={'interactive'}
            backdropComponent={CustomBackdropBottomSheet}
            animationConfigs={animationConfigs}
            style={{ backgroundColor: COLORS.TRANSPARENT }}
        >
            <View style={styles.wrapPin}>
                <PinCode
                    mode={PinCodeT.Modes.Set}
                    visible={true}
                    options={{
                        pinLength: 4,
                        maxAttempt: 4,
                        lockDuration: 10000,
                        disableLock: false
                    }}
                    mainStyle={customStyles.main}
                    textOptions={customTexts}
                    titleStyle={customStyles.title}
                    buttonsStyle={customStyles.buttons}
                    subTitleStyle={customStyles.subTitle}
                    buttonTextStyle={customStyles.buttonText}
                    pinContainerStyle={customStyles.pinContainer}
                    onSetSuccess={onSetPinCodeSuccess}
                />
            </View>
        </BottomSheetModal>
    ), [animationConfigs, customStyles.buttonText, customStyles.buttons, customStyles.main, customStyles.pinContainer, customStyles.subTitle, customStyles.title, onSetPinCodeSuccess]);

    const onOpenPopupDeleteAccount = useCallback(() => {
        popupDeleteAccountRef.current?.show();
    }, []);

    const renderGrayButton = useCallback((_label: string, _onPress: () => void) => (
        <Button label={`${_label}`} style={styles.wrapBtn} buttonStyle={BUTTON_STYLES.GRAY} onPress={_onPress} isLowerCase />
    ), []);

    const renderRatingView = useCallback((defaultRating: number) =>
        <Touchable style={styles.feedBack} onPress={onShowRatingPopup} disabled={SessionManager.getRatingPoint() >= 4}>
            <View style={styles.starLeft}>
                <Text style={styles.textTitleFeed}>{Languages.feedback.title}</Text>
                <Text style={styles.textTitleDescriptionFeed}>{Languages.feedback.description}</Text>
                <AirbnbRating count={5} defaultRating={defaultRating || 0} size={20} showRating={false} isDisabled={false} ratingContainerStyle={styles.wrapStar} />
            </View>
            <Woman />
        </Touchable>, [onShowRatingPopup]);

    return (
        <BackgroundTienNgay style={styles.allContentContainer}>
            <View style={styles.container}>
                <HeaderBar title={Languages.tabs.account} isLowerCase noBack />

                <View style={styles.inF}>
                    <MyImageView style={styles.imageAvatar} imageUrl={userInfo?.avatar} />
                    <View style={styles.textInfo}>
                        <Text style={styles.textName}>{userInfo?.ctv_name}</Text>
                        <Text style={styles.textPhone}>{userInfo?.ctv_phone}</Text>
                        {renderAccuracy(identityAuthNavigate)}
                    </View>
                    <RightArrows style={styles.arrowTopContainer} {...{ width: 10, height: 10 }} />
                </View>
                <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {renderNavigateChildScreen(Languages.itemInForAccount.inFor, <IcPerson />)}
                    {renderNavigateChildScreen(Languages.itemInForAccount.termSandCondition, <IcPolicy />)}
                    {(userManager.userInfo?.form === TYPE_FORM_ACCOUNT.GROUP && userManager.userInfo?.account_type === TYPE_TYPE_ACCOUNT.GROUP) && renderNavigateChildScreen(Languages.itemInForAccount.manage, <IcManage />)}
                    {renderNavigateChildScreen(Languages.itemInForAccount.paymentMethod, <IcPaymentMethod />)}
                    {renderNavigateChildScreen(Languages.itemInForAccount.changePwd, <IcChangePass />)}
                    {renderAuthnFinger}
                    {renderNavigateChildScreen(Languages.itemInForAccount.introCollaborator, <IcShare />)}
                    {renderNavigateChildScreen(Languages.itemInForAccount.web, <IcTienNgayWeb />)}
                    {renderNavigateChildScreen(Languages.itemInForAccount.facebook, <IcTienNgayFaceBook />)}
                    {renderNavigateChildScreen(ITEM_CALL_PHONE, <IcHotLine />)}
                    {renderRatingView(Number(ratingPoint))}
                    {renderGrayButton(Languages.common.logOut, logOut)}
                    {isIOS && renderGrayButton(Languages.maintain.deleteAccount, onOpenPopupDeleteAccount)}
                    <Text style={styles.version}>{Languages.common.version}</Text>
                </ScrollView>
                {renderPopupRating}
                {renderPopupGrayButton(popupAlert, Languages.errorMsg.logoutMessage, onLogOutSuccess)}
                {renderPopupGrayButton(popupDeleteAccountRef, Languages.maintain.deleteAccountConfirm, onShowOtpDeleteAccount)}
                {popupUpdatePassCode}
                {renderPopupError}
                {renderPinCode}
            </View>
        </BackgroundTienNgay>
    );
});

export default Account;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    allContentContainer: {
        flex: 1
    },
    scrollView: {
        paddingTop: 12,
        paddingBottom: BOTTOM_HEIGHT + 24,
        paddingHorizontal: 16
    },
    inF: {
        ...Styles.shadow,
        padding: 16,
        backgroundColor: COLORS.WHITE,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.GRAY_15,
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 2
    },
    textInfo: {
        flex: 1,
        marginLeft: 16,
        alignSelf: 'flex-start'
    },
    arrowTopContainer: {
        flex: 2,
        paddingRight: 24
    },
    textName: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size14,
        color: COLORS.GREEN_2
    },
    textPhone: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        color: COLORS.GRAY_13,
        paddingVertical: 4
    },
    textVersion: {
        ...Styles.typography.regular,
        textAlign: 'center',
        fontSize: Configs.FontSize.size11,
        color: COLORS.GRAY_1,
        marginTop: 10,
        marginLeft: 10
    },
    feedBack: {
        ...Styles.shadow,
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        marginTop: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.GRAY_15
    },
    starLeft: {
        flex: 2
    },
    textTitleFeed: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        marginBottom: 5
    },
    textTitleDescriptionFeed: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        color: COLORS.DARK_GRAY
    },
    imageAvatar: {
        width: 60,
        height: 60,
        borderRadius: 40,
        borderColor: COLORS.GREEN_2,
        borderWidth: 2
    },
    modalWrap: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40,
        backgroundColor: COLORS.WHITE,
        borderRadius: 10
    },
    wrapPin: {
        flex: 1
    },
    wrapStar: {
        marginTop: 12,
        alignSelf: 'flex-start'
    },
    titleRate: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        color: COLORS.DARK_GRAY
    },
    contentRateTitle: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size13,
        color: COLORS.DARK_GRAY
    },
    wrapContentRate: {
        width: '100%',
        height: SCREEN_HEIGHT / 7,
        justifyContent: 'space-between',
        marginBottom: 40
    },
    input: {
        borderColor: COLORS.GRAY_10,
        fontSize: Configs.FontSize.size14,
        borderRadius: 10,
        height: SCREEN_HEIGHT / 7,
        marginVertical: 5
    },
    rate: {
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 20
    },
    containerRate: {
        flexDirection: 'column-reverse',
        alignItems: 'center',
        width: SCREEN_WIDTH * 0.8,
        marginTop: 7
    },
    reviewTitle: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        color: COLORS.DARK_GRAY
    },
    wrapBtn: {
        marginTop: 24,
        width: '100%'
    },
    containerNavigateScreen: {
        backgroundColor: COLORS.WHITE,
        flex: 1
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12
    },
    leftIconScreen: {
        flex: 0.1,
        alignItems: 'flex-start'
    },
    rowCenter: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingLeft: 14
    },
    leftText: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_7
    },
    dash: {
        paddingVertical: 1
    },
    notAccuracyWrap: {
        borderRadius: 16,
        backgroundColor: COLORS.PINK_1,
        width: '90%'
    },
    waitAccuracyWrap: {
        borderRadius: 16,
        backgroundColor: COLORS.YELLOW_5,
        width: '90%'
    },
    accuracyWrap: {
        borderRadius: 16,
        backgroundColor: COLORS.GREEN_4,
        width: '90%'
    },
    txtNotAccuracy: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        paddingVertical: 5,
        color: COLORS.RED_2,
        alignSelf: 'center'
    },
    txtWaitAccuracy: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        paddingVertical: 5,
        color: COLORS.YELLOW_3,
        alignSelf: 'center'
    },
    txtAccuracy: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        paddingVertical: 5,
        color: COLORS.GREEN_2,
        alignSelf: 'center'
    },
    version: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_9,
        textAlign: 'right',
        fontSize: Configs.FontSize.size10,
        marginTop: 10,
        marginBottom: 5
    }
});

export const MyStylesPinCodeProfile = () => useMemo(() => StyleSheet.create({
    main: {
        marginTop: 20,
        paddingHorizontal: 20,
        backgroundColor: COLORS.TRANSPARENT
    },
    title: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size16,
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.GREEN
    },
    subTitle: {
        color: COLORS.BLACK
    },
    buttonText: {
        ...Styles.typography.regular,
        color: COLORS.GREEN,
        fontSize: Configs.FontSize.size32,
        fontFamily: Configs.FontFamily.medium
    },
    buttons: {
        backgroundColor: COLORS.WHITE,
        borderWidth: 1.5,
        marginHorizontal: 15,
        borderColor: COLORS.GREEN,
        width: 65,
        height: 65,
        borderRadius: 35
    },
    pinContainer: {
        height: 30,
        justifyContent: 'center',
        marginBottom: 10
    }
}), []);
