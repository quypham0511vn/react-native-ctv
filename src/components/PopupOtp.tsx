import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

import IcClose from '@/assets/images/ic_close.svg';
import IcTienNgay from '@/assets/images/ic_logo_tienngay_otp.svg';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { PopupPropsTypes } from '@/models/typesPopup';
import { COLORS } from '@/theme/colors';
import { Styles } from '@/theme/styles';
import Utils from '@/utils/Utils';
import Validate from '@/utils/Validate';
import { Touchable } from './elements';
import HideKeyboard from './HideKeyboard';
import MyLoading from './MyLoading';
import OtpInputComponent, { PopupOtpInputActions } from './OtpInputComponent';

interface PopupOTPProps extends PopupPropsTypes {
    onEndingTextOtp?: (otp?: any) => any,
    reSendOtp?: () => any,
    phone?: string
}

export const PopupOtp = forwardRef<
    PopupOtpInputActions,
    PopupOTPProps
>(({ onEndingTextOtp, reSendOtp, phone }: PopupOTPProps, ref: any) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [startCount, setStartCount] = useState<boolean>(true);
    const [timer, setTimer] = useState<number>(0);

    const [animation] = useState(new Animated.Value(0));
    const refOTP = useRef<PopupOtpInputActions>(null);
    const intervalRef = useRef<any>();

    const [isLoading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTimer((t) => t - 1);
        }, 1000);
        if (timer <= 0) {
            clearInterval(intervalRef.current);
            setStartCount(false);
        }
        return () => {
            clearInterval(intervalRef.current);
            setStartCount(true);
        };
    }, [timer]);

    const _onCancel = useCallback(() => {
        setStartCount(true);
        setTimer(0);
    }, []);

    const show = useCallback(() => {
        setVisible(true);
        setTimer(60);
    }, []);

    const hide = useCallback(() => {
        setVisible(false);
        refOTP.current?.setErrorMsg('');
        _onCancel();
    }, [_onCancel]);

    const blur = useCallback(() => {
        refOTP.current?.blur();
    }, []);

    useImperativeHandle(ref, () => ({
        show,
        hide,
        blur,
        setErrorMsg
    }));

    const onResend = useCallback(async () => {
        setLoading(true);
        refOTP.current?.blur();
        setTimeout(() => {
            reSendOtp?.();
            setLoading(false);
            setStartCount(true);
            setTimer(60);
            refOTP.current?.clearMsgErr?.();
        }, 2000);
    }, [reSendOtp]);

    const renderResend = useMemo(() => {
        if (startCount) {
            return (
                <Text style={styles.txtTimer}>{`${Utils.convertSecondToMinutes(timer)}`}</Text>
            );
        }
        return (
            <Touchable onPress={onResend}>
                <Text style={styles.txtResendOtp}>{Languages.forgotPwd.resentOtp}</Text>
            </Touchable>
        );
    }, [onResend, startCount, timer]);

    const containerStyle = useMemo(() => [styles.container, { transform: [{ translateX: animation }] }], [animation]);

    const startShake = useCallback(() => {
        Animated.sequence([
            Animated.timing(animation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(animation, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(animation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(animation, { toValue: 0, duration: 50, useNativeDriver: true })
        ]).start();
    }, [animation]);

    const setErrorMsg = useCallback((msg: string) => {
        if (Validate.isStringEmpty(msg)) {
            return;
        }
        refOTP.current?.setErrorMsg(msg);
        startShake();
    }, [startShake]);

    const onClose = useCallback(() => {
        setVisible(false);
        refOTP.current?.blur();
    }, []);

    const handleEndingTextOtp = useCallback((otp: string) => {
        if (timer <= 0) {
            refOTP.current?.setErrorMsg(Languages.errorMsg.resendOTP);
        } else if (timer > 0 && otp.length === 6) {
            onEndingTextOtp?.(otp);
        }
    }, [onEndingTextOtp, timer]);

    const encode = useCallback((str: string) => str.replace(/[0-9]{7}/g, () => '0**'.slice()),[]);

    return (
        <Modal
            isVisible={visible}
            animationIn="slideInUp"
            useNativeDriver={true}
            avoidKeyboard={true}
            hideModalContentWhileAnimating
        >
            <HideKeyboard>
                <View style={styles.mainContainer}>
                    <Touchable onPress={onClose} style={styles.closeWrap}>
                        <IcClose width={15} height={15} />
                    </Touchable>

                    <IcTienNgay />
                    <Text style={styles.titlePopup}>{Languages.forgotPwd.confirmOtp}</Text>
                    <Text style={styles.contentPopup}>{`${Languages.forgotPwd.contentForgotOtp}`.replace('&s1',encode(phone || ''))}</Text>
                    <Animated.View style={containerStyle} >
                        <View style={styles.boxOtp}>
                            <OtpInputComponent
                                ref={refOTP}
                                onEndingTextOtp={handleEndingTextOtp}
                            />
                        </View>
                        {isLoading ? <MyLoading /> : renderResend}
                    </Animated.View>
                </View>
            </HideKeyboard>
        </Modal>
    );
});
const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.GRAY_14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 16,
        paddingVertical: 16
    },
    titlePopup: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        color: COLORS.GRAY_7,
        paddingTop: 24,
        paddingBottom: 8
    },
    contentPopup: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12,
        textAlign: 'center',
        paddingHorizontal: 16
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    boxOtp: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    txtTimer: {
        ...Styles.typography.regular,
        color: COLORS.RED_4
    },
    txtResendOtp: {
        ...Styles.typography.regular,
        color: COLORS.GREEN
    },
    closeWrap: {
        alignSelf: 'flex-end',
        marginRight: 16
    }
});
