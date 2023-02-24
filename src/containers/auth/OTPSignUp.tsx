import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import ScreenNames, { TabNamesArray } from '@/commons/ScreenNames';
import { Button } from '@/components';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { MyTextInput } from '@/components/elements/textfield/index';
import { TextFieldActions } from '@/components/elements/textfield/types';
import HeaderAuthn from '@/components/HeaderAuthn';
import ScrollViewWithKeyboard from '@/components/KeyboardAwareView';
import MyLoading from '@/components/MyLoading';
import PopupStatus from '@/components/popupStatus/PopupStatus';
import { PopupActions } from '@/components/popupStatus/types';
import { useAppStore } from '@/hooks';
import { OtpModel, UserInfoModel } from '@/models/user-model';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import ToastUtils from '@/utils/ToastUtils';
import Validate from '@/utils/Validate';
import SessionManager from '@/managers/SessionManager';
import { UserManager } from '@/managers/UserManager';

const otp: OtpModel[] = [
    {
        otp1: '',
        otp2: '',
        otp3: '',
        otp4: '',
        otp5: '',
        otp6: ''
    }
];
type DataMessage = {
    message: string,
    status: number
}

const second = 60;

const OTPSignUp = observer(({ route }: { route: any }) => {
    const { phone } = route.params;
    const isFocus = useIsFocused();
    const { apiServices, userManager, fastAuthInfoManager } = useAppStore();
    const [msgErr, setMsgErr] = useState<string>('');
    const [values] = useState<OtpModel[]>(otp);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(second);
    const [errText, setErrText] = useState<string>('');

    const intervalRef = useRef<any>();
    const popupResendCode = useRef<PopupActions>();
    const otp1Ref = useRef<TextFieldActions>();
    const otp2Ref = useRef<TextFieldActions>();
    const otp3Ref = useRef<TextFieldActions>();
    const otp4Ref = useRef<TextFieldActions>();
    const otp5Ref = useRef<TextFieldActions>();
    const otp6Ref = useRef<TextFieldActions>();

    const setValueItemOtpNull = useCallback(() => {
        otp1Ref.current?.setValue('');
        otp2Ref.current?.setValue('');
        otp3Ref.current?.setValue('');
        otp4Ref.current?.setValue('');
        otp5Ref.current?.setValue('');
        otp6Ref.current?.setValue('');
    }, []);

    useEffect(() => {
        if (isFocus) {
            otp1Ref.current?.blur();
            otp2Ref.current?.blur();
            otp3Ref.current?.blur();
            otp4Ref.current?.blur();
            otp5Ref.current?.blur();
            otp6Ref.current?.blur();
            setTimer(60);
            setValueItemOtpNull();
        }
    }, [isFocus]);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTimer((t) => t - 1);
        }, 1000);
        return () => clearInterval(intervalRef.current);
    }, [timer]);

    useEffect(() => {
        if (timer === 0 && isFocus) {
            clearInterval(intervalRef.current);
            popupResendCode.current?.show();
            setValueItemOtpNull();
            otp6Ref.current?.blur();
            setTimeout(() => {
                popupResendCode.current?.hide();
            }, 3000);
        }
    }, [isFocus, setValueItemOtpNull, timer]);

    const onPressOtp = useCallback(async () => {
        const OTP = values[0].otp1 + values[0].otp2 + values[0].otp3 + values[0].otp4 + values[0].otp5 + values[0].otp6;
        if (OTP?.length === 0) {
            return setErrText(Languages.errorMsg.emptyOTP);
        }
        if (OTP?.length < 6) {
            return setErrText(Languages.errorMsg.checkOTP);
        } 
        if (timer > 0) {
            if (OTP.length === 6) {
                setLoading(true);
                if (route?.params?.isForgotPwd) {
                    const res = await apiServices.auth.activeOtpPwd(OTP, route?.params?.data?.user_id);
                    setLoading(false);
                    if (res.success) {
                        setTimeout(() => {
                            Navigator.navigateScreen(ScreenNames.updateNewPwd, { user_id: route?.params?.data?.user_id });
                        }, 1500);
                        setValueItemOtpNull();
                        otp6Ref.current?.blur();
                    } else {
                        const dataMessage = res?.data as DataMessage;
                        setErrText(dataMessage?.message);
                    }
                } else {
                    const res = await apiServices.auth.activeAuth(OTP, route?.params?.data?.user_id);
                    setLoading(false);
                    if (res.success) {
                        const temp = res?.data as UserInfoModel;
                        if (temp?.token_app) {
                            SessionManager.setAccessToken(temp?.token_app);
                            SessionManager.setSaveIsLogout(false);
                            SessionManager.setEnableFastAuthentication(false);
                            fastAuthInfoManager.setEnableFastAuthentication(false);
                            const resInfoAcc = await apiServices.auth.getUserInfo();
                            if (resInfoAcc.success) {
                                const resData = resInfoAcc.data as UserInfoModel;
                                userManager.updateUserInfo(resData);
                            }
                        }
                        setTimeout(() => {
                            Navigator.navigateToDeepScreen([ScreenNames.tabs], TabNamesArray[0]);
                        }, 1500);
                        ToastUtils.showSuccessToast(Languages.profileAuth.successSignUp);
                        setValueItemOtpNull();
                        otp6Ref.current?.blur();
                    }
                    else {
                        const dataMessage = res?.data as DataMessage;
                        setErrText(dataMessage?.message);
                    }
                }
            }
        } else {
            setValueItemOtpNull();
            otp6Ref.current?.blur();
            setErrText(Languages.errorMsg.resendOTP);
        }

    }, [values, timer, route?.params?.isForgotPwd, route?.params?.data?.user_id, apiServices.auth, setValueItemOtpNull, fastAuthInfoManager, userManager]);

    const encode = (str: string) => str.replace(/[0-9]{7}/g, () => '0**'.slice());

    const textInputChange = useCallback((text: any, ref: any) => {
        const value =
            Validate.stringIsNumberOnly(text) && text.length === 1 ? text.trim() : '';
        if (value !== '') {
            ref.current.focus();
        }
    }, []);

    const onChangeInputOneKeyPress = useCallback((keyPress?: any) => {
        if (keyPress?.key === 'Backspace') {
            otp1Ref.current?.focus();
        }
    }, []);

    const onChangeInputTwoKeyPress = useCallback((keyPress?: any) => {
        if (keyPress?.key === 'Backspace') {
            otp1Ref.current?.focus();
        }
    }, []);

    const onChangeInputThreeKeyPress = useCallback((keyPress?: any) => {
        if (keyPress?.key === 'Backspace') {
            otp2Ref.current?.focus();
        }
    }, []);

    const onChangeInputFourKeyPress = useCallback((keyPress?: any) => {
        if (keyPress?.key === 'Backspace') {
            otp3Ref.current?.focus();
        }
    }, []);

    const onChangeInputFiveKeyPress = useCallback((keyPress?: any) => {
        if (keyPress?.key === 'Backspace') {
            otp4Ref.current?.focus();
        }
    }, []);

    const onChangeInputSixKeyPress = useCallback((keyPress?: any) => {
        if (keyPress?.key === 'Backspace') {
            otp5Ref.current?.focus();
        }
    }, []);

    const onChangeText = useCallback(
        (value: string, tag?: string) => {
            switch (tag) {
                case Languages.otp.otp1:
                    values[0].otp1 = value;
                    setErrText('');
                    textInputChange(value, otp2Ref);
                    break;
                case Languages.otp.otp2:
                    values[0].otp2 = value;
                    setErrText('');
                    textInputChange(value, otp3Ref);
                    break;
                case Languages.otp.otp3:
                    values[0].otp3 = value;
                    setErrText('');
                    textInputChange(value, otp4Ref);
                    break;
                case Languages.otp.otp4:
                    values[0].otp4 = value;
                    setErrText('');
                    textInputChange(value, otp5Ref);
                    break;
                case Languages.otp.otp5:
                    values[0].otp5 = value;
                    setErrText('');
                    textInputChange(value, otp6Ref);
                    break;
                case Languages.otp.otp6:
                    values[0].otp6 = value;
                    setErrText('');
                    break;
                default:
                    break;
            }
        }, [textInputChange, values]);

    const renderInput = useCallback((ref: any, testId: string, value: string, onKeyPress?: any, disabled?: any) => (
        <MyTextInput
            ref={ref}
            inputStyle={styles.inputOtp}
            value={value}
            containerInput={errText ? styles.viewErrOtp : styles.viewOtp}
            keyboardType={'NUMBER'}
            onChangeText={onChangeText}
            maxLength={1}
            testID={testId}
            autoFocus={disabled}
            onKeyPress={onKeyPress}
        />
    ), [errText, onChangeText]);

    const backToSignUp = () => {
        Navigator.goBack();
    };

    const resentCode = useCallback(async () => {
        setLoading(true);
        setErrText('');
        if (route.params?.isForgotPwd) {
            const res = await apiServices.auth.resendOtpPwd(route?.params?.data?.user_id);
            setLoading(false);
            if (res.success) {
                setTimer(60);
                setValueItemOtpNull();
                otp1Ref.current?.focus();
            }

        } else {
            const res = await apiServices.auth.resendOtp(route?.params?.data?.user_id);
            setLoading(false);
            if (res.success) {
                setTimer(60);
                setValueItemOtpNull();
                otp1Ref.current?.focus();
            }
        }
    }, [apiServices.auth, route.params?.data?.user_id, route.params?.isForgotPwd, setValueItemOtpNull]);

    const renderPopup = useCallback((ref: any, description: string) => (
        <PopupStatus
            ref={ref}
            title={Languages.otp.popupOtpErrorTitle}
            description={description}
        />
    ), []);

    const renderBtn = useMemo(() => (
        <Button
            label={Languages.common.confirm}
            onPress={onPressOtp}
            buttonStyle={BUTTON_STYLES.GREEN}
            isLowerCase
            buttonContainer={styles.buttonResend}
        />
    ), [onPressOtp]);

    return (
        <View style={styles.container}>
            <HeaderAuthn onClose={backToSignUp} />
            <ScrollViewWithKeyboard style={styles.containerBox}>
                <Text style={styles.confirmOtp}>{Languages.otp.keyOtp}</Text>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        {Languages.otp.verificationCode}{encode(phone)}{Languages.otp.codeExpiresLater}<Text style={styles.color}>{timer}{`${'s. '}`}</Text>
                        {timer <= 0 && <Text style={styles.resendCodeStyle} onPress={resentCode}>{Languages.otp.resentCode}</Text>}
                    </Text>
                </View>
                <Text style={styles.inputOtpStyle}>{Languages.otp.inputOtp}<Text style={styles.starStyle}>{`${' '}${Languages.common.star}`}</Text></Text>
                <View style={styles.boxOtp}>
                    {renderInput(otp1Ref, Languages.otp.otp1, values[0].otp1, onChangeInputOneKeyPress)}
                    {renderInput(otp2Ref, Languages.otp.otp2, values[0].otp2, onChangeInputTwoKeyPress)}
                    {renderInput(otp3Ref, Languages.otp.otp3, values[0].otp3, onChangeInputThreeKeyPress)}
                    {renderInput(otp4Ref, Languages.otp.otp4, values[0].otp4, onChangeInputFourKeyPress)}
                    {renderInput(otp5Ref, Languages.otp.otp5, values[0].otp5, onChangeInputFiveKeyPress)}
                    {renderInput(otp6Ref, Languages.otp.otp6, values[0].otp6, onChangeInputSixKeyPress)}
                </View>
                {!!errText && <Text style={styles.errTextStyle}>{errText}</Text>}
                {renderBtn}
                {renderPopup(popupResendCode, Languages.otp.popupOtpResendCode)}
            </ScrollViewWithKeyboard>
            {isLoading && <MyLoading isOverview />}
        </View>
    );
});

export default OTPSignUp;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerBox: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        flex: 1
    },
    confirmOtp: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size20,
        color: COLORS.GRAY_17
    },
    boxOtp: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    viewOtp: {
        width: Configs.FontSize.size50,
        height: Configs.FontSize.size50,
        marginVertical: 10,
        marginHorizontal: 4,
        borderRadius: Configs.FontSize.size50,
        borderWidth: 1
    },
    viewErrOtp: {
        width: Configs.FontSize.size50,
        height: Configs.FontSize.size50,
        marginVertical: 10,
        marginHorizontal: 4,
        borderRadius: Configs.FontSize.size50,
        borderWidth: 1,
        borderColor: COLORS.RED_2
    },
    inputOtp: {
        ...Styles.typography.regular,
        color: COLORS.BLACK,
        textAlign: 'center'
    },
    textContainer: {
        marginBottom: 24,
        marginTop: 8,
        flexDirection: 'row'
    },
    text: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12
    },
    resentCode: {
        ...Styles.typography.medium,
        color: COLORS.GREEN_2
    },
    color: {
        color: COLORS.RED_2
    },
    buttonResend: {
        marginTop: 24
    },
    inputOtpStyle: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_17
    },
    resendCodeContainer: {
        alignItems: 'center'
    },
    resendCodeStyle: {
        ...Styles.typography.medium,
        color: COLORS.GREEN_2,
        textAlign: 'center'
    },
    starStyle: {
        ...Styles.typography.regular,
        color: COLORS.RED_2
    },
    errTextStyle: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        color: COLORS.RED_3
    }
});
