import React, { useCallback, useRef } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import WebView from 'react-native-webview';

import MyWebViewProgress from '@/components/MyWebViewProgress';
import { HeaderBar } from '@/components';
import { PADDING_BOTTOM } from '@/commons/Configs';

const MyWebview = ({ route }: { route: any }) => {
    const webProgressRef = useRef<MyWebViewProgress>(null);
    const webViewRef = useRef<WebView>(null);

    const onLoadProgress = useCallback((e: any) => {
        webProgressRef.current?.setProgress(e?.nativeEvent?.progress);
    }, []);

    const getContent = useCallback(() => {
        const preTags = '<style> img { display: block; width: auto; max-width: 100%; height: auto; margin:auto } </style>';
        return route?.params?.item?.content_vi?.split('cpanel')?.join('lms') + preTags;
    }, [route?.params?.item?.content_vi]);

    return (
        <View style={styles.mainContainer}>
            <HeaderBar title={route?.params?.uri ? route?.params?.title_vi : route?.params?.item.title_vi} isLowerCase />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <MyWebViewProgress ref={webProgressRef} />
                <WebView
                    ref={webViewRef}
                    source={route?.params?.uri ? { uri: route?.params?.content_vi } : { html: getContent() }}
                    javaScriptEnabled={true}
                    onLoadProgress={onLoadProgress}
                />
            </ScrollView>
        </View>
    );
};

export default MyWebview;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingBottom: PADDING_BOTTOM
    },
    scrollContent: {
        flex: 1,
        paddingHorizontal: 5
    }
});
