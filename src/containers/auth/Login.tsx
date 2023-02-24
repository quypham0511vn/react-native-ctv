import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { ICONS } from '@/assets/icons/constant';
import CheckIcon from '@/assets/images/ic_check.svg';
import CloseIcon from '@/assets/images/ic_close.svg';
import UnCheckIcon from '@/assets/images/ic_uncheck.svg';
import {
    Configs, PADDING_BOTTOM,
    PADDING_TOP,
    STATUSBAR_HEIGHT
} from '@/commons/Configs';
import Languages from '@/commons/Languages';
import ScreenNames, { TabNames, TabNamesArray } from '@/commons/ScreenNames';
import { Button, Touchable } from '@/components';
import BackgroundTienNgay from '@/components/BackgroundTienNgay';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import FooterItem from '@/components/FooterItem';
import ScrollViewWithKeyboard from '@/components/KeyboardAwareView';
import MyLoading from '@/components/MyLoading';
import { useAppStore } from '@/hooks';
import SessionManager from '@/managers/SessionManager';
import { UserInfoModel } from '@/models/user-model';
import Navigator from '@/routers/Navigator';
import { COLORS, CommonStyle, Styles } from '@/theme';
import FormValidate from '@/utils/FormValidate';
import ScreenUtils, { SCREEN_WIDTH } from '@/utils/ScreenUtils';
import HeaderAuthn from '@/components/HeaderAuthn';

const pathLogo = require('@/assets/images/img_logo.png');

const Login = observer(({ route }: any) => {
    const {
        apiServices,
        userManager,
        fastAuthInfoManager: fastAuthInfo,
        appManager
    } = useAppStore();
    const [phone, setPhone] = useState<any>('');
    const [pass, setPass] = useState<any>('');

    const refPhone = useRef<TextFieldActions>(null);
    const refPass = useRef<TextFieldActions>(null);

    const isFocus = useIsFocused();

    const [checked, setCheck] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (SessionManager.getPhoneLogin()) {
            setPhone(SessionManager.getPhoneLogin());
            setCheck(true);
        }
        if (SessionManager.getPwdLogin()) {
            setPass(SessionManager.getPwdLogin());
            setCheck(true);
        }
    }, []);

    useEffect(() => {
        if (isFocus) {
            setPhone(SessionManager.getPhoneLogin());
            setCheck(true);
            setPass('');
            ScreenUtils.setStatusBarStyle(isFocus);
        }

    }, [isFocus]);

    const onChangeChecked = useCallback(() => {
        setCheck((last) => !last);
    }, []);

    const checkbox = useMemo(() => {
        if (checked) {
            return <CheckIcon width={20} height={20} />;
        }
        return <UnCheckIcon width={20} height={20} />;
    }, [checked]);

    const onChangeText = useCallback((value: string, tag?: string) => {
        switch (tag) {
            case Languages.login.phoneNumber:
                setPhone(value);
                break;
            case Languages.login.password:
                setPass(value);
                break;
            default:
                break;
        }
    }, []);

    const onLoginPhone = useCallback(async () => {
        const errMsgPhone = FormValidate.passConFirmPhone(phone);
        const errMsgPwd = FormValidate.passValidate(pass);

        refPhone.current?.setErrorMsg(errMsgPhone);
        refPass.current?.setErrorMsg(errMsgPwd);

        if (`${errMsgPwd}${errMsgPhone}`.length === 0) {
            setLoading(true);
            const res = await apiServices.auth.loginPhone(phone, pass);
            setLoading(false);
            if (res.success) {
                SessionManager.setAccessToken(res?.data?.user?.token_app);
                SessionManager.setSaveIsLogout(false);
                if (!checked) {
                    SessionManager.setSavePhoneLogin('');
                } else {
                    SessionManager.setSavePhoneLogin(phone);
                }
                userManager.updateUserInfo(res?.data?.user as UserInfoModel);
                fastAuthInfo.setEnableFastAuthentication(false);
                setTimeout(() => {
                    if (SessionManager.accessToken && SessionManager.lastTabIndexBeforeOpenAuthTab) {
                        Navigator.navigateToDeepScreen(
                            [ScreenNames.tabs],
                            TabNamesArray[SessionManager.lastTabIndexBeforeOpenAuthTab]
                        );
                    }
                }, 100);
            }
        }
    }, [apiServices.auth, checked, fastAuthInfo, pass, phone, userManager]);

    const goBack = useCallback(() => {
        Navigator.navigateToDeepScreen([ScreenNames.tabs], TabNames.homeTab);
    }, []);

    const _onSignIn = () => {
        Navigator.navigateScreen(ScreenNames.signUp);
    };

    const onNavigateForgotPwd = () => {
        Navigator.navigateScreen(ScreenNames.forgotPwd);
    };

    return (
        <BackgroundTienNgay>
            <SafeAreaView style={styles.container}>
                <HeaderAuthn onClose={goBack}/>
                <ScrollViewWithKeyboard>
                    <View style={styles.wrapContent}>

                        <View style={styles.wrapAll}>
                            <View style={styles.content}>
                                <Text style={styles.loginTextStyle}>{Languages.authentication.login}</Text>
                                <View style={styles.wrapText}>
                                    <Text style={styles.txtHaveAccount}>{Languages.login.haveNoAccount}</Text>
                                    <Touchable onPress={_onSignIn}>
                                        <Text style={styles.txtRegisterNow}>{Languages.login.registerNow}</Text>
                                    </Touchable>
                                </View>
                                <MyTextInput
                                    ref={refPhone}
                                    value={phone}
                                    leftIcon={ICONS.PROFILE}
                                    placeHolder={Languages.login.phoneNumber}
                                    containerInput={styles.inputPhone}
                                    onChangeText={onChangeText}
                                    keyboardType={'NUMBER'}
                                    maxLength={10}
                                    refArr={[refPhone, refPass]}
                                    orderRef={1}
                                    textContentType={'telephoneNumber'}
                                    inputAccessoryViewID={'inputAccessoryViewID1'}
                                />
                                <MyTextInput
                                    ref={refPass}
                                    value={pass}
                                    leftIcon={ICONS.LOCK}
                                    placeHolder={Languages.login.password}
                                    containerInput={styles.inputPass}
                                    onChangeText={onChangeText}
                                    isPassword
                                    maxLength={50}
                                    refArr={[refPhone, refPass]}
                                    orderRef={2}
                                    inputAccessoryViewID={'inputAccessoryViewID2'}
                                />
                                <View style={styles.rowInfo}>
                                    <View style={styles.row}>
                                        <Touchable style={styles.checkbox} onPress={onChangeChecked}>
                                            {checkbox}
                                        </Touchable>
                                        <Text style={styles.txtSave}>{Languages.login.saveInfo}</Text>
                                    </View>
                                    <Touchable onPress={onNavigateForgotPwd}>
                                        <Text style={styles.txtForgot}>{Languages.login.forgotPwd}</Text>
                                    </Touchable>
                                </View>
                                <Button label={Languages.authentication.login} isLowerCase onPress={onLoginPhone} style={styles.buttonLoginContainer} buttonStyle={BUTTON_STYLES.GREEN} />
                            </View>
                        </View>
                        <FooterItem />
                    </View>
                </ScrollViewWithKeyboard>
                {isLoading && <MyLoading isOverview />}
            </SafeAreaView>
        </BackgroundTienNgay>

    );
});

export default Login;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        width: SCREEN_WIDTH,
        paddingHorizontal: 16,
        alignItems: 'flex-end',
        marginTop: STATUSBAR_HEIGHT + PADDING_TOP
    },
    wrapContent: {
        paddingHorizontal: 16,
        flex: 1,
        paddingBottom: PADDING_BOTTOM
    },
    wrapLogo: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 0.2
    },
    logo: {
        width: 200,
        height: 50,
        resizeMode: 'contain'
    },
    loginTextStyle: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_17,
        fontSize: Configs.FontSize.size20,
        paddingBottom: 8
    },
    inputPhone: {
        borderRadius: CommonStyle.borderRadiusSingleLineInput,
        height: Configs.FontSize.size50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    inputPass: {
        marginTop: 20,
        borderRadius: CommonStyle.borderRadiusSingleLineInput,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: Configs.FontSize.size50
    },
    rowInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        alignItems: 'flex-end',
        marginHorizontal: 4
    },
    wrapIcon: {
        flexDirection: 'row',
        marginTop: 24,
        marginBottom: Configs.IconSize.size30,
        justifyContent: 'center'
    },
    txtForgot: {
        ...Styles.typography.regular,
        color: COLORS.RED_2
    },
    txtSave: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_13,
        marginLeft: 8
    },
    txtRegisterNow: {
        ...Styles.typography.medium,
        color: COLORS.GREEN_2
    },
    txtHaveAccount: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_13
    },
    button: {
        backgroundColor: COLORS.GREEN,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        paddingVertical: 15
    },
    wrapText: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 24
    },
    wrapLine: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    line: {
        flex: 1,
        borderTopColor: COLORS.GRAY_16,
        borderTopWidth: 1
    },
    txtOr: {
        ...Styles.typography.regular,
        paddingHorizontal: 12,
        color: COLORS.GRAY_13
    },
    buttonLoginContainer: {
        marginTop: 24
    },
    wrapAll: {
        flex: 1,
        paddingBottom: PADDING_BOTTOM
    },
    checkbox: {
        justifyContent: 'flex-end'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    circle: {
        ...Styles.shadow,
        width: 50,
        height: 50,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10
    },
    bottom: {
        justifyContent: 'flex-start',
        flex: 1
    },
    content: {
        flex: 0.4,
        justifyContent: 'center'
    },
    hisLop: {
        paddingVertical: 10,
        paddingLeft: 10
    }
});
