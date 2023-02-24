import PasscodeAuth from '@el173/react-native-passcode-auth';
import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { LINKS, STORE_LUCKY_LOTT } from '@/api/constants';
import IcBell from '@/assets/images/ic_bell.svg';
import IcGroup from '@/assets/images/ic_manage_group.svg';
import IcTienNgay from '@/assets/images/ic_logo_tien_ngay_home.svg';
import IcMoney from '@/assets/images/ic_money.svg';
import IcVPS from '@/assets/images/ic_vps.svg';
import IcFlower from '@/assets/images/ic_flower.svg';
import IcReason0 from '@/assets/images/ic_reason0.svg';
import IcReason1 from '@/assets/images/ic_reason1.svg';
import IcReason2 from '@/assets/images/ic_reason2.svg';
import IcReason3 from '@/assets/images/ic_reason3.svg';

import { BOTTOM_HEIGHT, Configs, PADDING_BOTTOM, PADDING_TOP, STATUSBAR_HEIGHT } from '@/commons/Configs';
import {
    ENUM_BIOMETRIC_TYPE,
    ENUM_PROVIDERS_SERVICE,
    STATE_AUTH_ACC,
    TYPE_FORM_ACCOUNT,
    TYPE_RESIZE,
    TYPE_SERVICE_INFO,
    TYPE_TYPE_ACCOUNT
} from '@/commons/constants';
import Languages from '@/commons/Languages';
import ScreenNames, { TabNames, TabNamesArray } from '@/commons/ScreenNames';
import { Touchable } from '@/components';
import { Button } from '@/components/elements/button';
import { MyImageView } from '@/components/image';
import { useAppStore } from '@/hooks';
// import AnalyticsUtils from '@/utils/AnalyticsUtils';
import SessionManager from '@/managers/SessionManager';
import { BaseModel } from '@/models/base-model';
import { NewsModel } from '@/models/news';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import { IconSize } from '@/theme/iconsize';
import AnalyticsUtils from '@/utils/AnalyticsUtils';
import DateUtils from '@/utils/DateUtils';
import ScreenUtils, { SCREEN_WIDTH } from '@/utils/ScreenUtils';
import Utils from '@/utils/Utils';
import NotificationListener from './NotificationListener';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import MyLoading from '@/components/MyLoading';
import BackgroundTienNgayHome from '@/components/BackgroundTienNgayHome';
import { PersonalReportModel } from '@/models/common';
import ToastUtils from '@/utils/ToastUtils';
import IcAvatar from '@/assets/images/ic_avatar.svg';
import { UserInfoModel } from '@/models/user-model';
import PopupUpdateVersion from '@/components/PopupUpdateVersion';
import { PopupActions } from '@/components/popup/types';

const Home = observer(() => {
    const {
        apiServices,
        notificationManager,
        userManager,
        appManager,
        fastAuthInfoManager
    } = useAppStore();

    const [news, setNews] = useState<NewsModel[]>();
    const [insurances, setInsurances] = useState<NewsModel[]>();
    const [dataReport, setDataReport] = useState<PersonalReportModel>();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isRefreshing] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserInfoModel | undefined>(SessionManager.userInfo);

    const isFocused = useIsFocused();

    const popupAccVerify = useRef<PopupActions>(null);

    useEffect(() => {
        if (isFocused) {
            ScreenUtils.setStatusBarStyle(false);
            fetchPersonalReport();
            !appManager.isAppInReview && fetchDataServicesInfo();
            fetchUserInfo();
            if (userInfo?.status_verified !== STATE_AUTH_ACC.WAIT &&
                userInfo?.status_verified !== STATE_AUTH_ACC.VERIFIED &&
                !SessionManager.isLogout
            ) {
                popupAccVerify.current?.show();
            }

        } else {
            popupAccVerify.current?.hide?.();
        }
    }, [isFocused, userInfo?.status_verified]);

    useEffect(() => {
        AnalyticsUtils.trackEvent(ScreenNames.home);
        if (
            fastAuthInfoManager.isEnableFastAuth &&
            fastAuthInfoManager.supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID
        ) {
            PasscodeAuth.authenticate(Languages.quickAuThen.description)
                .then(() => {
                    onLoginSuccess();
                })
                .catch(() => { });
        }
    }, [fastAuthInfoManager.isEnableFastAuth, fastAuthInfoManager.supportedBiometry]);

    const fetchUserInfo = useCallback(async () => {
        if (SessionManager?.accessToken) {
            const res = await apiServices.auth.getUserInfo();
            if (res?.success) {
                const dataUser = res.data as UserInfoModel;
                SessionManager.setUserInfo({ ...userInfo, ...dataUser } as UserInfoModel);
                setUserInfo({ ...userManager.userInfo, ...dataUser });
            }
        }
    }, [apiServices.auth, userInfo, userManager.userInfo]);

    const fetchPersonalReport = useCallback(async () => {
        if (userManager?.userInfo || fastAuthInfoManager?.isEnableFastAuth) {
            setLoading(true);
            const resReport = await apiServices.auth.getPersonalReport();
            setLoading(false);
            if (resReport.success) {
                setDataReport(resReport.data as PersonalReportModel);
            }
        }
    }, [apiServices.auth, fastAuthInfoManager?.isEnableFastAuth, userManager?.userInfo]);

    const fetchDataServicesInfo = useCallback(async () => {
        setLoading(true);
        const resInsurances = await apiServices.common.getInsurances();
        if (resInsurances.success) {
            setInsurances(resInsurances.data as NewsModel[]);
        }

        const resNews = await apiServices.common.getNews();
        setLoading(false);
        if (resNews.success) {
            const dataNews = resNews.data as NewsModel[];
            if (appManager.isAppInReview) {
                setNews(dataNews
                    .filter((item) => !item.title_vi.toLowerCase().includes(TYPE_SERVICE_INFO.LOAN) &&
                        !item.content_vi.toLowerCase().includes(TYPE_SERVICE_INFO.LOAN) &&
                        !item.content_vi.toLowerCase().includes(TYPE_SERVICE_INFO.GRAND_OPENING) &&
                        !item.title_vi.toLowerCase().includes(TYPE_SERVICE_INFO.VP_BANK))
                    .sort((a, b) => b.created_at - a.created_at)
                );
            } else {
                setNews(dataNews.sort((a, b) => b.created_at - a.created_at));
            }
        }

    }, [apiServices.common]);

    const navigateNotify = useCallback(() => {
        if (userManager?.userInfo) {
            setTimeout(() => {
                Navigator.navigateScreen(ScreenNames.notify);
            }, 200);
        } else {
            Navigator.navigateToDeepScreen([ScreenNames.auth], ScreenNames.login, { stack: TabNames.homeTab, screen: ScreenNames.notify });
        }
    }, [userManager?.userInfo]);

    const onLoginSuccess = useCallback(() => {
        fastAuthInfoManager.setEnableFastAuthentication(false);
        setTimeout(() => {
            if (SessionManager.lastTabIndexBeforeOpenAuthTab) {
                Navigator.navigateToDeepScreen(
                    [ScreenNames.tabs],
                    TabNamesArray[SessionManager.lastTabIndexBeforeOpenAuthTab]
                );
            }
        }, 100);
    }, [fastAuthInfoManager]);

    const onNavigateLoan = useCallback(() => {
        if (!userManager.userInfo || fastAuthInfoManager.isEnableFastAuth) {
            if (userManager.userInfo?.form === TYPE_FORM_ACCOUNT.GROUP && userManager.userInfo?.account_type === TYPE_TYPE_ACCOUNT.GROUP) {
                SessionManager.lastTabIndexBeforeOpenAuthTab = 4;
            } else {
                SessionManager.lastTabIndexBeforeOpenAuthTab = 2;
            }
            Navigator.navigateScreen(ScreenNames.auth);
        } else if (userManager.userInfo?.form === TYPE_FORM_ACCOUNT.GROUP && userManager.userInfo?.account_type === TYPE_TYPE_ACCOUNT.GROUP) {
            Navigator.navigateScreen(ScreenNames.groupManager);
        } else {
            Navigator.navigateToDeepScreen([ScreenNames.tabs], TabNames.loanTab);
        }
    }, [fastAuthInfoManager.isEnableFastAuth, userManager.userInfo]);

    const onGotoAccount = useCallback(() => {
        if (!userManager.userInfo || fastAuthInfoManager.isEnableFastAuth) {
            SessionManager.lastTabIndexBeforeOpenAuthTab = TabNamesArray.length - 1;
            Navigator.navigateScreen(ScreenNames.auth);
        } else {
            Navigator.navigateToDeepScreen([ScreenNames.tabs], TabNames.accountTab);
        }
    }, [fastAuthInfoManager.isEnableFastAuth, userManager.userInfo]);

    const renderProfile = useMemo(() => (
        <Touchable style={styles.wrapInfo} onPress={onGotoAccount}>
            {userInfo?.avatar ? (
                <MyImageView
                    style={styles.imageAvatar}
                    imageUrl={userInfo?.avatar}
                />
            ) : (
                <>{userManager?.userInfo?.token_app && <IcAvatar style={styles.imageAvatar} />}</>
            )}
            <>
                {userInfo?.ctv_name ? (
                    <Text style={styles.txtName}>{userInfo?.ctv_name}</Text>
                ) : (<>{userInfo?.token_app ? null : <IcTienNgay />}</>)}
            </>
        </Touchable>
    ), [onGotoAccount, userInfo?.avatar, userInfo?.ctv_name, userInfo?.token_app, userManager?.userInfo?.token_app]);

    const renderNewsItem = useCallback(({ item }: { item: NewsModel }) => {
        const navigate = () => {
            Navigator.pushScreen(ScreenNames.myWebview, { item, uri: false });
        };
        const newsItemStyle = { width: SCREEN_WIDTH / 1.7 };

        const newsAvatarStyle = {
            width: newsItemStyle.width,
            height: (newsItemStyle.width / 215) * 104
        };

        return (
            <Touchable style={[styles.newsItem, newsItemStyle]} onPress={navigate}>
                <MyImageView
                    imageUrl={item.image}
                    resizeMode={TYPE_RESIZE.COVER}
                    style={[styles.communicationImage, newsAvatarStyle]}
                />
                <Text style={styles.txtCommunityDes}>{' '}{DateUtils.getLongFromDate(item.created_at)}</Text>
                <Text style={styles.txtCommunityTitle} numberOfLines={2}>{item.title_vi}{' '}</Text>
            </Touchable>
        );
    }, []);

    const renderSection = useCallback((title: string) => (
        <Text style={styles.txtSection}>{title.toUpperCase()}</Text>
    ), []);

    const renderServiceItem = useCallback((icon: any, title: string, type: any) => {
        const navigate = () => {
            if (type === ENUM_PROVIDERS_SERVICE.LOTTERY) {
                Utils.openURL(STORE_LUCKY_LOTT);
            }
            else if (type === ENUM_PROVIDERS_SERVICE.VPS) {
                Utils.openURL(LINKS.VPS);
            }
            else if (!userManager?.userInfo || fastAuthInfoManager?.isEnableFastAuth) {
                SessionManager.lastTabIndexBeforeOpenAuthTab = 0;
                Navigator.navigateScreen(ScreenNames.auth);
            } else {
                setTimeout(() => {
                    ToastUtils.showMsgToast(Languages.common.functionDeveloping);
                }, 200);
            }
        };

        return (
            <Touchable style={styles.cardService} radius={10} onPress={navigate}>
                {icon}
                <Text style={styles.txtService}>{title}</Text>
            </Touchable>
        );
    }, [fastAuthInfoManager?.isEnableFastAuth, userManager?.userInfo]);

    const renderBadgeCount = useMemo(() => {
        const number = notificationManager.unReadNotifyCount;
        return number > 0 ? (
            <View style={styles.notifyBadge}>
                <Text style={styles.count}>{number}</Text>
            </View>
        ) : null;
    }, [notificationManager.unReadNotifyCount]);

    const renderCreateBillButton = useCallback((text: string, leftIcon: any, onPress?: () => void) => (
        <Touchable radius={60} style={styles.buttonLoanContainer} onPress={onPress}>
            {leftIcon}
            <Text style={styles.textBtnLoanStyle}>{text}</Text>
        </Touchable>
    ), []);

    const renderButtonAuthn = useCallback((label: string, buttonStyle: any, onPress?: () => void) => (
        <Button label={label} buttonStyle={buttonStyle} buttonContainer={styles.buttonAuthnContainer} radius={5} isLowerCase onPress={onPress} />
    ), []);

    const onLogin = useCallback(() => {
        Navigator.navigateScreen(ScreenNames.auth);
    }, []);

    const onLogUp = useCallback(() => {
        Navigator.navigateToDeepScreen([ScreenNames.auth], ScreenNames.signUp);
    }, []);

    const renderItemContentTop = useCallback((label: string, mount: string) => (
        <View style={styles.itemContentTopContainer}>
            <Text style={styles.itemContentTopValueStyle}>{mount}</Text>
            <Text style={styles.itemContentTopLabelStyle}>{label}</Text>
        </View>
    ), []);

    const keyExtractor = useCallback((item: BaseModel) => `${item.id} ${item._id?.$oid}`, []);

    const renderInsuranceItem = useCallback(({ item }: { item: NewsModel }) => {
        const navigate = () => {
            Navigator.pushScreen(ScreenNames.myWebview, { item, uri: false });
        };
        return (
            <Touchable style={styles.insuranceItem} onPress={navigate}>
                <MyImageView
                    imageUrl={item.image_mobile}
                    resizeMode={TYPE_RESIZE.COVER}
                    style={styles.insuranceImage}
                />
            </Touchable>
        );
    }, []);

    const renderInsurances = useMemo(() => (
        <>
            {renderSection(Languages.home.insurance)}
            <FlatList
                data={insurances}
                contentContainerStyle={styles.insuranceContainer}
                renderItem={renderInsuranceItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                {...{ keyExtractor }}
            />
        </>
    ), [insurances, keyExtractor, renderInsuranceItem, renderSection]);

    const renderNews = useMemo(() => (
        <>
            {(news?.length || 0) > 0 && renderSection(Languages.home.communication)}
            <FlatList
                data={news}
                contentContainerStyle={styles.communicationContainer}
                renderItem={renderNewsItem}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                {...{ keyExtractor }}
            />
        </>
    ), [renderSection, news, renderNewsItem, keyExtractor]);

    const renderLoan = useMemo(() => (
        <>
            {
                (!userManager.userInfo || fastAuthInfoManager.isEnableFastAuth) ?
                    <View style={styles.wrapAuthnView}>
                        <Text style={styles.contentAuthn}>{Languages.home.content}</Text>
                        <View style={styles.buttonAllAuthnContainer}>
                            {renderButtonAuthn(Languages.common.logIn, BUTTON_STYLES.LIGHT_GREEN, onLogin)}
                            {renderButtonAuthn(Languages.common.logUp, BUTTON_STYLES.GREEN, onLogUp)}
                        </View>
                    </View> :
                    <View style={styles.itemContentTopAuthnContainer}>
                        <View style={styles.labelPayedMountContainer}>
                            <Text style={styles.valuePayedMountStyle}>{dataReport?.tong_tien_thanh_toan}<Text style={styles.vndStyle}>{' '}{Languages.home.vnd.toLocaleUpperCase()}</Text></Text>
                            <Text style={styles.labelPayedMountStyle}>{Languages.home.payedMount}</Text>
                        </View>
                        <View style={styles.viewTwoLineTopContainer}>
                            {renderItemContentTop(Languages.home.productCreate, dataReport?.san_pham_da_tao || '0')}
                            {renderItemContentTop(Languages.home.productSuccess, dataReport?.san_pham_da_tao_thanh_cong || '0')}
                        </View>
                    </View>
            }
            <View style={styles.marginHorizontal}>
                {userManager.userInfo?.form === TYPE_FORM_ACCOUNT.GROUP && userManager.userInfo?.account_type === TYPE_TYPE_ACCOUNT.GROUP ?
                    renderCreateBillButton(Languages.home.groupManagement, <IcGroup {...IconSize.size30_30} />, onNavigateLoan) :
                    renderCreateBillButton(Languages.home.loanNow, <IcMoney {...IconSize.size30_30} />, onNavigateLoan)
                }
            </View>
        </>
    ), [dataReport?.san_pham_da_tao, dataReport?.san_pham_da_tao_thanh_cong, dataReport?.tong_tien_thanh_toan, fastAuthInfoManager.isEnableFastAuth, onLogUp, onLogin, onNavigateLoan, renderButtonAuthn, renderCreateBillButton, renderItemContentTop, userManager.userInfo]);

    const onRefresh = useCallback(async () => {
        fetchPersonalReport();
        !appManager.isAppInReview && fetchDataServicesInfo();
    }, [appManager.isAppInReview, fetchDataServicesInfo, fetchPersonalReport]);

    const onConfirmAcc = useCallback(() => {
        popupAccVerify.current?.hide?.('');
        Navigator.pushScreen(ScreenNames.identityAuthn);
    }, []);

    const renderPopupVerifyAcc = useCallback((describe: string, confirmText: string) => (
        <PopupUpdateVersion ref={popupAccVerify} onConfirm={onConfirmAcc} showBtn
            textConfirm={confirmText} title={Languages.home.accVerify}
            description={describe} />
    ), [onConfirmAcc]);

    const renderReasonItem = useCallback((icon: any, title: string, des: string) => {
        return <View style={styles.reasonContainer}>
            {icon}
            <Text style={styles.reasonTitleText}>{title}</Text>
            <Text style={styles.reasonDesText}>{des}</Text>
        </View>
    }, [])

    return (
        <NotificationListener>
            <BackgroundTienNgayHome>
                <View style={styles.container}>
                    <View style={styles.headerPinContent}>
                        {renderProfile}
                        <Touchable onPress={navigateNotify} style={styles.notifyContainer}>
                            <IcBell {...IconSize.size25_25} />
                            {renderBadgeCount}
                        </Touchable>
                    </View>
                    <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={onRefresh}
                                tintColor={COLORS.GREEN}
                                colors={[COLORS.GREEN, COLORS.RED, COLORS.GRAY_1]}
                            />}
                    >
                        {renderLoan}

                        {!appManager.isAppInReview && <>
                            {renderSection(Languages.service.utility)}
                            <View style={styles.row}>
                                {renderServiceItem(<IcFlower {...IconSize.size40_40} />, Languages.service.luckyLott, ENUM_PROVIDERS_SERVICE.LOTTERY)}
                                {renderServiceItem(<IcVPS {...IconSize.size40_40} />, Languages.service.VPS, ENUM_PROVIDERS_SERVICE.VPS)}
                            </View>
                            {renderInsurances}
                        </>}
                        {renderSection(Languages.home.whyVFC)}
                        {renderReasonItem(<IcReason0 />, Languages.home.reasons[0], Languages.home.reasonsDes[0])}
                        {renderReasonItem(<IcReason1 />, Languages.home.reasons[1], Languages.home.reasonsDes[1])}
                        {renderReasonItem(<IcReason2 />, Languages.home.reasons[2], Languages.home.reasonsDes[2])}
                        {renderReasonItem(<IcReason3 />, Languages.home.reasons[3], Languages.home.reasonsDes[3])}
                        {renderNews}
                    </ScrollView>
                    {isLoading && <MyLoading isOverview />}
                    {userInfo?.status_verified === STATE_AUTH_ACC.UN_VERIFIED && renderPopupVerifyAcc(Languages.home.accUnVerifyDescribe, Languages.home.verifyNow)}
                    {userInfo?.status_verified === STATE_AUTH_ACC.RE_VERIFIED && renderPopupVerifyAcc(Languages.home.accReVerifyDescribe, Languages.home.reVerify)}
                </View>
            </BackgroundTienNgayHome>
        </NotificationListener>
    );
});

export default Home;

const AVATAR_SIZE = 36;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        paddingBottom: BOTTOM_HEIGHT
    },
    row: {
        flexDirection: 'row',
        marginHorizontal: 10,
        alignItems: 'flex-start'
    },
    headerPinContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginHorizontal: 20,
        paddingTop: STATUSBAR_HEIGHT + PADDING_TOP
    },
    notifyContainer: {
        paddingRight: 2
    },
    notifyBadge: {
        position: 'absolute',
        right: 0,
        width: 20,
        height: 20,
        borderRadius: 11,
        backgroundColor: COLORS.RED,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardService: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10
    },
    txtService: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size12,
        marginTop: 10,
        textAlign: 'center'
    },
    txtCommunityTitle: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_13,
        paddingHorizontal: 8,
        paddingVertical: 5
    },
    txtCommunityDes: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        color: COLORS.GRAY_6,
        paddingTop: 8,
        paddingHorizontal: 8
    },
    txtSection: {
        ...Styles.typography.medium,
        color: COLORS.DARK_GRAY,
        marginTop: 24,
        marginBottom: 12,
        marginHorizontal: 16
    },
    marginHorizontal: {
        marginHorizontal: 16
    },
    insuranceContainer: {
        paddingLeft: 10
    },
    insuranceItem: {
        borderRadius: 10,
        marginHorizontal: 5,
        overflow: 'hidden'
    },
    communicationContainer: {
        paddingLeft: 15,
        paddingBottom: 10
    },
    newsItem: {
        ...Styles.shadow,
        borderRadius: 10,
        marginRight: 8,
        marginBottom: PADDING_BOTTOM
    },
    communicationImage: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    insuranceImage: {
        width: SCREEN_WIDTH / 1.7,
        height: (SCREEN_WIDTH / 1.7 / 215) * 104,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    count: {
        ...Styles.typography.medium,
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size12
    },
    wrapInfo: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    imageAvatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        borderWidth: 1,
        borderColor: COLORS.WHITE,
        marginRight: 16
    },
    txtName: {
        ...Styles.typography.medium,
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size16
    },
    wrapAuthnView: {
        ...Styles.shadow,
        backgroundColor: COLORS.WHITE,
        marginHorizontal: 16,
        borderRadius: 12,
        paddingTop: 19,
        paddingHorizontal: 16
    },
    buttonAllAuthnContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 19
    },
    buttonAuthnContainer: {
        width: '48%'
    },
    buttonLoanContainer: {
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: 28,
        backgroundColor: COLORS.GREEN_2,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        marginTop: 24
    },
    contentAuthn: {
        ...Styles.typography.medium,
        paddingBottom: 16,
        color: COLORS.GRAY_13
    },
    textBtnLoanStyle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        color: COLORS.WHITE,
        textAlign: 'center',
        flex: 1
    },
    itemContentTopContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1
    },
    itemContentTopLabelStyle: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        color: COLORS.GRAY_17,
        paddingTop: 2
    },
    itemContentTopValueStyle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size20,
        color: COLORS.GRAY_17
    },
    viewTwoLineTopContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingTop: 8
    },
    itemContentTopAuthnContainer: {
        ...Styles.shadow,
        backgroundColor: COLORS.WHITE,
        marginHorizontal: 16,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 16,
        alignItems: 'center'
    },
    labelPayedMountStyle: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_17
    },
    valuePayedMountStyle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size24,
        color: COLORS.GRAY_17
    },
    labelPayedMountContainer: {
        alignItems: 'center'
    },
    vndStyle: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_17
    },
    reasonContainer: {
        ...Styles.shadow,
        marginHorizontal: 15,
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingTop: 15,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems:'center',
        borderRadius: 10
    },
    reasonTitleText: {
        ...Styles.typography.medium,
        color: COLORS.BLACK,
        marginTop: 8,
        marginBottom: 10
    },
    reasonDesText: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_17,
    },
});
