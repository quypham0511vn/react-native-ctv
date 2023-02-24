import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Languages from '@/commons/Languages';
import { HeaderBar, Touchable } from '@/components';
import { COLORS, Styles } from '@/theme';
import FacebookIcon from '@/assets/images/ic_facebook.svg';
import GoogleIcon from '@/assets/images/ic_google.svg';
import AppleIcon from '@/assets/images/ic_apple.svg';
import NotLinkIcon from '@/assets/images/ic_black_not_linked.svg';
import LinkedIcon from '@/assets/images/ic_green_checked.svg';
import { ENUM_PROVIDER } from '@/commons/constants';
import { useAppStore } from '@/hooks';
import { loginWithApple, loginWithFacebook, loginWithGoogle } from '@/utils/SocialAuth';
import { UserInfoModel } from '@/models/user-model';
import ToastUtils from '@/utils/ToastUtils';
import { isIOS } from '@/commons/Configs';
import BackgroundTienNgay from '@/components/BackgroundTienNgay';
import ScrollViewWithKeyboard from '@/components/KeyboardAwareView';

const LinkAccountSocial = observer(() => {
    const { apiServices, userManager } = useAppStore();

    const fetchLinkSocial = useCallback(async (type: string, id: string) => {
        const res = await apiServices.auth.linkSocialAccount(type, id);
        if (res?.success) {
            ToastUtils.showSuccessToast(res?.message || '');
            const data = userManager?.userInfo as UserInfoModel;
            switch (type) {
                case ENUM_PROVIDER.FACEBOOK:
                    userManager.updateUserInfo({
                        ...data,
                        id_fblogin: id
                    });
                    break;
                case ENUM_PROVIDER.GOOGLE:
                    userManager.updateUserInfo({
                        ...data,
                        id_google: id
                    });
                    break;
                case ENUM_PROVIDER.APPLE:
                    userManager.updateUserInfo({
                        ...data,
                        user_apple: id
                    });
                    break;
                default:
                    break;
            }
        } else { ToastUtils.showErrorToast(res?.message || ''); }
    }, [apiServices.auth, userManager]);

    const onLoginGoogle = useCallback(async () => {
        const userInfo = await loginWithGoogle();
        if (userInfo) fetchLinkSocial(ENUM_PROVIDER.GOOGLE, userInfo?.user?.id);
    }, [fetchLinkSocial]);

    const onLoginFacebook = useCallback(async () => {
        const data = await loginWithFacebook();
        if (data?.userID) fetchLinkSocial(ENUM_PROVIDER.FACEBOOK, data?.userID);
    }, [fetchLinkSocial]);

    const onLoginApple = useCallback(async () => {
        const data = await loginWithApple();
        if (data?.user) fetchLinkSocial(ENUM_PROVIDER.APPLE, data?.user);
    }, [fetchLinkSocial]);

    const renderTitleLink = useCallback((status?: boolean) =>
        <>
            {status ? (<Text style={styles.statusGreen}>{Languages.linkAccount.linked}</Text>) : (
                <Text style={styles.statusRed}>{Languages.linkAccount.notLink}</Text>)}
        </>, []);

    const renderIcon = useCallback((status?: boolean) =>
        <>
            {status ? (
                <View style={styles.circleGreen}><LinkedIcon /></View>) :
                (<View style={styles.circleRed}><NotLinkIcon /></View>)}
        </>, []);

    const renderItem = useCallback(
        (icon?: any, title?: string, status?: boolean) => {
            const _onPress = () => {
                switch (title) {
                    case Languages.linkAccount.fb:
                        onLoginFacebook();
                        break;
                    case Languages.linkAccount.gg:
                        onLoginGoogle();
                        break;
                    case Languages.linkAccount.apple:
                        onLoginApple();
                        break;
                    default:
                        break;
                }
            };
            return (
                <Touchable style={styles.wrapItem} onPress={_onPress} disabled={status} >
                    <View style={styles.row}>
                        {icon}
                        <View style={styles.wrapText}>
                            <Text style={styles.title}>
                                {Languages.linkAccount.link} {title}
                            </Text>
                            {renderTitleLink(status)}
                        </View>
                    </View>
                    {renderIcon(status)}
                </Touchable>
            );
        }, [onLoginApple, onLoginFacebook, onLoginGoogle, renderIcon, renderTitleLink]);

    const renderAppleStore = useCallback(() => {
        if (isIOS) {
            return renderItem(<AppleIcon width={28} height={28} />, Languages.linkAccount.apple, !!userManager.userInfo?.user_apple);
        }
        return null;
    }, [renderItem, userManager.userInfo?.user_apple]);

    return (
        <BackgroundTienNgay>
            <View style={styles.container}>
                <HeaderBar title={Languages.linkAccount.header} isLowerCase/>
                <ScrollViewWithKeyboard style={styles.wrapContent}>
                    {renderItem(<FacebookIcon width={28} height={28} />, Languages.linkAccount.fb, !!userManager.userInfo?.id_fblogin)}
                    {renderItem(<GoogleIcon width={28} height={28} />, Languages.linkAccount.gg, !!userManager.userInfo?.id_google)}
                    {renderAppleStore()}
                </ScrollViewWithKeyboard>
            </View>
        </BackgroundTienNgay>
    );
});
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapContent: {
        paddingTop: 24
    },
    wrapItem: {
        marginHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: COLORS.GRAY_15,
        borderWidth: 1,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 16,
        paddingVertical: 10
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    wrapText: {
        marginLeft: 22
    },
    title: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_13,
        paddingTop: 2
    },
    statusRed: {
        ...Styles.typography.regular,
        color: COLORS.RED_2
    },
    statusGreen: {
        ...Styles.typography.regular,
        color: COLORS.GREEN_2
    },
    circleRed: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.GRAY_15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    circleGreen: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.GREEN_2,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default LinkAccountSocial;
