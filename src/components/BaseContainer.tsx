import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import HeaderBar from './header';
import { HeaderProps } from './header/types';
import {
    STATUSBAR_HEIGHT
} from '@/commons/Configs';
import HideKeyboard from './HideKeyboard';

export const BaseContainer = ({
    containerStyle,
    children,
    noHeader,
    noStatusBar,
    ...props
}: HeaderProps) => (
    <HideKeyboard>
        <View style={styles.container}>
            <StatusBar translucent={noStatusBar}
                backgroundColor="transparent"
                barStyle={'light-content'} />
            {!noHeader && <HeaderBar {...props} />}

            <View style={[containerStyle, styles.childContainer]}>
                {children}
            </View>
        </View>
    </HideKeyboard>
);

export default BaseContainer;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    childContainer: {
        marginTop: -STATUSBAR_HEIGHT-15
    }
});

