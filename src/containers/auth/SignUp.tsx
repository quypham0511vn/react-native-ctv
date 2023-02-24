import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { ICONS } from '@/assets/icons/constant';
import CloseIcon from '@/assets/images/ic_close.svg';
import IcRadio from '@/assets/images/ic_radio.svg';
import IcTypeAccount from '@/assets/images/ic_type_account.svg';
import IcUnRadio from '@/assets/images/ic_un_radio.svg';
import { Configs, HEADER_PADDING, PADDING_TOP, STATUSBAR_HEIGHT } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { Touchable } from '@/components';
import BackgroundTienNgay from '@/components/BackgroundTienNgay';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { Button } from '@/components/elements/button/index';
import { MyTextInput } from '@/components/elements/textfield/index';
import { TextFieldActions } from '@/components/elements/textfield/types';
import FooterItem from '@/components/FooterItem';
import ScrollViewWithKeyboard from '@/components/KeyboardAwareView';
import MyLoading from '@/components/MyLoading';
import { useAppStore } from '@/hooks';
import Navigator from '@/routers/Navigator';
import FormValidate from '@/utils/FormValidate';
import ScreenUtils, { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/ScreenUtils';
import { PopupActions } from '@/components/popup/types';
import ModalFormSignUp from './ModalSignUp';
import ScreenNames from '@/commons/ScreenNames';
import { COLORS, Styles } from '@/theme';
import { TYPE_FORM_ACCOUNT } from '@/commons/constants';
import HeaderAuthn from '@/components/HeaderAuthn';

const pathLogo = require('@/assets/images/img_logo.png');

const inputID = ['inputAccessoryViewID1', 'inputAccessoryViewID2', 'inputAccessoryViewID3', 'inputAccessoryViewID4'];

const SignUp = observer(() => {
    const { apiServices } = useAppStore();
    const isFocus = useIsFocused();

    const [typeAccount, setTypeAccount] = useState<string>(Languages.profileAuth.individual);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [phone, setPhone] = useState<string>('');
    const [phonePresenter, setCard] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const [conFirmPass, setConFirmPass] = useState<string>('');
    const [disable, setDisable] = useState<boolean>(false);

    const phoneRef = useRef<TextFieldActions>(null);
    const emailRef = useRef<TextFieldActions>(null);
    const phonePresenterRef = useRef<TextFieldActions>(null);
    const pwdRef = useRef<TextFieldActions>(null);
    const pwdCfRef = useRef<TextFieldActions>(null);
    const formRef = useRef<PopupActions>(null);


    useEffect(() => {
        if (isFocus) {
            ScreenUtils.setStatusBarStyle(true);
        }
    }, [isFocus]);

    const goBack = () => {
        Navigator.goBack();
    };

    const backToLogin = () => {
        Navigator.navigateScreen(ScreenNames.login);
    };

    const onStatusButtonSignUp = useCallback(() => {
        if (phone !== '' && pass !== '' && conFirmPass !== '') {
            setDisable(true);
        }
    }, [conFirmPass, pass, phone]);

    const onValidation = useCallback(() => {
        const errMsgPhone = FormValidate.passConFirmPhone(phone);
        const errMsgCard = FormValidate.passConFirmPhonePresenter(phonePresenter);
        const errMsgPwd = FormValidate.passValidate(pass);
        const errMsgConFirmPwd = FormValidate.passConFirmValidate(pass, conFirmPass);

        phoneRef.current?.setErrorMsg(errMsgPhone);
        phonePresenterRef.current?.setErrorMsg(errMsgCard);
        pwdRef.current?.setErrorMsg(errMsgPwd);
        pwdCfRef.current?.setErrorMsg(errMsgConFirmPwd);

        if (`${errMsgCard}${errMsgPwd}${errMsgConFirmPwd}${errMsgPhone}`.length === 0) {
            return true;
        }
        return false;
    }, [phonePresenter, conFirmPass, pass, phone]);

    const onPressSignUp = useCallback(async () => {
        if (onValidation()) {
            setLoading(true);
            setDisable(!disable);
            const form = typeAccount === Languages.profileAuth.individual ? TYPE_FORM_ACCOUNT.PRIVATE : TYPE_FORM_ACCOUNT.GROUP;
            const res = await apiServices.auth.registerAuth(phone, pass, conFirmPass, form, phonePresenter, '', '', '');
            setLoading(false);
            if (res.success) {
                Navigator.pushScreen(ScreenNames.otpSignUp, {
                    phone,
                    data: res.data
                });
            }
        }

    }, [onValidation, disable, typeAccount, apiServices.auth, phone, pass, conFirmPass, phonePresenter]);

    const onChangeText = useCallback((value: string, tag?: string) => {
        switch (tag) {
            case Languages.profileAuth.numberPhone:
                setPhone(value);
                onStatusButtonSignUp();
                break;
            case Languages.profileAuth.phonePresenter:
                setCard(value);
                onStatusButtonSignUp();
                break;
            case Languages.profileAuth.enterPwd:
                setPass(value);
                onStatusButtonSignUp();
                break;
            case Languages.profileAuth.currentPass:
                setConFirmPass(value);
                onStatusButtonSignUp();
                break;
            default:
                break;
        }
    }, [onStatusButtonSignUp]);

    const checkbox = useCallback((value: string) => {
        if (typeAccount === value) {
            return <IcRadio width={20} height={20} />;
        }
        return <IcUnRadio width={20} height={20} />;
    }, [typeAccount]);

    const renderCheckBox = useCallback((label: string) => {
        const onChangeChecked = () => {
            setTypeAccount(label);
        };
        return (
            <View style={styles.row}>
                <Touchable style={styles.checkbox} onPress={onChangeChecked}>
                    {checkbox(label)}
                </Touchable>
                <Text style={styles.titleItemRadioStyle}>{label}</Text>
            </View>
        );
    }, [checkbox]);

    const handleWarning = useCallback(() => {
        formRef.current?.show();
    }, []);

    const renderGroupRadio = useMemo(() => (
        <View style={styles.radio}>
            <View style={styles.titleRadioGroupContainer}>
                <View style={styles.leftTitleRadioContainer}>
                    <Text style={styles.titleRadioGroupStyle}>{Languages.profileAuth.typeAccount}</Text>
                    <Text style={styles.startVal}>{Languages.common.star}</Text>
                </View>
                <Touchable onPress={handleWarning} radius={10}>
                    <IcTypeAccount />
                </Touchable>
            </View>
            <View style={styles.radioContainer}>
                {renderCheckBox(Languages.profileAuth.individual)}
                {renderCheckBox(Languages.profileAuth.team)}
            </View>
        </View>
    ), [handleWarning, renderCheckBox]);

    const renderTextInput = useCallback((
        _ref: any,
        _value: string,
        _leftIcon: any,
        _label: string,
        _placeHolder: string,
        _maxLength: number,
        _optional: boolean,
        _isPass?: boolean,
        _keyboard?: any,
        orderRef?: number,
        inputAccessoryViewID?: string,
        textContentType?: any
    ) => (
        <MyTextInput
            label={_label}
            ref={_ref}
            refArr={[phoneRef, pwdRef, pwdCfRef, phonePresenterRef]}
            orderRef={orderRef}
            inputAccessoryViewID={inputAccessoryViewID}
            value={_value}
            leftIcon={_leftIcon}
            placeHolder={_placeHolder}
            onChangeText={onChangeText}
            maxLength={_maxLength}
            keyboardType={_keyboard}
            optional={_optional}
            isPassword={_isPass}
            containerInput={styles.formInput}
            wrapErrText={styles.wrapErrPickerText}
            stylesContainer={styles.viewContainerInput}
            textContentType={textContentType}
        />
    ), [onChangeText]);

    return (
        <BackgroundTienNgay>
            <SafeAreaView style={styles.container}>
                <HeaderAuthn />
                <View style={styles.swapInput}>
                    <ScrollViewWithKeyboard>
                        <Text style={styles.loginTextStyle}>{Languages.common.logUp}</Text>
                        <View style={styles.wrapText}>
                            <Text style={styles.txtHaveAccount}>{Languages.login.haveAccount}</Text>
                            <Touchable onPress={backToLogin}>
                                <Text style={styles.txtRegisterNow}>{Languages.login.loginNow}</Text>
                            </Touchable>
                        </View>
                        {renderTextInput(phoneRef, phone, ICONS.PHONE, Languages.profileAuth.numberPhone, Languages.profileAuth.numberPhone, 10, true, false, 'NUMERIC', 1, inputID[0], 'telephoneNumber')}
                        {renderGroupRadio}
                        {/* {((phonePresenterRef.current?.getValue() === '' || !phonePresenterRef.current?.getValue()) && typeAccount !== Languages.profileAuth.individual)
                            && renderTextInput(companyRef, company, ICONS.COMPANY, Languages.profileAuth.company, Languages.profileAuth.company, 100, false, false, 'DEFAULT', 2, inputID[1])} */}
                        {/* {renderTextInput(emailRef, email, ICONS.MAIL, Languages.profileAuth.email, Languages.profileAuth.email, 100, false, false, 'EMAIL', 3, inputID[2], 'emailAddress')} */}
                        {renderTextInput(pwdRef, pass, ICONS.LOCK, Languages.profileAuth.enterPwd, Languages.profileAuth.enterPwd, 50, true, true, 'DEFAULT', 2, inputID[1])}
                        {renderTextInput(pwdCfRef, conFirmPass, ICONS.LOCK, Languages.profileAuth.currentPass, Languages.profileAuth.currentPass, 50, true, true, 'DEFAULT', 3, inputID[2])}
                        {renderTextInput(phonePresenterRef, phonePresenter, ICONS.PHONE, Languages.profileAuth.phonePresenter, Languages.profileAuth.phonePresenter, 10, false, false, 'NUMERIC', 4, inputID[3])}
                        <Button
                            style={styles.buttonContainer}
                            onPress={onPressSignUp}
                            isLowerCase
                            buttonStyle={BUTTON_STYLES.GREEN}
                            label={Languages.common.logUp}
                        />
                        <FooterItem />
                    </ScrollViewWithKeyboard>
                </View>
                {isLoading && <MyLoading isOverview />}
                <ModalFormSignUp ref={formRef} />
            </SafeAreaView>
        </BackgroundTienNgay>
    );
});

export default SignUp;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    txt: {
        fontSize: Configs.FontSize.size18,
        color: COLORS.BLACK
    },
    header: {
        width: SCREEN_WIDTH,
        paddingHorizontal: 16,
        alignItems: 'flex-end',
        marginTop: STATUSBAR_HEIGHT + PADDING_TOP
    },
    image: {
        position: 'absolute',
        zIndex: -1
    },
    hisLop: {
        paddingVertical: 10,
        paddingLeft: 10
    },
    form: {
        height: SCREEN_HEIGHT - (HEADER_PADDING + STATUSBAR_HEIGHT)
    },
    swapInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 15
    },
    content: {
        flex: 0
    },
    formInput: {
        height: Configs.FontSize.size45
    },
    radio: {
        marginBottom: 12
    },
    startVal: {
        ...Styles.typography.regular,
        color: COLORS.RED_2,
        paddingLeft: 2
    },
    label: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_13,
        marginBottom: 5,
        marginLeft: 5
    },
    buttonContainer: {
        marginTop: 12,
        marginBottom: 48
    },
    channelContainer: {
        marginTop: 0,
        marginBottom: 15
    },
    viewSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center'
    },
    checkbox: {
        justifyContent: 'flex-end'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginRight: 12
    },
    titleItemRadioStyle: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_13,
        marginLeft: 8
    },
    radioContainer: {
        flexDirection: 'row'
    },
    wrapLogo: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 0.1
    },
    logo: {
        width: 200,
        height: 80,
        resizeMode: 'contain'
    },
    loginTextStyle: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_17,
        fontSize: Configs.FontSize.size20,
        paddingBottom: 8
    },
    txtRegisterNow: {
        ...Styles.typography.medium,
        color: COLORS.GREEN_2
    },
    txtHaveAccount: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_13
    },
    wrapText: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 20
    },
    titleRadioGroupContainer: {
        flexDirection: 'row',
        marginBottom: 5,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    leftTitleRadioContainer: {
        flexDirection: 'row',
        paddingBottom: 4
    },
    titleRadioGroupStyle: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_17
    },
    wrapErrPickerText: {
        paddingHorizontal: 4
    },
    viewContainerInput: {
        marginBottom: 12
    }
});
