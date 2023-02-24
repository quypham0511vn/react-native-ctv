import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import CloseIcon from '@/assets/images/ic_close.svg';
import { STATUSBAR_HEIGHT } from '@/commons/Configs';
import Navigator from '@/routers/Navigator';
import { SCREEN_WIDTH } from '@/utils/ScreenUtils';
import { Touchable } from './elements';

const pathLogo = require('@/assets/images/img_logo.png');

const HeaderAuthn = ({ onClose }: { onClose?: () => void }) => {
    const _backToLogin = () => {
        Navigator.goBack();
    };

    return (
        <>
            <View style={styles.header}>
                <Touchable style={styles.hisLop} onPress={onClose || _backToLogin}>
                    <CloseIcon width={15} height={15} />
                </Touchable>
            </View>
            <View style={styles.wrapLogo}>
                <Image style={styles.logo} source={pathLogo} />
            </View>
        </>
    );
};

export default HeaderAuthn;

const styles = StyleSheet.create({
    header: {
        width: SCREEN_WIDTH,
        paddingHorizontal: 16,
        alignItems: 'flex-end',
        marginTop: STATUSBAR_HEIGHT
    },
    hisLop: {
        paddingVertical: 16,
        paddingLeft: 16
    },
    wrapLogo: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: 200,
        height: 80,
        resizeMode: 'contain'
    }
});

