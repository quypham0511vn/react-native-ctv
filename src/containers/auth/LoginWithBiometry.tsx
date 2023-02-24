import PasscodeAuth from '@el173/react-native-passcode-auth';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react';
import React, {
    useCallback, useEffect, useMemo,
    useRef,
    useState
} from 'react';
import {
    Platform, StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import TouchID from 'react-native-touch-id';

import { ICONS } from '@/assets/icons/constant';
import CloseIcon from '@/assets/images/ic_close.svg';
import IcArrow from '@/assets/images/ic_left_arrow_other_login.svg';
import FaceIdIcon from '@/assets/images/ic_faceid_big.svg';
import FingerprintIcon from '@/assets/images/ic_fingerprint.svg';
import { Configs, PADDING_TOP } from '@/commons/Configs';
import { ERROR_BIOMETRIC, StorageKeys } from '@/commons/constants';
import Languages from '@/commons/Languages';
import ScreenNames, { TabNamesArray } from '@/commons/ScreenNames';
import { Button, Touchable } from '@/components';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import FooterItem from '@/components/FooterItem';
import { MyImageView } from '@/components/image';
import { PinCode, PinCodeT } from '@/components/pinCode';
import PopupAlertFinger from '@/components/PopupAlertFinger';
import {
    ENUM_BIOMETRIC_TYPE
} from '@/components/popupFingerprint/types';
import { useAppStore } from '@/hooks';
import SessionManager from '@/managers/SessionManager';
import { PopupActionTypes } from '@/models/typesPopup';
import { UserInfoModel } from '@/models/user-model';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import FormValidate from '@/utils/FormValidate';
import StorageUtils from '@/utils/StorageUtils';
import MyLoading from '@/components/MyLoading';
import ToastUtils from '@/utils/ToastUtils';
import BackgroundTienNgay from '@/components/BackgroundTienNgay';
import ScrollViewWithKeyboard from '@/components/KeyboardAwareView';
import HideKeyboard from '@/components/HideKeyboard';

const customTexts = {
    set: Languages.setPassCode
};

const LoginWithBiometry = observer(({ navigation }: any) => {
    console.log('tab', SessionManager.lastTabIndexBeforeOpenAuthTab);
    const popupAlert = useRef<PopupActionTypes>(null);
    const [password, setPassword] = useState<string>('');
    const [errorText, setErrorText] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);

    const { fastAuthInfoManager: fastAuthInfo } = useAppStore();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { apiServices, userManager } = useAppStore();
    const [userInfo, setUserInfo] = useState<UserInfoModel | undefined>(userManager.userInfo);
    const refPass = useRef<TextFieldActions>(null);

    useEffect(() => {
        setUserInfo(userManager.userInfo);
        if (!userManager?.userInfo) {
            Navigator.navigateScreen(ScreenNames.auth);
        }
    }, [userManager?.userInfo]);

    const popupError = useMemo(() => <PopupAlertFinger title={errorText} ref={popupAlert} />, [errorText, popupAlert]);

    const onChangeText = useCallback((text: string) => {
        setPassword(text);
    }, []);

    const onLoginSuccess = useCallback(() => {
        fastAuthInfo.setEnableFastAuthentication(false);
        SessionManager.setSaveIsLogout(false);
        setTimeout(() => {
            if (SessionManager.lastTabIndexBeforeOpenAuthTab) {
                Navigator.navigateToDeepScreen([ScreenNames.tabs], TabNamesArray[SessionManager.lastTabIndexBeforeOpenAuthTab]);
            }
        }, 100);
    }, [fastAuthInfo]);

    const auth = useCallback(() => {
        if (Platform.OS === 'android') {
            TouchID.authenticate(Languages.quickAuThen.description, {
                title: Languages.biometry.useFingerprint,
                imageColor: COLORS.RED,
                imageErrorColor: COLORS.RED,
                sensorDescription: Languages.biometry.useFingerPrintError,
                sensorErrorDescription: Languages.biometry.useFingerPrintManyTimesError,
                cancelText: Languages.common.close,
                cancelTextManyTime: Languages.common.agree,
                passcodeFallback: true
            }).then((data: any) => {
                onLoginSuccess();
            })
                .catch((error: any) => {
                    if (error.code === ERROR_BIOMETRIC.NOT_ENROLLED) {
                        ToastUtils.showErrorToast(Languages.errorBiometryType.NOT_ENROLLED);
                    } else if (error.code === ERROR_BIOMETRIC.FINGERPRINT_ERROR_LOCKOUT || error.code === ERROR_BIOMETRIC.FINGERPRINT_ERROR_LOCKOUT_PERMANENT) {
                        bottomSheetModalRef.current?.present?.();
                    }
                });
        } else {
            PasscodeAuth.authenticate(Languages.quickAuThen.description)
                .then(() => {
                    onLoginSuccess();
                })
                .catch(() => { });
        }
    }, [onLoginSuccess]);

    const touchIdType = useMemo(() => {
        if (fastAuthInfo.supportedBiometry === ENUM_BIOMETRIC_TYPE.TOUCH_ID) {
            return (
                <TouchableOpacity onPress={auth} style={styles.iconFinger}>
                    <FingerprintIcon width={18} height={18} />
                </TouchableOpacity>
            );
        }
        if (fastAuthInfo.supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID) {
            return (
                <TouchableOpacity onPress={auth} style={styles.iconFinger}>
                    <FaceIdIcon width={18} height={18} />
                </TouchableOpacity>
            );
        }

        return null;
    }, [auth, fastAuthInfo.supportedBiometry]);

    const checkPin = useCallback(async (value: any) => {
        const pin = await StorageUtils.getDataByKey(StorageKeys.KEY_PIN);
        if (pin === value) {
            return true;
        }
        return false;
    }, []);

    const CustomBackdrop = (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} pressBehavior="close" />;

    const animationConfigs = useBottomSheetTimingConfigs({
        duration: 800
    });

    const onLoginSuccessWithPIn = useCallback(() => {
        bottomSheetModalRef?.current?.close();
        onLoginSuccess();
    }, [onLoginSuccess]);
    const renderPinCode = useMemo(() => (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={['20%', '82%']}
            keyboardBehavior={'interactive'}
            enablePanDownToClose={true}
            backdropComponent={CustomBackdrop}
            animationConfigs={animationConfigs}
        >
            <View style={styles.wrapPin}>
                <PinCode
                    mode={PinCodeT.Modes.Enter}
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
                    checkPin={checkPin}
                    onEnterSuccess={onLoginSuccessWithPIn}
                />
            </View>
        </BottomSheetModal>
    ), [animationConfigs, checkPin, onLoginSuccessWithPIn]);

    const loginWithPassword = useCallback(async () => {
        const errMsgPwd = FormValidate.passValidate(password);
        refPass.current?.setErrorMsg(errMsgPwd);
        if (userInfo?.ctv_phone && `${errMsgPwd}`.length == 0) {
            setLoading(true);
            const res = await apiServices.auth.loginPhone(userInfo?.ctv_phone, password);
            if (res.success) {
                onLoginSuccess();
                SessionManager.setAccessToken(res?.data?.user?.token_app);
                userManager.updateUserInfo(res?.data?.user as UserInfoModel);
            }
            setLoading(false);
        }
    }, [apiServices.auth, onLoginSuccess, password, userInfo?.ctv_phone]);

    const navigateToOther = useCallback(() => {
        Navigator.navigateScreen(ScreenNames.login);
    }, []);

    const onNavigateForgotPwd = useCallback(() => {
        Navigator.navigateScreen(ScreenNames.forgotPwd);
    }, []);

    const goBack = useCallback(() => {
        Navigator.goBack();
    }, []);

    return (
        <BackgroundTienNgay>
            <HideKeyboard>
                <View style={styles.container}>
                    <Touchable style={styles.closeContainer} onPress={goBack}>
                        <CloseIcon width={15} height={15} />
                    </Touchable>
                    <ScrollViewWithKeyboard>
                        <View style={styles.wrapContent}>
                            <View style={styles.wrapAvatar}>
                                <MyImageView
                                    style={styles.imageAvatar}
                                    imageUrl={userInfo?.avatar} />
                                <Text style={styles.txtHello}>{Languages.authentication.hello}</Text>
                                <Text style={styles.txtName}>{userInfo?.ctv_name}</Text>
                            </View>
                            <View style={styles.wrapInput}>
                                <Text style={styles.textPass}>{Languages.authentication.password}</Text>
                                <View style={styles.test}>
                                    <MyTextInput
                                        ref={refPass}
                                        placeHolder={Languages.authentication.password}
                                        leftIcon={ICONS.LOCK}
                                        value={password}
                                        onChangeText={onChangeText}
                                        inputStyle={styles.input}
                                        isPassword
                                        maxLength={50}
                                    />
                                </View>

                                <View style={styles.wrapUnderTxt}>
                                    <View style={styles.otherLoginContainer}>
                                        <Touchable style={styles.arrowIcContainer} onPress={navigateToOther}>
                                            <IcArrow width={15} height={15} />
                                        </Touchable>
                                        <Text style={styles.greenText} onPress={navigateToOther}>{Languages.authentication.otherLogin}</Text>
                                    </View>
                                    <TouchableOpacity onPress={onNavigateForgotPwd}>
                                        <Text style={styles.redText}>{Languages.authentication.forgotPwd}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.wrapBt}>
                                    <Button onPress={loginWithPassword}
                                        label={Languages.authentication.login}
                                        buttonContainer={styles.buttonLoginContainer}
                                        buttonStyle={BUTTON_STYLES.GREEN} isLowerCase />
                                    {touchIdType}
                                </View>
                            </View>
                        </View>
                        <FooterItem />
                    </ScrollViewWithKeyboard>
                    {popupError}
                    {renderPinCode}
                    {isLoading && <MyLoading isOverview />}
                </View>
            </HideKeyboard>
        </BackgroundTienNgay>
    );
});

export default LoginWithBiometry;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: PADDING_TOP + 20
    },
    wrapContent: {
        flex: 1
    },
    wrapAvatar: {
        alignSelf: 'center',
        alignItems: 'center',
        width: '100%',
        flex: 0.2,
        justifyContent: 'flex-end'
    },
    txtHello: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12,
        paddingTop: 16
    },
    txtName: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size20,
        color: COLORS.GREEN_2
    },
    wrapInput: {
        marginTop: 35,
        flex: 1,
        paddingHorizontal: 16
    },
    textPass: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_17,
        marginBottom: 10
    },
    wrapUnderTxt: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25
    },
    greenText: {
        ...Styles.typography.medium,
        color: COLORS.GREEN_2
    },
    redText: {
        ...Styles.typography.medium,
        color: COLORS.RED_2
    },
    wrapBt: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    iconFinger: {
        borderRadius: 40,
        marginLeft: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.GREEN_2
    },
    test: {
        height: Configs.FontSize.size45,
        justifyContent: 'center'
    },
    input: {
        height: '100%',
        justifyContent: 'center'
    },
    wrapPin: {
        flex: 1
    },
    imageAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: COLORS.WHITE,
        borderWidth: 5,
        alignSelf: 'center'
    },
    buttonLoginContainer: {
        width: '80%'
    },
    closeContainer: {
        alignSelf: 'flex-end',
        paddingRight: 16
    },
    arrowIcContainer: {
        marginRight: 4,
        backgroundColor: COLORS.GREEN_4,
        width: 24,
        height: 24,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    otherLoginContainer: {
        flexDirection: 'row'
    }
});
const customStyles = StyleSheet.create({
    main: {
        marginTop: 20,
        paddingHorizontal: 16
    },

    title: {
        fontSize: Configs.FontSize.size16,
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.GREEN
    },
    subTitle: {
        color: COLORS.BLACK
    },
    buttonText: {
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
});
