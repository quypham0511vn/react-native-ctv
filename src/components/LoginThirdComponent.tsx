import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';

import { COLORS, Styles } from '@/theme';
import { Configs, isIOS } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { Touchable } from './elements';
import {
    loginWithApple,
    loginWithFacebook,
    loginWithGoogle
} from '@/utils/SocialAuth';
import { LoginWithThirdPartyModel } from '@/models/auth';
import { useAppStore } from '@/hooks';
import { ENUM_PROVIDER } from '@/commons/constants';
import ScreenNames, { TabNamesArray } from '@/commons/ScreenNames';
import Navigator from '@/routers/Navigator';
import { UserInfoModel } from '@/models/user-model';
import SessionManager from '@/managers/SessionManager';
import AppleIcon from '@/assets/images/ic_apple.svg';
import FacebookIcon from '@/assets/images/ic_facebook.svg';
import GoogleIcon from '@/assets/images/ic_google.svg';
import MyLoading from './MyLoading';

const LoginThirdComponent = () => {
    const {
        apiServices,
        userManager,
        fastAuthInfoManager: fastAuthInfo,
        appManager
    } = useAppStore();

    const [isLoading, setLoading] = useState<boolean>(false);

    const initUser = useCallback(
        async (typeLogin: string, providerId: string) => {
            setLoading(true);
            const res = await apiServices?.auth?.loginWithThirdParty(
                typeLogin,
                providerId
            );
            setLoading(false);
            if (res.success) {
                const data = res.data as LoginWithThirdPartyModel;
                if (data?.token_app) {
                    userManager.updateUserInfo(res.data as UserInfoModel);
                    fastAuthInfo.setEnableFastAuthentication(false);
                    setTimeout(() => {
                        if (SessionManager.lastTabIndexBeforeOpenAuthTab) {
                            Navigator.navigateToDeepScreen(
                                [ScreenNames.tabs],
                                TabNamesArray[SessionManager.lastTabIndexBeforeOpenAuthTab]
                            );
                        }
                    }, 100);
                }
                if (!data?.token_app) {
                    // Navigator.pushScreen(ScreenNames.confirmPhoneNumber, {
                    //     id: data?.id
                    // });
                }
            }
        },
        [apiServices?.auth, fastAuthInfo, userManager?.userInfo]
    );

    const onLoginGoogle = useCallback(async () => {
        const userInfo = await loginWithGoogle();
        if (userInfo) initUser(ENUM_PROVIDER.GOOGLE, userInfo?.user?.id);
    }, [initUser]);

    const onLoginFacebook = useCallback(async () => {
        const data = await loginWithFacebook();
        if (data?.userID) initUser(ENUM_PROVIDER.FACEBOOK, data?.userID);
    }, [initUser]);

    const onLoginApple = useCallback(async () => {
        const data = await loginWithApple();
        if (data?.user) initUser(ENUM_PROVIDER.APPLE, data?.user);
    }, [initUser]);

    const renderLoginApple = useMemo(() => {
        if (isIOS) {
            return (
                <Touchable style={styles.circle} onPress={onLoginApple}>
                    <AppleIcon width={25} height={25} />
                </Touchable>
            );
        }
        return null;
    }, [onLoginApple]);

    const renderItem = useCallback(
        (icon: any, _onPress: any, color: string) => (
            <Touchable
                radius={25}
                style={[styles.circle, { backgroundColor: color || COLORS.WHITE }]}
                onPress={_onPress}
            >
                {icon}
            </Touchable>
        ), []);

    return (
        <>
            <View style={styles.bottom}>
                <View style={styles.wrapLine}>
                    <View style={styles.line} />
                    <Text style={styles.txtOr}>{Languages.common.orLoginWith}</Text>
                    <View style={styles.line} />
                </View>
                <View style={styles.wrapIcon}>
                    {renderItem(<GoogleIcon width={25} height={25} />, onLoginGoogle, COLORS.WHITE)}
                    {renderItem(<FacebookIcon width={25} height={25} />, onLoginFacebook, COLORS.WHITE)}
                    {renderLoginApple}
                </View>
            </View>
            {isLoading && <MyLoading isOverview />}
        </>
    );
};

export default LoginThirdComponent;

const styles = StyleSheet.create({
    bottom: {
        justifyContent: 'flex-start',
        flex: 1,
        paddingBottom: 30
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
    wrapIcon: {
        flexDirection: 'row',
        marginTop: 24,
        marginBottom: Configs.IconSize.size30,
        justifyContent: 'center'
    },
    circle: {
        ...Styles.shadow,
        width: 50,
        height: 50,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10
    }
});
