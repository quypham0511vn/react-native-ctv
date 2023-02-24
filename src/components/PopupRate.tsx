import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useState
} from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Modal from 'react-native-modal';
import { Rating } from 'react-native-ratings';

import IcClose from '@/assets/images/ic_close.svg';
import { COLORS, Styles } from '@/theme';
import { PopupActionTypes, PopupPropsTypes } from '@/models/typesPopup';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import HideKeyboard from './HideKeyboard';
import { Button } from './elements/button';
import { BUTTON_STYLES } from './elements/button/constants';
import { ItemProps } from './BottomSheet';
import Languages from '@/commons/Languages';
import { dataRatingPoint } from '@/commons/constants';
import { Configs } from '@/commons/Configs';
import { Touchable } from './elements';

interface PopupNoActionProps extends PopupPropsTypes {
    icon?: any;
    onChangeTextComment?: (_text?: string) => void;
    ratingSwipeComplete?: (_rating?: any) => void;
    onClose?: () => void;
    hasContentRating?: boolean;
    loading?: boolean;
}

const PopupRating = forwardRef<PopupActionTypes, PopupNoActionProps>(
    (
        {
            onConfirm,
            onChangeTextComment,
            ratingSwipeComplete,
            onClose,
            hasContentRating,
            loading
        }: PopupNoActionProps,
        ref
    ) => {
        const [visible, setVisible] = useState<boolean>(false);
        const [text, setText] = useState<string>('');
        const [ratingPoint, setRating] = useState<number>(0);
        const show = useCallback(() => {
            setVisible(true);
        }, []);

        const hide = useCallback(() => {
            setVisible(false);
            setText('');
            setRating('' || 0);
        }, []);

        const onChangeText = useCallback(
            (_text?: string) => {
                setText(_text || '');
                onChangeTextComment?.(_text || '');
            }, [onChangeTextComment]);

        const ratingCompleted = useCallback(
            (rating?: any) => {
                setRating(rating || 0);
                ratingSwipeComplete?.(rating || 0);
            }, [ratingSwipeComplete]);

        const handleClose = useCallback(() => {
            hide();
            onClose?.();
        }, [hide, onClose]);

        useImperativeHandle(ref, () => ({
            show,
            hide
        }));

        const renderDescribeRating = useMemo(() => (
            <>
                {dataRatingPoint.map((item?: ItemProps) => (
                    <View key={item?.id}>
                        {`${ratingPoint}` === item?.id && (
                            <Text style={styles.txtDescribePoint}>{item?.value}</Text>
                        )}
                    </View>
                ))}
            </>
        ), [ratingPoint]);

        const renderBtn = useMemo(() => (
            <Button
                onPress={onConfirm}
                disabled={ratingPoint <= 0}
                label={Languages.common.send}
                buttonStyle={ratingPoint <= 0 ? BUTTON_STYLES.GRAY : BUTTON_STYLES.GREEN}
                loading={loading}
                isLowerCase
            />
        ), [loading, onConfirm, ratingPoint]);

        return (
            <Modal
                isVisible={visible}
                animationIn="slideInUp"
                useNativeDriver={true}
                avoidKeyboard={true}
                hideModalContentWhileAnimating
            >
                <HideKeyboard>
                    <View style={styles.popup}>
                        <Touchable radius={15} style={styles.wrapIcClose} onPress={handleClose}>
                            <IcClose width={15} height={15} />
                        </Touchable>
                        <Text style={styles.txtTitle}>
                            {`${Languages.feedback.title}`}
                        </Text>
                        <Rating
                            ratingCount={5}
                            imageSize={40}
                            onFinishRating={ratingCompleted}
                            style={styles.wrapStarRate}
                            startingValue={ratingPoint || 0}
                            minValue={0}
                        />
                        {renderDescribeRating}
                        <View style={styles.describeContent}>
                            {hasContentRating &&
                                <>
                                    <Text style={styles.txtContent}>{Languages.feedback.contentRate}</Text>
                                    <TextInput
                                        multiline={true}
                                        numberOfLines={5}
                                        maxLength={300}
                                        onChangeText={onChangeText}
                                        value={text}
                                        style={styles.wrapComment}
                                    />
                                </>
                            }
                        </View>
                        {renderBtn}
                    </View>
                </HideKeyboard>
            </Modal>
        );
    }
);

export default PopupRating;

const styles = StyleSheet.create({
    popup: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.GRAY_13,
        borderRadius: 16,
        borderWidth: 1,
        paddingBottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 15
    },
    describeContent: {
        width: '100%',
        marginBottom: 24
    },
    txtTitle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        color: COLORS.DARK_GRAY,
        paddingBottom: 10
    },
    txtContent: {
        ...Styles.typography.regular,
        paddingTop: 10,
        fontSize: Configs.FontSize.size13,
        color: COLORS.DARK_GRAY,
        paddingBottom: 10
    },
    wrapComment: {
        width: '100%',
        height: SCREEN_WIDTH * 0.3,
        borderColor: COLORS.GRAY_11,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16
    },
    wrapStarRate: {
        flexDirection: 'column-reverse'
    },
    txtDescribePoint: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size11,
        color: COLORS.DARK_GRAY,
        paddingTop: 4
    },
    wrapIcClose: {
        alignSelf: 'flex-end'
    }
});
