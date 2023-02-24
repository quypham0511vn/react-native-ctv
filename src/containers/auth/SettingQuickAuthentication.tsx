import PasscodeAuth from '@el173/react-native-passcode-auth';
import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
    useBottomSheetTimingConfigs
} from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import TouchID from 'react-native-touch-id';

import FaceIdActive from '@/assets/images/ic_faceid.svg';
import FingerprintIconActive from '@/assets/images/ic_fingerprint.svg';
import PenEditIcon from '@/assets/images/ic_pen.svg';
import RightIcon from '@/assets/images/ic_right.svg';
import { Configs, isIOS } from '@/commons/Configs';
import {
    ENUM_BIOMETRIC_TYPE,
    ERROR_BIOMETRIC,
    messageError,
    StorageKeys
} from '@/commons/constants';
import Languages from '@/commons/Languages';
import { HeaderBar, Touchable } from '@/components';
import { PinCode, PinCodeT } from '@/components/pinCode';
import PopupErrorBiometry from '@/components/PopupErrorBiometry';
import PopupConfirm from '@/components/PopupUpdatePasscode';
import { useAppStore } from '@/hooks';
import SessionManager from '@/managers/SessionManager';
import { PopupActionTypes } from '@/models/typesPopup';
import { COLORS } from '@/theme';
import StorageUtils from '@/utils/StorageUtils';
import ToastUtils from '@/utils/ToastUtils';

const configTouchId = {
    unifiedErrors: false,
    passcodeFallback: false
};
const CustomBackdrop = (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} pressBehavior="close" />;
const customTexts = {
    set: Languages.setPassCode
};

const SettingQuickAuth = observer(() => {
    const { fastAuthInfoManager: fastAuthInfo } = useAppStore();
    const { supportedBiometry } = fastAuthInfo;
    const isEnable = SessionManager?.isEnableFastAuthentication;
    const [turnedOn, setTurnedOn] = useState<boolean>(isEnable || false);
    const popupError = useRef<PopupActionTypes>(null);
    const popupUpdate = useRef<PopupActionTypes>(null);
    const [errorText, setErrorText] = useState<string>('');
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const animationConfigs = useBottomSheetTimingConfigs({
        duration: 800
    });

    const renderPopupError = useMemo(() => <PopupErrorBiometry title={errorText} ref={popupError} />, [errorText]);

    const onToggleBiometry = useCallback(
        (value: any) => {
            if (value)
                TouchID.isSupported(configTouchId)
                    .then(() => {
                        popupUpdate.current?.show();
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
                        setErrorText(message || '');
                        popupError.current?.show();
                    });
            else {
                StorageUtils.clearDataOfKey(StorageKeys.KEY_ENABLE_FAST_AUTHENTICATION);
                setTurnedOn(false);
            }
        },
        [supportedBiometry]
    );

    const renderSupportedBiometry = useMemo(() => {
        if (supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID) {
            return (
                <View style={styles.item}>
                    <View style={styles.rowItem}>
                        <View style={styles.circleIcon}>
                            <FaceIdActive width={16} height={16} />
                        </View>
                        <Text style={styles.txtSupport}>
                            {Languages.quickAuThen.useFaceId}
                        </Text>
                    </View>
                    <Switch
                        value={turnedOn}
                        onValueChange={onToggleBiometry}
                        trackColor={{ true: COLORS.GREEN, false: COLORS.GRAY_2 }}
                        ios_backgroundColor={COLORS.BLACK}
                    />
                </View>
            );
        }
        if (supportedBiometry === ENUM_BIOMETRIC_TYPE.TOUCH_ID) {
            return (
                <View style={styles.item}>
                    <View style={styles.rowItem}>
                        <View style={styles.circleIcon}>
                            <FingerprintIconActive width={16} height={16} />
                        </View>
                        <Text style={styles.txtSupport}>
                            {Languages.quickAuThen.useTouchId}
                        </Text>
                    </View>
                    <Switch
                        value={turnedOn}
                        onValueChange={onToggleBiometry}
                        trackColor={{ true: COLORS.GREEN, false: COLORS.GRAY_2 }}
                        ios_backgroundColor={COLORS.BLACK}
                    />
                </View>
            );
        }
        return null;
    }, [onToggleBiometry, supportedBiometry, turnedOn]);

    const goChangePwd = useCallback(() => {
    // Navigator.navigateScreen(ScreenNames.changePwd);
    }, []);

    const renderChangePwd = useMemo(() => (
        <Touchable onPress={goChangePwd} style={styles.item}>
            <View style={styles.rowItem}>
                <View style={styles.circleIcon}>
                    <PenEditIcon width={16} height={16} />
                </View>
                <Text style={styles.txtSupport}>
                    {Languages.quickAuThen.changePwd}
                </Text>
            </View>
            <RightIcon />
        </Touchable>
    ), [goChangePwd]);

    const onConfirm = useCallback(() => {
        if (isIOS) {
            popupUpdate?.current?.hide?.();
            PasscodeAuth.authenticate(
                supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID
                    ? Languages.quickAuThen.useFaceID
                    : Languages.quickAuThen.useTouchID
            )
                .then(() => {
                    SessionManager.setEnableFastAuthentication(true);
                    setTurnedOn(true);
                })
                .catch(() => {});
        } else {
            popupUpdate?.current?.hide?.();
            bottomSheetModalRef.current?.present?.();
        }
    }, [supportedBiometry]);

    const popupUpdatePassCode = useMemo(() => (
        <PopupConfirm
            ref={popupUpdate}
            type={supportedBiometry}
            onConfirm={onConfirm}
        />
    ), [onConfirm, supportedBiometry]);

    const onSetPinCodeSuccess = useCallback(
        (pin: string) => {
            bottomSheetModalRef.current?.close?.();
            SessionManager.setEnableFastAuthentication(true);
            StorageUtils.saveDataToKey(StorageKeys.KEY_PIN, pin);
            setTurnedOn(true);
            const message =
        supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID
            ? Languages.quickAuThen.successAddFaceId
            : Languages.quickAuThen.successAddTouchId;
            ToastUtils.showMsgToast(message);
        },
        [supportedBiometry]
    );
    const renderPinCode = useMemo(() => (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={['20%', '82%']}
            keyboardBehavior={'interactive'}
            enablePanDownToClose={true}
            backdropComponent={CustomBackdrop}
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
    ), [animationConfigs, onSetPinCodeSuccess]);

    return (
        <>
            <View style={styles.container}>
                <HeaderBar title={Languages.quickAuThen.title} />
                <View style={styles.wrapSupport}>
                    {renderSupportedBiometry}
                    {/* {renderChangePwd} */}
                </View>
            </View>
            {popupUpdatePassCode}
            {renderPopupError}
            {renderPinCode}
        </>
    );
});
const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    wrapSupport: {
        paddingTop: 10,
        paddingHorizontal: 16,
        paddingBottom: 15,
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        marginHorizontal: 16,
        marginTop: 16
    },
    item: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderColor: COLORS.GRAY_2
    },
    rowItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    circleIcon: {
        width: 32,
        height: 32,
        borderColor: COLORS.GREEN,
        borderWidth: 1,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtSupport: {
        fontSize: Configs.FontSize.size14,
        color: COLORS.BLACK,
        fontFamily: Configs.FontFamily.regular,
        marginLeft: 10
    },
    wrapPin: {
        flex: 1
    }
});
const customStyles = StyleSheet.create({
    main: {
        marginTop: 20,
        paddingHorizontal: 20,
        backgroundColor: COLORS.TRANSPARENT
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
export default SettingQuickAuth;
