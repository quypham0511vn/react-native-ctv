import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { Configs, isIOS } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { OtpModel } from '@/models/user-model';
import { COLORS, Styles } from '@/theme';
import Validate from '@/utils/Validate';
import { MyTextInput } from './elements/textfield';
import { TextFieldActions } from './elements/textfield/types';
import { SCREEN_HEIGHT } from '@/utils/ScreenUtils';

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

export interface PopupOtpInputActions {
    focus: () => void;
    blur: () => void;
    setErrorMsg: (msg?: string) => void;
    show: (content?: string) => any;
    hide?: (content?: string) => any;
    clearMsgErr?: ()=>void
}

export interface PopupOtpInputProps {
    onEndingTextOtp?: (otp?: any) => any;
}

const OtpInputComponent = forwardRef<PopupOtpInputActions, PopupOtpInputProps>(
    (
        {
            onEndingTextOtp
        }: PopupOtpInputProps,
        ref: any
    ) => {
        const [values] = useState<OtpModel[]>(otp);
        const [disable] = useState<boolean>(true);
        const [errorText, setErrorText] = useState<string>('');

        const otp1Ref = useRef<TextFieldActions>(null);
        const otp2Ref = useRef<TextFieldActions>(null);
        const otp3Ref = useRef<TextFieldActions>(null);
        const otp4Ref = useRef<TextFieldActions>(null);
        const otp5Ref = useRef<TextFieldActions>(null);
        const otp6Ref = useRef<TextFieldActions>(null);

        useEffect(() => {
            if (otp1Ref.current?.focus()) {
                setErrorText('');
            }
        }, []);

        const blur = useCallback(() => {
            otp1Ref.current?.blur();
            otp2Ref.current?.blur();
            otp3Ref.current?.blur();
            otp4Ref.current?.blur();
            otp5Ref.current?.blur();
            otp6Ref.current?.blur();
            otp1Ref.current?.setValue('');
            otp2Ref.current?.setValue('');
            otp3Ref.current?.setValue('');
            otp4Ref.current?.setValue('');
            otp5Ref.current?.setValue('');
            otp6Ref.current?.setValue('');
        }, []);

        const focus = useCallback(() => {
            otp1Ref.current?.focus();
            setErrorText('');
        }, []);

        const clearMsgErr = useCallback(() => {
            setErrorText('');
        }, []);

        useImperativeHandle(ref, () => ({
            blur,
            focus,
            setErrorMsg,
            clearMsgErr
        }));

        const onPressOtp = useCallback(async () => {
            const OTP = values[0].otp1 + values[0].otp2 + values[0].otp3 + values[0].otp4 + values[0].otp5 + values[0].otp6;

            if (OTP.length === 6) {
                onEndingTextOtp?.(OTP);
                values[0].otp1 = '';
                values[0].otp2 = '';
                values[0].otp3 = '';
                values[0].otp4 = '';
                values[0].otp5 = '';
                values[0].otp6 = '';
            }
        }, [onEndingTextOtp, values]);

        const textInputChange = useCallback((text: any, _ref: any) => {
            const value = Validate.stringIsNumberOnly(text) && text.length === 1 ? text.trim() : '';
            if (value !== '') {
                _ref.current.focus();
                setErrorText('');
            }
        }, []);

        const onChangeInputOneKeyPress = useCallback((keyPress?: any) => {
            const key = keyPress.nativeEvent.key;
            if (key === 'Backspace') {
                otp1Ref.current?.focus();
                setErrorText('');
            }
        }, []);

        const onChangeInputTwoKeyPress = useCallback((keyPress?: any) => {
            const key = keyPress.nativeEvent.key;
            if (key === 'Backspace') {
                otp1Ref.current?.focus();
                setErrorText('');
            }
        }, []);

        const onChangeInputThreeKeyPress = useCallback((keyPress?: any) => {
            const key = keyPress.nativeEvent.key;
            if (key === 'Backspace') {
                otp2Ref.current?.focus();
                setErrorText('');
            }
        }, []);

        const onChangeInputFourKeyPress = useCallback((keyPress?: any) => {
            const key = keyPress.nativeEvent.key;
            if (key === 'Backspace') {
                otp3Ref.current?.focus();
                setErrorText('');
            }
        }, []);

        const onChangeInputFiveKeyPress = useCallback((keyPress?: any) => {
            const key = keyPress.nativeEvent.key;
            if (key === 'Backspace') {
                otp4Ref.current?.focus();
                setErrorText('');
            }
        }, []);

        const onChangeInputSixKeyPress = useCallback((keyPress?: any) => {
            const key = keyPress.nativeEvent.key;
            if (key === 'Backspace') {
                otp5Ref.current?.focus();
                setErrorText('');
            }
        }, []);

        const onChangeText = useCallback((value: string, tag?: string) => {

            switch (tag) {
                case Languages.otp.otp1:
                    values[0].otp1 = value;
                    textInputChange(value, otp2Ref);
                    break;
                case Languages.otp.otp2:
                    values[0].otp2 = value;
                    textInputChange(value, otp3Ref);
                    break;
                case Languages.otp.otp3:
                    values[0].otp3 = value;
                    textInputChange(value, otp4Ref);
                    break;
                case Languages.otp.otp4:
                    values[0].otp4 = value;
                    textInputChange(value, otp5Ref);
                    break;
                case Languages.otp.otp5:
                    values[0].otp5 = value;
                    textInputChange(value, otp6Ref);
                    break;
                case Languages.otp.otp6:
                    values[0].otp6 = value;
                    if (values[0].otp6.length > 0)
                        onPressOtp();
                    break;
                default:
                    break;
            }
        }, [onPressOtp, textInputChange, values]);
        const renderInput = useCallback((_ref: any, testId: string, value: string, onKeyPress?: any, disabled?: any) => <MyTextInput
            ref={_ref}
            inputStyle={styles.inputOtp}
            value={value}
            containerInput={errorText ? styles.viewOtpError : styles.viewOtp}
            keyboardType={'NUMBER'}
            onChangeText={onChangeText}
            maxLength={1}
            testID={testId}
            autoFocus={disabled}
            onKeyPress={onKeyPress}
        />, [errorText, onChangeText]);

        const errorMessage = useMemo(() => {
            const paddingText = { paddingBottom: SCREEN_HEIGHT * 0.01 };
            return <View style={paddingText}>
                <Text
                    style={styles.errorMessage}>{errorText}</Text>
            </View>;
        }, [errorText]);

        const setErrorMsg = useCallback((msg: string) => {
            if (Validate.isStringEmpty(msg)) {
                return;
            }
            setErrorText(msg);
        }, []);

        return (
            <>
                <View style={styles.mainContainer}>
                    {renderInput(otp1Ref, Languages.otp.otp1, values[0].otp1, onChangeInputOneKeyPress, disable)}
                    {renderInput(otp2Ref, Languages.otp.otp2, values[0].otp2, onChangeInputTwoKeyPress)}
                    {renderInput(otp3Ref, Languages.otp.otp3, values[0].otp3, onChangeInputThreeKeyPress)}
                    {renderInput(otp4Ref, Languages.otp.otp4, values[0].otp4, onChangeInputFourKeyPress)}
                    {renderInput(otp5Ref, Languages.otp.otp5, values[0].otp5, onChangeInputFiveKeyPress)}
                    {renderInput(otp6Ref, Languages.otp.otp6, values[0].otp6, onChangeInputSixKeyPress)}
                </View>
                {errorMessage}
            </>

        );
    }
);

export default OtpInputComponent;

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    viewOtp: {
        width: isIOS ? Configs.FontSize.size45 : Configs.FontSize.size50,
        height: isIOS ? Configs.FontSize.size45 : Configs.FontSize.size50,
        marginVertical: 16,
        marginHorizontal: isIOS ? 4 : 2,
        borderWidth: 1,
        borderRadius: isIOS ? Configs.FontSize.size45 : Configs.FontSize.size50
    },
    viewOtpError: {
        width: isIOS ? Configs.FontSize.size45 : Configs.FontSize.size50,
        height: isIOS ? Configs.FontSize.size45 : Configs.FontSize.size50,
        marginVertical: 16,
        marginHorizontal: isIOS ? 4 : 2,
        borderWidth: 1,
        borderRadius: isIOS ? Configs.FontSize.size45 : Configs.FontSize.size50,
        borderColor: COLORS.RED_3
    },
    inputOtp: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12,
        textAlign: 'center'
    },
    errorMessage: {
        fontSize: Configs.FontSize.size12,
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.RED_3,
        marginHorizontal: 15,
        textAlign: 'center',
        paddingHorizontal: 16
    }
});
