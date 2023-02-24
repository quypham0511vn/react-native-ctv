import React from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import {
    KeyboardAwareScrollView as KeyboardAwareScrollViewIos, KeyboardAwareScrollViewProps
} from 'react-native-keyboard-aware-scroll-view';

import { isIOS } from '@/commons/Configs';

const ScrollViewWithKeyboard = (
    props: KeyboardAwareScrollViewProps
) => {
    if (isIOS) {
        return (
            <KeyboardAwareScrollViewIos
                refreshControl={props.refreshControl}
                style={[styles.fillWidth, props.style]}
                contentContainerStyle={[styles.fillWidth, props.contentContainerStyle]}
                enableOnAndroid={true}
                enableResetScrollToCoords={true}
                extraHeight={200}
                keyboardShouldPersistTaps="handled"
                automaticallyAdjustContentInsets={false}
                scrollEnabled={props.scrollEnabled}
                onScroll={props.onScroll}
                showsVerticalScrollIndicator={false}
                extraScrollHeight={10}
            >
                {props.children}
            </KeyboardAwareScrollViewIos>
        );
    }
    return (
        <ScrollView contentContainerStyle={styles.fillWidth}>
            <KeyboardAvoidingView
                style={[styles.fillWidth, props.style]}
            >
                {props.children}
            </KeyboardAvoidingView>
        </ScrollView>
    );
};
export default ScrollViewWithKeyboard;
const styles = StyleSheet.create({
    fillWidth: {
        flexGrow: 1
    }
});
