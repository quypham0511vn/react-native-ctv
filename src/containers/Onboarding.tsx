import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, ImageBackground, StatusBar, StyleSheet, View } from 'react-native';

import icArrowRight from '@/assets/images/ic_arrow_right.png';
import Images from '@/assets/images/Images';
import IcLoan from '@/assets/images/ic_loan.svg';
import IcManage from '@/assets/images/ic_manage.svg';
import IcGroup from '@/assets/images/ic_group.svg';
import IcPayment from '@/assets/images/ic_payment.svg';
import IcUtilities from '@/assets/images/ic_utilities.svg';
import IcBonus from '@/assets/images/ic_bonus.svg';

import LogoBoarding from '@/assets/images/logo_boarding.svg';
import Introduce from '@/assets/images/introduce.svg'
import Background from '@/assets/images/background_boarding.png';
import ScreenNames from '@/commons/ScreenNames';
import { Touchable } from '@/components';
import SessionManager from '@/managers/SessionManager';
import Navigator from '@/routers/Navigator';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/ScreenUtils';
import { COLORS, Styles } from '../theme';

const Onboarding = observer(() => {
    const [step, setStep] = useState<number>(0);
    const [source, setSource] = useState(Images.imgOnboarding1);
    const [title, setTitle] = useState(<Introduce />);
    const [content, setContent] = useState(<IcLoan />);

    useEffect(() => {
        switch (step) {
            case 0:
                setSource(Images.imgOnboarding1);
                setTitle(<Introduce />)
                setContent(<IcLoan />)
                break;
            case 1:
                setSource(Images.imgOnboarding2);
                setTitle(<IcManage />)
                setContent(<IcBonus />)
                break;
            case 2:
                setSource(Images.imgOnboarding3);
                setTitle(<IcManage />)
                setContent(<IcGroup />)
                break;
            default:
                setSource(Images.imgOnboarding4);
                setTitle(<IcPayment />)
                setContent(<IcUtilities />)
                break;
        }
    }, [step]);

    const renderLogo = useMemo(() => <LogoBoarding
        style={styles.logo} width={SCREEN_WIDTH / 2} />, []);

    const nextStep = useCallback(() => {
        if (step === 3) {
            Navigator.replaceScreen(ScreenNames.tabs);
            SessionManager.setSkipOnboarding();
        } else {
            setStep(last => (last + 1) % 4);
        }
    }, [step]);

    const renderInActiveDot = useMemo(() => <View
        style={styles.inActive}
    />, []);

    const renderActiveDot = useMemo(() => <View
        style={styles.active}
    />, []);

    const renderActiveDotWhite = useMemo(() => <View
        style={styles.activeWhite}
    />, []);

    const renderIndicator = useMemo(() => <View style={styles.paginatorContainer}>
        {step === 0 ? renderActiveDotWhite : renderInActiveDot}
        {step === 1 ? renderActiveDotWhite : renderInActiveDot}
        {step === 2 ? renderActiveDotWhite : renderInActiveDot}
        {step === 3 ? renderActiveDotWhite : renderInActiveDot}
    </View>, [renderActiveDot, renderActiveDotWhite, renderInActiveDot, step]);

    const renderMainLogo = useMemo(() => <View style={styles.top}>
        <ImageBackground source={source}
            style={styles.image} resizeMode={'contain'} />
    </View>, [source]);

    const renderTitle = useMemo(() => {
        return (
            <View style={step % 2 == 0 ? styles.viewTitleRight : styles.viewTitleLeft}>{title}</View>
        );
    }, [title])

    const renderContent = useMemo(() => {
        return (
            <View style={step % 2 == 0 ? styles.viewContentLeft : styles.viewContentRight}>{content}</View>
        );
    }, [content])

    const roundedImgStyle = useMemo(() => {
        let color = COLORS.WHITE;
        return {
            ...styles.roundedImg,
            backgroundColor: color
        };
    }, [step]);

    const nextStyle = useMemo(() => {
        let color = COLORS.GREEN;
        return {
            ...styles.smallImg,
            tintColor: color
        };
    }, [step]);

    const renderFooter = useMemo(() => <View style={styles.bottom}>
        {renderIndicator}
        <Touchable style={roundedImgStyle}
            radius={20}
            onPress={nextStep}>
            <Image
                style={nextStyle}
                source={icArrowRight}
            />
        </Touchable>
    </View>, [nextStep, nextStyle, renderIndicator, roundedImgStyle]);

    return (
        <ImageBackground
            style={styles.container}
            source={Background}
            resizeMode={'stretch'}
        >

            <StatusBar
                barStyle={'light-content'}
                animated
                translucent
                backgroundColor={COLORS.TRANSPARENT}
            />
            {renderLogo}
            {renderTitle}
            {renderContent}
            {renderMainLogo}
            {renderFooter}
        </ImageBackground>
    );
});

export default Onboarding;
const INDICATOR_HEIGHT = 100;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    top: {
        flex: 1.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    center: {
        flex: 1,
        alignItems: 'center'
    },
    bottom: {
        height: INDICATOR_HEIGHT,
        paddingHorizontal: 10,
        alignItems: 'center',
        flexDirection: 'row',
        alignContent: 'space-between',
        position: 'absolute',
        bottom: 5,
        width: SCREEN_WIDTH
    },
    image: {
        position: 'absolute',
        bottom: 0,
        height: SCREEN_HEIGHT / 1.8,
        width: SCREEN_WIDTH
    },
    logo: {
        top: '8%',
        position: 'absolute'
    },
    smallImg: {
        width: 20,
        height: 20,
        alignItems: 'center'
    },
    roundedImg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.GREEN
    },
    content: {
        alignItems: 'center',
        marginHorizontal: 20
    },
    paginatorContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    active: {
        width: 32,
        height: 8,
        backgroundColor: COLORS.GREEN,
        marginHorizontal: 2,
        borderRadius: 4
    },
    activeWhite: {
        width: 32,
        height: 8,
        backgroundColor: COLORS.WHITE,
        marginHorizontal: 2,
        borderRadius: 4
    },
    inActive: {
        width: 12,
        height: 8,
        backgroundColor: COLORS.GRAY,
        marginHorizontal: 2,
        borderRadius: 4
    },
    viewTitleRight: {
        position: 'absolute',
        top: '20%',
        right: '4%'
    },
    viewTitleLeft: {
        position: 'absolute',
        top: '20%',
        left: '4%'
    },
    viewContentLeft: {
        position: 'absolute',
        top: '28%',
        left: '4%',
    },
    viewContentRight: {
        position: 'absolute',
        top: '28%',
        right: '4%',
    }
});
