import React from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { COLORS } from '@/theme';
import IcLoading from '@/assets/images/ic_loading.gif';

const MyLoading = ({ isOverview, isWhite }: { isOverview?: boolean, isWhite?: boolean }) =>
    isOverview ?
        <View style={styles.overlay}>
            <FastImage
                style={styles.activityIndicator}
                source={IcLoading} />
        </View> :
        <View style={styles.inline} >
            <ActivityIndicator size="small" color={isWhite ? COLORS.WHITE : COLORS.GREEN} />
        </View >;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 10000,
        width: '100%',
        height: '100%'
    },
    inline: {
        marginVertical: 10,
        alignItems: 'center'
    },
    activityIndicator: {
        width: 100,
        height: 100,
        borderRadius: 10
    }
});

export default MyLoading;
