import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import WebView from 'react-native-webview';

import { COLORS, IconSize } from '@/theme';
import Languages from '@/commons/Languages';
import { Button } from './elements';
import MyWebViewProgress from './MyWebViewProgress';
import { PopupActions, PopupProps } from './popup/types';
import { LINKS } from '@/api/constants';
import IcClose from '@/assets/images/ic_close.svg';

const PopupPolicy = forwardRef<PopupActions, PopupProps>(
    ({ onClose, uri, hasBtnAgree, hasBtnClose }: PopupProps, ref) => {

        const [visible, setVisible] = useState<boolean>(false);
        const webProgressRef = useRef<any>(null);
        const webViewRef = useRef<WebView>(null);

        const show = useCallback(() => {
            setVisible(true);
        }, []);

        const hide = useCallback(() => {
            setVisible(false);
        }, []);

        useImperativeHandle(ref, () => ({
            show,
            hide
        }));

        const onLoadProgress = useCallback((e: any) => {
            webProgressRef.current?.setProgress(e?.nativeEvent?.progress);
        }, []);

        const handleClose = useCallback(() => {
            hide();
            onClose?.();
        }, [hide, onClose]);

        return (
            <Modal
                isVisible={visible}
                animationIn="slideInUp"
                useNativeDriver={true}
                onBackdropPress={hide}
                avoidKeyboard={true}
                hideModalContentWhileAnimating
            >
                <View style={styles.popup}>

                    <View style={styles.header}>
                        <MyWebViewProgress
                            ref={webProgressRef}
                        />
                        {hasBtnClose &&
                            <TouchableOpacity style={styles.btnClose} onPress={handleClose}>
                                <IcClose {...IconSize.size20_20} />
                            </TouchableOpacity>}
                    </View>
                    <View style={styles.scrollContent}>
                        <WebView
                            ref={webViewRef}
                            source={{ uri: `${uri ? `${uri}` : LINKS.POLICY}` }}
                            javaScriptEnabled={true}
                            onLoadProgress={onLoadProgress}
                        />
                    </View>

                    {hasBtnAgree && <Button
                        style={styles.btn}
                        label={Languages.common.agree}
                        buttonStyle={'GREEN'}
                        onPress={hide}
                    />}
                </View>
            </Modal>
        );
    });

export default PopupPolicy;

const styles = StyleSheet.create({
    popup: {
        marginVertical: 50,
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 6,
        borderWidth: 1,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    header: {
        width: '100%'
    },
    scrollContent: {
        flex: 1,
        paddingHorizontal: 5,
        width: '100%'
    },
    btn: {
        marginTop: 10,
        marginHorizontal: 10
    },
    btnClose: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: '100%',
        paddingTop: 5,
        paddingHorizontal: 12
    }
});
