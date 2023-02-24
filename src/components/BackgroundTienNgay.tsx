import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

import IcTienngay from '@/assets/images/bg_tien_ngay.png';
import { SCREEN_HEIGHT } from '@/utils/ScreenUtils';

const BackgroundTienNgay = ({ children }: any) => (
    <ImageBackground source={IcTienngay} imageStyle={styles.main} style={styles.container} >
        {children}
    </ImageBackground>
);
export default BackgroundTienNgay;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    main: {
        width: 250,
        height: 300,
        marginTop: SCREEN_HEIGHT * 0.65
    }
});
