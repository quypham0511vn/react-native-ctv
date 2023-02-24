import { observer } from 'mobx-react';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ICONS } from '@/assets/icons/constant';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { Button } from '@/components';
import BackgroundTienNgay from '@/components/BackgroundTienNgay';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import HeaderAuthn from '@/components/HeaderAuthn';
import ScrollViewWithKeyboard from '@/components/KeyboardAwareView';
import MyLoading from '@/components/MyLoading';
import { PopupOtpInputActions } from '@/components/OtpInputComponent';
import { useAppStore } from '@/hooks';
import Navigator from '@/routers/Navigator';
import FormValidate from '@/utils/FormValidate';
import ToastUtils from '@/utils/ToastUtils';
import { COLORS, Styles } from '@/theme';

const UpdateNewPwd = observer(({ route }: { route: any }) => {

    const { apiServices } = useAppStore();

    const [disable, setDisable] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);

    const [newPwd, setNewPwd] = useState<string>('');
    const [rePwd, setRePwd] = useState<string>('');

    const newPwdRef = useRef<TextFieldActions>(null);
    const rePwdRef = useRef<TextFieldActions>(null);

    const popupOtpRef = useRef<PopupOtpInputActions>(null);

    const back = () => {
        Navigator.navigateToDeepScreen(
            [ScreenNames.auth], ScreenNames.login
        );
    };

    const onStatusButtonSignUp = useCallback(() => {
        if (newPwd !== '' && rePwd !== '') {
            setDisable(true);
        }
    }, [newPwd, rePwd]);

    const onChangeText = useCallback((value: string, tag?: string) => {
        switch (tag) {
            case Languages.changePwd.placeNewPass:
                setNewPwd(value);
                onStatusButtonSignUp();
                break;
            case Languages.changePwd.currentNewPass:
                setRePwd(value);
                onStatusButtonSignUp();
                break;
            default:
                break;
        }
    }, [onStatusButtonSignUp]);

    const renderInput = useCallback((_ref: any, _title: any, _placeHolder: any, _value: string, _iconPhone?: boolean, _isPass?: boolean, _maxLength?: number) => <>
        <MyTextInput
            label={_title}
            ref={_ref}
            placeHolder={_placeHolder}
            leftIcon={_iconPhone ? ICONS.PHONE : ICONS.LOCK}
            value={_value}
            onChangeText={onChangeText}
            isPassword={!_isPass}
            maxLength={_maxLength || 50}
            keyboardType={_iconPhone ? 'PHONE' : 'DEFAULT'}
            containerInput={styles.inputContainer}
            wrapErrText={styles.inputErrContainer}
            optional
        />
    </>, [onChangeText]);

    const onValidation = useCallback(() => {
        const errMsgNewPwd = FormValidate.passValidate(newPwd);
        const errMsgRePwd = FormValidate.passConFirmValidate(newPwd, rePwd);

        newPwdRef.current?.setErrorMsg(errMsgNewPwd);
        rePwdRef.current?.setErrorMsg(errMsgRePwd);

        if (`${errMsgNewPwd}${errMsgRePwd}`.length === 0) {
            return true;
        }
        return false;
    }, [newPwd, rePwd]);

    const onProcessNewPwd = useCallback(async () => {

        if (onValidation()) {
            setLoading(true);
            const res = await apiServices.auth.updateNewPwd(newPwd, rePwd, route.params?.user_id);
            setLoading(false);
            if (res.success) {
                popupOtpRef.current?.blur?.();
                popupOtpRef.current?.hide?.();
                popupOtpRef.current?.setErrorMsg?.('');
                setTimeout(() => {
                    Navigator.navigateScreen(ScreenNames.login);
                }, 600);
                ToastUtils.showSuccessToast(Languages.changePwd.toastSuccess);
            } else {
                popupOtpRef.current?.setErrorMsg?.(Languages.forgotPwd.otpFalse);
                popupOtpRef.current?.blur();
            }
        }

    }, [apiServices.auth, newPwd, onValidation, rePwd, route.params?.user_id]);

    return (
        <BackgroundTienNgay>
            <HeaderAuthn onClose={back} />
            <View style={styles.wrapContent}>
                <ScrollViewWithKeyboard>
                    <View style={styles.wrapInput}>
                        <Text style={styles.textScreen}>{Languages.forgotPwd.createPass}</Text>
                        <Text style={styles.description}>{Languages.forgotPwd.enterInputPwdNew}</Text>

                        {renderInput(newPwdRef, Languages.forgotPwd.enterPwdNew, Languages.forgotPwd.enterPwdNew, newPwd)}
                        {renderInput(rePwdRef, Languages.forgotPwd.enterConfirmPwdNew, Languages.forgotPwd.enterConfirmPwdNew, rePwd)}
                    </View>
                    <Button
                        onPress={onProcessNewPwd}
                        label={Languages.forgotPwd.createPass}
                        isLowerCase
                        buttonContainer={styles.wrapBt}
                        buttonStyle={BUTTON_STYLES.GREEN} />
                </ScrollViewWithKeyboard>

            </View>
            {isLoading && <MyLoading isOverview />}
        </BackgroundTienNgay>
    );
});

export default UpdateNewPwd;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapContent: {
        flex: 1,
        paddingHorizontal: 16
    },
    wrapInput: {
        marginTop: Configs.IconSize.size40
    },
    wrapBt: {
        marginTop: 12
    },
    inputContainer: {
        marginBottom: 12,
        height: Configs.FontSize.size45
    },
    inputErrContainer: {
        paddingBottom: 5
    },
    textScreen: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_17,
        fontSize: Configs.FontSize.size20
    },
    description: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_13,
        marginTop: 8,
        marginBottom: 24
    },
    loginNow: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12,
        textAlign: 'center',
        marginTop: Configs.IconSize.size40
    },
    textLogin: {
        ...Styles.typography.medium,
        color: COLORS.GREEN
    }
});
