import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo } from 'react';
import Animated, {
    interpolateColor,
    useDerivedValue
} from 'react-native-reanimated';
import TouchID from 'react-native-touch-id';

import { ICONS } from '@/assets/icons/constant';
import { IconTienngay } from '@/assets/icons/icon-tienngay';
import { Configs, isIOS } from '@/commons/Configs';
import { Events } from '@/commons/constants';
import {
    ENUM_BIOMETRIC_TYPE,
    ERROR_BIOMETRIC
} from '@/components/popupFingerprint/types';
import Account from '@/containers/account/Account';
import EditProfile from '@/containers/account/EditProfile';
import IdentityAuthn from '@/containers/account/IdentityAuthn';
import LinkAccountSocial from '@/containers/account/LinkAccountSocial';
import ProfileInfo from '@/containers/account/ProfileInfo';
import ChangePassword from '@/containers/auth/ChangePassword';
import ForgotPwd from '@/containers/auth/ForgotPwd';
import Login from '@/containers/auth/Login';
import LoginWithBiometry from '@/containers/auth/LoginWithBiometry';
import OTPSignUp from '@/containers/auth/OTPSignUp';
import SettingQuickAuth from '@/containers/auth/SettingQuickAuthentication';
import SignUp from '@/containers/auth/SignUp';
import UpdateNewPwd from '@/containers/auth/UpdateNewPwd';
import History from '@/containers/history/History';
import Home from '@/containers/home/Home';
import RequestLoan from '@/containers/loan/RequestLoan';
import MyWebview from '@/containers/MyWebview';
import Notify from '@/containers/Notify';
import Onboarding from '@/containers/Onboarding';
import Splash from '@/containers/Splash';
import { useAppStore } from '@/hooks';
import AnimatedTabBar, {
    TabsConfigsType
} from '@/libs/curved-bottom-navigation-bar/src';
import SessionManager, { DeviceInfos } from '@/managers/SessionManager';
import Navigator from '@/routers/Navigator';
import { COLORS } from '@/theme';
import { EventEmitter } from '@/utils/EventEmitter';
import ScreenNames, { TabNames } from '../commons/ScreenNames';
import LoanBillingList from '@/containers/loan/LoanBillingList';
import GroupManager from '@/containers/account/groupManager/GroupManager';
import StaffComponent from '@/containers/account/groupManager/Staff';
import BonusComponent from '@/containers/account/groupManager/Bonus';
import BankAccount from '@/containers/account/BankAccount';
import IntroCollaborator from '@/containers/account/IntroCollaborator';
import NewsDetail from '@/containers/home/NewsDetail';

const screenOptions = { headerShown: false };
const AUTH_TAB_INDEXES = [1, 2, 3, 4];

const AnimatedIcon = Animated.createAnimatedComponent(IconTienngay);

const CustomIcon = ({
    progress,
    name,
    isCentered,
    size
}: {
    progress: Animated.SharedValue<number>;
    name: string;
    size: number;
    isCentered?: boolean;
}) => {
    const color = useDerivedValue(() =>
        interpolateColor(
            progress.value,
            [0, 1],
            [COLORS.GRAY, isCentered ? COLORS.RED : COLORS.GREEN]
        )
    );
    return <AnimatedIcon name={name} size={size} color={color.value} />;
};

const homeTab: TabsConfigsType = {
    HomeTab: {
        icon: (props) => (
            <CustomIcon name={ICONS.HOME} size={Configs.IconSize.size24} {...props} />
        )
    }
};

const commonTabs: TabsConfigsType = {
    HistoryTab: {
        icon: (props) => (
            <CustomIcon
                name={ICONS.MONEY}
                size={Configs.IconSize.size26}
                {...props}
            />
        )
    },
    AccountTab: {
        icon: (props) => (
            <CustomIcon
                name={ICONS.PROFILE}
                size={Configs.IconSize.size24}
                {...props}
            />
        )
    }
};

const trustTabs: TabsConfigsType = {
    BillingTab: {
        icon: (props) => (
            <CustomIcon name={ICONS.LIST} size={Configs.IconSize.size22} {...props} />
        )
    },
    LoanTab: {
        icon: (props) => (
            <CustomIcon
                name={ICONS.TIENNGAY}
                size={Configs.IconSize.size28}
                isCentered
                {...props}
            />
        )
    }
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

//
const HistoryStack = () => (
    <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name={ScreenNames.history} component={History} />
    </Stack.Navigator>
);

const HomeStack = () => (
    <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name={ScreenNames.home} component={Home} />
        <Stack.Screen name={ScreenNames.notify} component={Notify} />
        <Stack.Screen name={ScreenNames.groupManager} component={GroupManager} />
        <Stack.Screen name={ScreenNames.staff} component={StaffComponent} />
        <Stack.Screen name={ScreenNames.bonus} component={BonusComponent} />
        <Stack.Screen name={ScreenNames.loanBillingList} component={LoanBillingList} />
        <Stack.Screen name={ScreenNames.identityAuthn} component={IdentityAuthn} />
        <Stack.Screen name={ScreenNames.newsDetail} component={NewsDetail} />
    </Stack.Navigator>
);

const BillingStack = () => (
    <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name={ScreenNames.loanBillingList} component={LoanBillingList} />
    </Stack.Navigator>
);

const TabAccount = () => (
    <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name={ScreenNames.account} component={Account} />
        <Stack.Screen name={ScreenNames.groupManager} component={GroupManager} />
        <Stack.Screen name={ScreenNames.staff} component={StaffComponent} />
        <Stack.Screen name={ScreenNames.bonus} component={BonusComponent} />
        <Stack.Screen name={ScreenNames.loanBillingList} component={LoanBillingList} />
        <Stack.Screen name={ScreenNames.SettingQuickAuth} component={SettingQuickAuth} />
        <Stack.Screen name={ScreenNames.changePassword} component={ChangePassword} />
        <Stack.Screen name={ScreenNames.linkAccountSocial} component={LinkAccountSocial} />
        <Stack.Screen name={ScreenNames.profile} component={ProfileInfo} />
        <Stack.Screen name={ScreenNames.editProFile} component={EditProfile} />
        <Stack.Screen name={ScreenNames.bankAccount} component={BankAccount} />
        <Stack.Screen name={ScreenNames.introCollaborator} component={IntroCollaborator} />
        <Stack.Screen name={ScreenNames.identityAuthn} component={IdentityAuthn} />
    </Stack.Navigator>
);

const RootStack = observer(() => {
    const { fastAuthInfoManager, userManager, appManager } = useAppStore();

    const forceLogout = useCallback(() => {
        if(SessionManager.accessToken){
            SessionManager.logout();
            userManager.updateUserInfo();
        }
    }, [userManager.userInfo]);

    useEffect(() => {
        EventEmitter.addListener(Events.LOGOUT, forceLogout);
        return () => EventEmitter.removeListener(Events.LOGOUT, forceLogout);
    }, [forceLogout]);

    useEffect(() => {
        initState();
    }, []);

    const tabBarConfig = useMemo(() =>
        // if (!appManager.isAppInReview) {
        ({ ...homeTab, ...trustTabs, ...commonTabs })
        // }
        // return { ...homeTab, ...commonTabs };
    , []);

    const getTabBarVisibility = useCallback((route: any) => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (
            routeName === undefined ||
            routeName === ScreenNames.home ||
            routeName === ScreenNames.createLoanBill ||
            routeName === ScreenNames.history ||
            routeName === ScreenNames.account
        ) {
            return true;
        }
        return false;
    }, []);

    const initState = useCallback(() => {
        if (SessionManager.isEnableFastAuthentication) {
            fastAuthInfoManager.setEnableFastAuthentication(true);
        }
        if (isIOS && DeviceInfos.HasNotch) {
            fastAuthInfoManager.setSupportedBiometry(ENUM_BIOMETRIC_TYPE.FACE_ID);
        }
        if (isIOS && !DeviceInfos.HasNotch) {
            fastAuthInfoManager.setSupportedBiometry(ENUM_BIOMETRIC_TYPE.TOUCH_ID);
        }
        if (!isIOS) {
            TouchID.isSupported()
                .then((biometricType) => {
                    if (biometricType) {
                        fastAuthInfoManager.setSupportedBiometry(ENUM_BIOMETRIC_TYPE.TOUCH_ID);
                    }
                })
                .catch((error) => {
                    if (error?.code === ERROR_BIOMETRIC.NOT_SUPPORTED) {
                        fastAuthInfoManager.setSupportedBiometry('');
                    } else {
                        fastAuthInfoManager.setSupportedBiometry(ENUM_BIOMETRIC_TYPE.TOUCH_ID);
                    }
                });
        }
    }, [fastAuthInfoManager]);

    const onAuthTabPress = useCallback((index: number) => {
        let upcomingTabName = TabNames.homeTab;

        Object.keys(TabNames).forEach((key: any, _index?: number) => {
            if (index === _index) {
                upcomingTabName = TabNames[key];
            }
        });

        SessionManager.lastTabIndexBeforeOpenAuthTab = index;
        if (!userManager?.userInfo) {
            Navigator.navigateScreen(ScreenNames.auth);
        } else if (fastAuthInfoManager.isEnableFastAuth) {
            Navigator.navigateToDeepScreen([ScreenNames.auth], ScreenNames.loginWithBiometry);
        } else {
            Navigator.navigateScreen(upcomingTabName);
        }
    }, [fastAuthInfoManager.isEnableFastAuth, userManager?.userInfo]);

    const onTabPress = useCallback((index: number, tabName: string) => {
        const isAuthTab = AUTH_TAB_INDEXES.includes(index);
        if (
            !isAuthTab ||
            userManager.userInfo ||
            !fastAuthInfoManager?.isEnableFastAuth
        ) {
            Navigator.navigateScreen(tabName);
        }
    }, [fastAuthInfoManager?.isEnableFastAuth, userManager.userInfo]);

    const renderTabBar = useCallback((props: any) => {
        const focusedOptions =
            props.descriptors[props.state.routes[props.state.index].key].options;

        if (!focusedOptions.tabBarVisible) {
            return null;
        }

        return (
            <AnimatedTabBar
                tabs={tabBarConfig}
                authTabIndexes={
                    userManager?.userInfo && !fastAuthInfoManager.isEnableFastAuth
                        ? []
                        : AUTH_TAB_INDEXES
                }
                onAuthTabPress={onAuthTabPress}
                onTabPress={onTabPress}
                focusedIndex={SessionManager.lastTabIndexBeforeOpenAuthTab}
                {...props}
            />
        );
    }, [fastAuthInfoManager.isEnableFastAuth, onAuthTabPress, onTabPress, tabBarConfig, userManager?.userInfo]);

    const getOption = useCallback(({ route }: any) => ({
        tabBarVisible: getTabBarVisibility(route)
    } as any), [getTabBarVisibility]);

    const AuthStack = useCallback(() => (
        <Stack.Navigator initialRouteName={SessionManager?.isEnableFastAuthentication ? ScreenNames.loginWithBiometry : ScreenNames.login} screenOptions={screenOptions}>
            <Stack.Screen name={ScreenNames.login} component={Login} />
            <Stack.Screen name={ScreenNames.signUp} component={SignUp} />
            <Stack.Screen name={ScreenNames.loginWithBiometry} component={LoginWithBiometry} />
            <Stack.Screen name={ScreenNames.otpSignUp} component={OTPSignUp} />
            <Stack.Screen name={ScreenNames.forgotPwd} component={ForgotPwd} />
            <Stack.Screen name={ScreenNames.updateNewPwd} component={UpdateNewPwd} />
        </Stack.Navigator>
    ), []);

    const Tabs = useCallback(
        () => (
            <Tab.Navigator screenOptions={screenOptions} tabBar={renderTabBar}>
                <Tab.Screen
                    name={TabNames.homeTab}
                    component={HomeStack}
                    options={getOption}
                />
                {/* {!appManager.isAppInReview &&
                    <> */}
                <Tab.Screen
                    name={TabNames.billingTab}
                    component={BillingStack}
                    options={getOption}
                />
                <Tab.Screen
                    name={TabNames.loanTab}
                    component={RequestLoan}
                    options={getOption}
                />
                {/* </>} */}
                <Tab.Screen
                    name={TabNames.historyTab}
                    component={HistoryStack}
                    options={getOption}
                />
                <Tab.Screen
                    name={TabNames.accountTab}
                    component={TabAccount}
                    options={getOption}
                />
            </Tab.Navigator>
        ),
        [getOption, renderTabBar]
    );

    const AppStack = useCallback(() => (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name={ScreenNames.splash} component={Splash} />
            <Stack.Screen name={ScreenNames.onboarding} component={Onboarding} />
            <Stack.Screen name={ScreenNames.tabs} component={Tabs} />
            <Stack.Screen name={ScreenNames.auth} component={AuthStack} />
            <Stack.Screen name={ScreenNames.myWebview} component={MyWebview} />
            <Stack.Screen name={ScreenNames.notify} component={Notify} />
        </Stack.Navigator>
    ), [AuthStack, Tabs]);

    const renderRootStack = useMemo(() => <AppStack />, [AppStack]);
    return renderRootStack;
});

export default RootStack;
