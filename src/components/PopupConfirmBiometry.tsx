import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useState
} from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

import { COLORS, Styles } from '@/theme';
import FaceIdIC from '@/assets/images/ic_faceid_big.svg';
import FingerIC from '@/assets/images/ic_fingerprint.svg';
import PinIC from '@/assets/images/ic_lock.svg';
import { PopupActionTypes, PopupPropsTypes } from '@/models/typesPopup';
import { Touchable } from './elements/touchable';
import Languages from '@/commons/Languages';
import { ENUM_BIOMETRIC_TYPE } from './popupFingerprint/types';
import { Configs } from '@/commons/Configs';

interface PopupUpdatePasscodeProps extends PopupPropsTypes {
    type?: string;
}

const PopupConfirmBiometry = forwardRef<
    PopupActionTypes,
    PopupUpdatePasscodeProps
>(({ onClose, onConfirm, type }: PopupUpdatePasscodeProps, ref) => {
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

    const _onClose = useCallback(() => {
        hide();
        onClose?.();
    }, [hide, onClose]);

    const renderIcon = useMemo(() => {
        if (Platform.OS === 'android') {
            return <PinIC />;
        }
        if (Platform.OS === 'ios') {
            if (type === ENUM_BIOMETRIC_TYPE.TOUCH_ID) return <FingerIC width={30} height={30} />;
            if (type === ENUM_BIOMETRIC_TYPE.FACE_ID) return <FaceIdIC />;
        }
        return null;
    }, [type]);

    const renderTitle = useCallback(() => {
        if (Platform.OS === 'android') {
            return Languages.quickAuThen.desSetPasscode;
        }
        if (Platform.OS === 'ios') {
            if (type === ENUM_BIOMETRIC_TYPE.TOUCH_ID)
                return Languages.quickAuThen.desSetTouchId;
            if (type === ENUM_BIOMETRIC_TYPE.FACE_ID)
                return Languages.quickAuThen.desSetFaceId;
        }
        return null;
    }, [type]);

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
                {renderIcon}
                <Text style={styles.txtTitle}>{Languages.quickAuThen.confirm}</Text>
                <Text style={styles.txtContent}>{renderTitle()}</Text>
                <View style={styles.row}>
                    <Touchable style={styles.closeButton} onPress={_onClose}>
                        <Text style={styles.txtBt}>{Languages.common.cancel}</Text>
                    </Touchable>
                    <Touchable style={styles.confirmButton} onPress={onConfirm}>
                        <Text style={styles.txtBtConfirm}>{Languages.common.agree}</Text>
                    </Touchable>
                </View>
            </View>
        </Modal>
    );
});

export default PopupConfirmBiometry;

const styles = StyleSheet.create({
    popup: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 6,
        borderWidth: 1,
        paddingBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        paddingTop: 30
    },
    ic: {
        marginTop: 10,
        marginBottom: -10,
        width: Configs.IconSize.size39,
        height: Configs.IconSize.size39
    },
    txtTitle: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16,
        color: COLORS.BLACK,
        marginTop: 15
    },
    txtContent: {
        ...Styles.typography.medium,
        marginTop: 10,
        marginHorizontal: 30,
        textAlign: 'center'
    },
    btn: {
        width: '50%',
        marginTop: 10
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 10,
        paddingTop: 10
    },
    txtBt: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16,
        color: COLORS.GREEN
    },
    txtBtConfirm: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        color: COLORS.WHITE
    },
    closeButton: {
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.GREEN,
        width: '45%',
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 5
    },
    confirmButton: {
        backgroundColor: COLORS.GREEN,
        borderWidth: 1,
        borderColor: COLORS.GREEN,
        width: '45%',
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 5
    }
});
