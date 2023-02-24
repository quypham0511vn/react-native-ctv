import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Dash from 'react-native-dash';

import IcFront from '@/assets/images/ic_front_card_info.svg';
import IcTick from '@/assets/images/ic_green_tick.svg';
import { STATE_AUTH_ACC, TYPE_FORM_ACCOUNT, TYPE_TYPE_ACCOUNT } from '@/commons/constants';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { Button, HeaderBar } from '@/components';
import BackgroundTienNgay from '@/components/BackgroundTienNgay';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { Touchable } from '@/components/elements/touchable/index';
import { useAppStore } from '@/hooks';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import DateUtils from '@/utils/DateUtils';
import Utils from '@/utils/Utils';
import { UserInfoModel } from '@/models/user-model';
import SessionManager from '@/managers/SessionManager';

const ProfileInfo = observer(() => {
    const { userManager, apiServices } = useAppStore();
    const isFocused = useIsFocused();
    const [userInfo, setUserInfo] = useState<UserInfoModel | undefined>(SessionManager.userInfo);

    useEffect(() => {
        if (isFocused) {
            fetchUserInfo();
        }
    }, [isFocused]);

    const fetchUserInfo = useCallback(async () => {
        const res = await apiServices.auth.getUserInfo();
        if (res?.success) {
            const dataUser = res.data as UserInfoModel;
            SessionManager.setUserInfo({ ...userManager.userInfo as UserInfoModel, ...dataUser });
            setUserInfo({ ...userManager.userInfo, ...dataUser });
        }
    }, [apiServices.auth, userManager.userInfo]);

    const handleNavigateEitProfile = useCallback(() => { Navigator.navigateScreen(ScreenNames.editProFile); }, []);

    const onNavigateKYC = useCallback(() => Navigator.navigateScreen(ScreenNames.identityAuthn), []);

    const renderTopComponent = useCallback((titleAccuracyState?: string, accuracyStateWrap?: ViewStyle, accuracyStateText?: TextStyle) => (
        <View style={styles.topContainer}>
            <IcFront />
            <Text style={styles.txtContentKYC}>{Languages.itemInForAccount.content}</Text>
            <Touchable style={accuracyStateWrap} onPress={onNavigateKYC}>
                <Text style={accuracyStateText}>{titleAccuracyState}</Text>
            </Touchable>
        </View>
    ), [onNavigateKYC]);

    const renderAccuracy = useMemo(() => {
        switch (userInfo?.status_verified) {
            case STATE_AUTH_ACC.VERIFIED:
                return renderTopComponent(Languages.itemInForAccount.accVerified, styles.accuracyWrap, styles.txtAccuracy);
            case STATE_AUTH_ACC.UN_VERIFIED:
                return renderTopComponent(Languages.itemInForAccount.accuracyNow, styles.notAccuracyWrap, styles.txtNotAccuracy);
            case STATE_AUTH_ACC.WAIT:
                return renderTopComponent(Languages.itemInForAccount.accWaitVerify, styles.waitAccuracyWrap, styles.txtWaitAccuracy);
            case STATE_AUTH_ACC.RE_VERIFIED:
                return renderTopComponent(Languages.itemInForAccount.reAccuracy, styles.notAccuracyWrap, styles.txtNotAccuracy);
            default:
                return renderTopComponent(Languages.itemInForAccount.accuracyNow, styles.notAccuracyWrap, styles.txtNotAccuracy);
        }
    }, [renderTopComponent, userInfo?.status_verified]);

    const renderKeyValue = useCallback((title: string, content?: string, hasTicked?: boolean) => (
        <>
            <View style={styles.row}>
                <View style={styles.rowCenter}>
                    <Text style={styles.leftText}>{title}</Text>
                    <View style={styles.contentRightContainer}>
                        <Text style={hasTicked ? styles.contentText : styles.contentNoTickedText}>{content}</Text>
                    </View>
                </View>
                {hasTicked && <IcTick style={styles.tickStyle} />}
            </View>
            <Dash
                dashThickness={1}
                dashLength={10}
                dashGap={4}
                dashColor={COLORS.GRAY_14}
                style={styles.styleDash}
            />
        </>
    ), []);

    return (
        <BackgroundTienNgay>
            <View style={styles.container}>
                <HeaderBar title={Languages.profileAuth.title} isLowerCase />
                {renderAccuracy}
                <ScrollView style={styles.container}>
                    <View style={styles.showProFile}>
                        {(userInfo?.form === TYPE_FORM_ACCOUNT.GROUP) && renderKeyValue(Languages.profileAuth.company, userInfo?.ctv_company)}
                        {renderKeyValue(Languages.profileAuth.numberPhone, userInfo?.ctv_phone, !!userInfo?.ctv_phone)}
                        {renderKeyValue(Languages.profileAuth.username, userInfo?.ctv_name)}
                        {renderKeyValue(Languages.profileAuth.gender, Utils.convertGender(userInfo?.ctv_gender))}
                        {renderKeyValue(Languages.profileAuth.birthDate, DateUtils.convertReverseYear(userInfo?.ctv_DOB))}
                        {renderKeyValue(Languages.profileAuth.address, userInfo?.ctv_address === 'undefined' ? '' : userInfo?.ctv_address)}
                        {renderKeyValue(Languages.profileAuth.email, userInfo?.email)}
                        <Button label={Languages.profileAuth.edit} onPress={handleNavigateEitProfile} textStyle={styles.textBtnStyle} buttonStyle={BUTTON_STYLES.GREEN} style={styles.btn} isLowerCase />
                    </View>
                </ScrollView>
            </View>
        </BackgroundTienNgay>
    );
});

export default ProfileInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    showProFile: {
        ...Styles.shadow,
        marginTop: 16,
        paddingTop: 4,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.GRAY_15,
        marginHorizontal: 16,
        flex: 1
    },
    topContainer: {
        ...Styles.shadow,
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        marginTop: 24,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: COLORS.GRAY_15,
        marginHorizontal: 16
    },
    wrapCheckedInfo: {
        width: '90%',
        paddingVertical: 10
    },
    wrapUnCheckedInfo: {
        width: '100%',
        paddingVertical: 10
    },
    txtContentKYC: {
        width: '100%',
        ...Styles.typography.medium,
        color: COLORS.GRAY_13,
        textAlign: 'center',
        paddingBottom: 8,
        paddingTop: 16
    },
    accuracyWrap: {
        width: '100%',
        backgroundColor: COLORS.GREEN_4,
        borderRadius: 70,
        alignItems: 'center',
        paddingVertical: 8
    },
    txtAccuracy: {
        ...Styles.typography.medium,
        color: COLORS.GREEN_2
    },
    txtNotAccuracy: {
        ...Styles.typography.medium,
        color: COLORS.RED_2
    },
    txtWaitAccuracy: {
        ...Styles.typography.medium,
        color: COLORS.YELLOW_3,
        textAlign: 'center'
    },
    notAccuracyWrap: {
        width: '100%',
        backgroundColor: COLORS.PINK_1,
        borderRadius: 70,
        alignItems: 'center',
        paddingVertical: 8
    },
    waitAccuracyWrap: {
        width: '100%',
        backgroundColor: COLORS.YELLOW_5,
        borderRadius: 70,
        alignItems: 'center',
        paddingVertical: 8
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rowCenter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12,
        paddingBottom: 8,
        flex: 1
    },
    leftText: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_13
    },
    contentText: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_13,
        alignSelf: 'flex-end'
    },
    contentNoTickedText: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_13,
        alignSelf: 'flex-end',
        textAlign: 'right',
        paddingLeft: 32
    },
    btn: {
        marginTop: 24,
        marginBottom: 8
    },
    tickStyle: {
        marginLeft: 18
    },
    contentRightContainer: {
        flex: 1
    },
    styleDash: {
        marginRight: 4
    },
    textBtnStyle: {
        ...Styles.typography.medium,
        color: COLORS.WHITE
    }
});

