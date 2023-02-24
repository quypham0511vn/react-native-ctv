import { observer } from 'mobx-react';
import React, {
    useCallback, useRef,
    useState
} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text, View
} from 'react-native';

import { ICONS } from '@/assets/icons/constant';
import { Configs, PADDING_BOTTOM } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { Button, Touchable } from '@/components';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import MyLoading from '@/components/MyLoading';
import { useAppStore } from '@/hooks';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import FormValidate from '@/utils/FormValidate';
import ScrollViewWithKeyboard from '@/components/KeyboardAwareView';
import BackgroundTienNgay from '@/components/BackgroundTienNgay';
import HeaderAuthn from '@/components/HeaderAuthn';

const ForgotPwd = observer(() => {

    const [phone, setPhone] = useState<any>();
    const [isLoading, setLoading] = useState<boolean>(false);
    const { apiServices } = useAppStore();
    const refPhone = useRef<TextFieldActions>(null);
    const [disable, setDisable] = useState<boolean>(false);

    const onChangeText = useCallback((text: string) => {
        setPhone(text);
        if (phone !== '') {
            setDisable(true);
        } else {
            setDisable(false);
        }
    }, [phone]);

    const onSendOtp = useCallback(async () => {
        const errMsgPwd = FormValidate.passConFirmPhone(phone);
        refPhone.current?.setErrorMsg(errMsgPwd);
        if (`${errMsgPwd}`.length === 0) {
            setLoading(true);
            const res = await apiServices.auth.otpResetPwd(phone);
            if (res.success) {
                setLoading(false);
                setTimeout(() => {
                    Navigator.pushScreen(ScreenNames.otpSignUp, {
                        phone,
                        data: res.data,
                        isForgotPwd: true
                    });
                }, 300);
            }
            setLoading(false);
        }
    }, [apiServices.auth, phone]);

    const onLoginNow = useCallback(async () => {
        Navigator.navigateScreen(ScreenNames.login);
    }, []);

    return (
        <BackgroundTienNgay>
            <SafeAreaView style={styles.container}>
                <HeaderAuthn />
                <View style={styles.wrapContent}>
                    <ScrollViewWithKeyboard>
                        <View style={styles.wrapInput}>
                            <Text style={styles.textScreen}>{Languages.forgotPwd.enterPhone}</Text>
                            <View style={styles.loginNow}>
                                <Text style={styles.hasAccStyle}>{Languages.forgotPwd.haveAccount}</Text>
                                <Touchable onPress={onLoginNow}>
                                    <Text style={styles.textLogin}>{Languages.forgotPwd.loginNow}</Text>
                                </Touchable>
                            </View>
                            <MyTextInput
                                label={Languages.login.phoneNumber}
                                ref={refPhone}
                                placeHolder={Languages.login.phoneNumber}
                                leftIcon={ICONS.USER}
                                value={phone}
                                onChangeText={onChangeText}
                                keyboardType='NUMBER'
                                textContentType={'telephoneNumber'}
                                orderRef={1}
                                refArr={[refPhone]}
                                inputAccessoryViewID={'inputAccessoryViewID'}
                                containerInput={styles.containerInput}
                                optional
                            />
                        </View>

                        <View style={styles.wrapBt}>
                            <Button onPress={onSendOtp}
                                label={Languages.forgotPwd.btnOtp} isLowerCase
                                buttonStyle={BUTTON_STYLES.GREEN} />
                        </View>
                    </ScrollViewWithKeyboard>
                </View>
                {isLoading && <MyLoading isOverview />}
            </SafeAreaView>
        </BackgroundTienNgay>
    );
});

export default ForgotPwd;
const styles = StyleSheet.create({
    container: {
        flex: 1
        // paddingBottom: PADDING_BOTTOM,
    },
    wrapContent: {
        flex: 1,
        paddingHorizontal: 16
    },
    wrapInput: {
        marginTop: Configs.IconSize.size40
    },
    textPass: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_7,
        marginBottom: 15
    },
    wrapBt: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 25,
        alignItems: 'center'
    },
    test: {
        height: 45,
        justifyContent: 'center'
    },
    bottom: {
        justifyContent: 'flex-start',
        flex: 1
    },
    content: {
        flex: 2,
        justifyContent: 'center'
    },
    hisLop: {
        paddingVertical: 10,
        paddingLeft: 10
    },
    textScreen: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_17,
        fontSize: Configs.FontSize.size20
    },
    loginNow: {
        flexDirection: 'row',
        marginTop: 8,
        paddingBottom: 24
    },
    textLogin: {
        ...Styles.typography.medium,
        color: COLORS.GREEN_2
    },
    hasAccStyle: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_13
    },
    containerInput: {
        height: Configs.FontSize.size45
    }
});
