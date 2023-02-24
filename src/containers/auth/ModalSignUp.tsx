import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import HTMLView from 'react-native-htmlview';
import Modal from 'react-native-modal';

import Languages from '@/commons/Languages';
import { PopupActions, PopupProps } from '@/components/popup/types';
import { COLORS, HtmlStyles } from '@/theme';

const ModalFormSignUp = forwardRef<PopupActions, PopupProps>(({ content }: PopupProps, ref: any) => {
    const [visible, setVisible] = useState<boolean>(false);

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

    return (
        <Modal
            isVisible={visible}
            animationIn="slideInUp"
            useNativeDriver={true}
            avoidKeyboard={true}
            hideModalContentWhileAnimating
            onBackdropPress={hide}
            style={styles.modalContainer}
        >
            <View style={styles.mainContainer}>
                <View style={styles.viewHTML1}>
                    <HTMLView
                        value={`${Languages.groupManager.personalAccount}`}
                        stylesheet={HtmlStyles || undefined} />
                </View>
                <View style={styles.viewHTML}>
                    <HTMLView
                        value={`${Languages.groupManager.teamAccount}`}
                        stylesheet={HtmlStyles || undefined} />
                </View>
            </View>
        </Modal>
    );
});
export default ModalFormSignUp;

const styles = StyleSheet.create({
    modalContainer:{
        width: '80%',
        alignSelf: 'center'
    },
    mainContainer: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.GRAY_14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        padding: 8
    },
    viewHTML: {
        width: '100%',
        paddingTop: 12
    },
    viewHTML1: {
        width: '100%'
    }
});

