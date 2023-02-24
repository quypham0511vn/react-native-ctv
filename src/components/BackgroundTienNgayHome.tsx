import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import IcLeftTienngay from '@/assets/images/ic_white_left_tien_ngay_home.png';
import IcRightTienngay from '@/assets/images/ic_white_right_tien_ngay_home.png';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/ScreenUtils';
import { COLORS } from '@/theme';

const BackgroundTienNgayHome = ({ children }: any) => (
    <ImageBackground style={styles.containerAll}>
        <View style={styles.containerOutBack} />
        <ImageBackground source={IcRightTienngay} imageStyle={styles.mainRight} style={styles.container} >
            <ImageBackground source={IcLeftTienngay} imageStyle={styles.mainLeft} style={styles.container} >
                {children}
            </ImageBackground>
        </ImageBackground>
    </ImageBackground>
);
export default BackgroundTienNgayHome;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerAll: {
        flex: 1
    },
    mainLeft: {
        width: 120,
        height: 130,
        position: 'absolute',
        opacity: 0.1
    },
    mainRight: {
        width: 110,
        height: 100,
        position: 'absolute',
        opacity: 0.1,
        left: SCREEN_WIDTH * 0.72,
        flex: 1
    },
    containerOutBack: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.22,
        backgroundColor: COLORS.GREEN_2,
        position: 'absolute',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
    }
});
