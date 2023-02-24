import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextStyle, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import HTMLView from 'react-native-htmlview';

import IcShare from '@/assets/images/ic_white_share.svg';
import Languages from '@/commons/Languages';
import { HeaderBar } from '@/components';
import BackgroundTienNgay from '@/components/BackgroundTienNgay';
import { Touchable } from '@/components/elements/touchable/index';
import { useAppStore } from '@/hooks';
import { LinkReferral } from '@/models/common';
import { COLORS, HtmlStylesSeen, Styles } from '@/theme';
import Utils from '@/utils/Utils';
import Lightbox from '@/libs/react-native-lightbox/Lightbox';
import { SCREEN_WIDTH } from '@/utils/ScreenUtils';
import MyLoading from '@/components/MyLoading';
import { PADDING_BOTTOM } from '@/commons/Configs';

const imgTienNgay = require('@/assets/images/ic_tienngay.jpg');

const IntroCollaborator = observer(() => {
    const { apiServices } = useAppStore();
    const [dataLinks, setDataLinks] = useState<LinkReferral>();
    const [isLoading, setLoading] = useState<boolean>(false);

    const isFocus = useIsFocused();

    useEffect(() => {
        if (isFocus) {
            fetchLink();
        }
    }, [isFocus]);

    const fetchLink = useCallback(async () => {
        setLoading(true);
        const resLink = await apiServices.auth.getLinkReferral();
        setTimeout(() => {
            setLoading(false);
        }, 500);
        if (resLink.success) {
            const linkData = resLink.data as LinkReferral;
            setDataLinks(linkData);
        }
    }, [apiServices.auth]);

    const onShareSignUp = useCallback(() => {
        Utils.share(dataLinks?.link_referral_register || '');
    }, [dataLinks?.link_referral_register]);

    const onShareLoanBill = useCallback(() => {
        Utils.share(dataLinks?.link_referral_loan || '');
    }, [dataLinks?.link_referral_loan]);

    const renderButtonShare = useCallback((_title: string, _onPress?: () => void) => (
        <View style={styles.shareContainer}>
            <Text style={styles.shareTextStyle}>{_title}</Text>
            <Touchable style={styles.shareIconContainer} onPress={_onPress} radius={60}>
                <IcShare />
            </Touchable>
        </View>
    ), []);

    const renderHorizontalBar = useCallback((_title: string, _styleText?: TextStyle) => (
        <View style={styles.horizontalBarContainer}>
            <Text style={[styles.horizontalBarTextStyle, _styleText]}>{_title}</Text>
            <View style={styles.horizontalBarStyle} />
        </View>
    ), []);

    const renderContentLightBoxQRCode = useCallback((link?: string) => (
        <QRCode
            value={link || 'LINk'}
            logo={imgTienNgay}
            logoSize={40}
            logoBackgroundColor={COLORS.TRANSPARENT}
            size={SCREEN_WIDTH}
            backgroundColor={COLORS.BLACK}
            color={COLORS.WHITE}
        />
    ), []);

    const renderQRCode = useCallback((link?: string) => (
        <View style={styles.wrapQr}>
            <Lightbox
                springConfig={{
                    tension: 70,
                    friction: 10
                }}
                swipeToDismiss
                renderContent={() => renderContentLightBoxQRCode(link)}
            >
                <QRCode
                    value={link || 'LINk'}
                    logo={imgTienNgay}
                    logoSize={30}
                    logoBackgroundColor={COLORS.TRANSPARENT}
                    size={200}
                />
            </Lightbox>
        </View>
    ), [renderContentLightBoxQRCode]);

    return (
        <BackgroundTienNgay>
            <View style={styles.container}>
                <HeaderBar title={Languages.itemInForAccount.introCollaborator} isLowerCase />
                <ScrollView style={styles.scrollAllContainer}>
                    {renderHorizontalBar(Languages.refer.intro, styles.greenHorizontalBarTextStyle)}
                    <View style={styles.introAllContainer}>
                        {renderButtonShare(Languages.refer.introCollaborator, onShareSignUp)}
                        {renderQRCode(dataLinks?.link_referral_register || '')}
                        {renderButtonShare(Languages.refer.introLoanBill, onShareLoanBill)}
                        {renderQRCode(dataLinks?.link_referral_loan || '')}
                    </View>
                    <View style={styles.bottomContainer}>
                        <HTMLView
                            value={Languages.refer.note}
                            stylesheet={HtmlStylesSeen}
                        />
                    </View>
                </ScrollView>
            </View>
            {isLoading && <MyLoading isOverview />}
        </BackgroundTienNgay>
    );
});

export default IntroCollaborator;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollAllContainer: {
        flex: 1,
        paddingVertical: 24
    },
    introAllContainer: {
        paddingTop: 16,
        width: '100%'
    },
    horizontalBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16
    },
    horizontalBarTextStyle: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_7
    },
    greenHorizontalBarTextStyle: {
        ...Styles.typography.medium,
        color: COLORS.GREEN
    },
    horizontalBarStyle: {
        flex: 1,
        marginLeft: 12,
        borderTopColor: COLORS.GRAY_11,
        borderTopWidth: 1
    },
    shareContainer: {
        ...Styles.shadow,
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderColor: COLORS.GRAY_15,
        borderRadius: 50,
        borderWidth: 1,
        alignItems: 'center',
        marginBottom: 8,
        marginHorizontal: 16
    },
    shareTextStyle: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_13,
        paddingLeft: 16
    },
    shareIconContainer: {
        padding: 4
    },
    wrapQr: {
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 32
    },
    bottomContainer: {
        paddingBottom: 50,
        paddingHorizontal: 16
    }
});

