import React, { useCallback } from 'react';
import {
    Image, StatusBar,
    StyleSheet, View
} from 'react-native';

import ImgHeader from '@/assets/images/bg_header_home.svg';
import { Configs, isIOS, PADDING_TOP, STATUSBAR_HEIGHT } from '@/commons/Configs';
import { COLORS } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/ScreenUtils';
import CloseIcon from '@/assets/images/ic_close_bg.svg';
import Navigator from '@/routers/Navigator';
import { Touchable } from './elements/touchable';

const imgHeader =require('@/assets/images/img_logo.png');

const IMG_HEADER_HEIGHT = (SCREEN_WIDTH / 375) * 85;
const HeaderLogo = () => {
    const goBack = useCallback(() => {
        Navigator.goBack();
    }, []);
    return (
        <View style={styles.container}>
            <ImgHeader
                style={styles.imageBg}
                width={SCREEN_WIDTH}
                height={IMG_HEADER_HEIGHT + 140}
            />
            
            {isIOS ? null
                : <StatusBar
                    translucent
                    backgroundColor={'transparent'}
                    barStyle={'light-content'} />}
            <View style={styles.wrapLogo}>
                <Image source={imgHeader} style={styles.imgLogo}/>
            </View>
            <Touchable style={styles.hisLop} onPress={goBack}>
                <CloseIcon width={25} height={25} />
            </Touchable>
        </View>
    );
};

export default HeaderLogo;

const styles = StyleSheet.create({
    container: {
        height: IMG_HEADER_HEIGHT + 70,
        justifyContent: 'center',
        backgroundColor: COLORS.GREEN
    },
    imageBg: {
        position: 'absolute',
        top: -20,
        right: 0,
        left: 0,
        backgroundColor: COLORS.GREEN
    },
    wrapLogo: {
        position: 'absolute',
        right: 40,
        left: 60,
        justifyContent: 'center',
        alignContent: 'center',
        height: '100%',
        bottom: 15
        // top:
    },
    imgLogo: {
        height: '40%',
        width: SCREEN_WIDTH - 100,
        alignSelf: 'center',
        tintColor: COLORS.WHITE,
        resizeMode: 'contain',
        marginTop:20
    },
    hisLop: {
        paddingVertical: 10,
        paddingLeft: 10,
        width: SCREEN_WIDTH,
        paddingHorizontal: 16,
        alignItems: 'flex-end',
        marginTop: -(STATUSBAR_HEIGHT + PADDING_TOP+ Configs.FontSize.size20)
    }
});
