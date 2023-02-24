import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useState,
    useEffect,
    useMemo
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DatePicker, { DatePickerProps } from 'react-native-date-picker';

import { COLORS, Styles } from '@/theme';
import DateUtils from '@/utils/DateUtils';
import { SCREEN_WIDTH } from '@/utils/ScreenUtils';
import { Touchable } from '.';
import Languages from '@/commons/Languages';
import { Configs } from '@/commons/Configs';
import Validate from '@/utils/Validate';

interface MyDatePickerProps extends DatePickerProps {
    title?: string;
    dateString?: string; // DD/MM/YYYY
    rightIcon?: any;
    disabled?: boolean;
    onConfirmDatePicker: (date: string, tag?: string) => void;
    onCancelDatePicker?: () => void;
    onDateChangeDatePicker?: (date: string, tag?: string) => void;
}

export type MyDatePickerActions = {
    show?: (content?: string) => any;
    hide?: (content?: string) => any;
    setError?: (message?: string) => void;
};

const MyDatePicker = forwardRef<MyDatePickerActions, MyDatePickerProps>(
    (
        {
            title,
            onConfirmDatePicker,
            maximumDate,
            minimumDate,
            onCancel,
            dateString,
            rightIcon,
            disabled
        }: MyDatePickerProps,
        ref
    ) => {
        const [visible, setVisible] = useState<boolean>(false);
        const [dateValue, setDateValue] = useState<Date>(DateUtils.getDateFromString(dateString));
        const [dateDisplayed, setDateDisplayed] = useState<string>();
        const [dateDisplayedColor, setDateDisplayedColor] = useState<string>(COLORS.GRAY_6);

        const [errMsg, setErrMsg] = useState<string>('');

        useEffect(() => {
            const displayed = dateString ? DateUtils.getLongFromDate(dateValue.valueOf() / 1000) : Languages.profileAuth.birthDate;
            setDateDisplayedColor(dateString ? COLORS.BLACK: COLORS.GRAY_4);

            setDateDisplayed(displayed);
        }, []);

        const show = useCallback(() => {
            setVisible(true);
        }, []);

        const hide = useCallback(() => {
            setVisible(false);
            onCancel?.();
        }, [onCancel]);

        const setError = useCallback((error?: string) => {
            setErrMsg(error || '');
        }, []);

        useImperativeHandle(ref, () => ({
            show,
            hide,
            setError
        }));

        const onChange = useCallback(
            (value: Date) => {
            }, []);

        const onConfirm = useCallback(
            (value: Date) => {
                setDateValue(value);

                const displayed = value ? DateUtils.getLongFromDate(value.valueOf() / 1000) : '';

                setDateDisplayedColor(COLORS.BLACK);
                setDateDisplayed(displayed);
                onConfirmDatePicker(displayed);
                hide?.();
            },
            [hide, onConfirmDatePicker]
        );

        const errorMessage = useMemo(() => {
            const paddingText = { paddingBottom: 0 };
            if (!Validate.isStringEmpty(errMsg)) {
                return <View style={paddingText}>
                    <Text
                        style={styles.errorMessage}>{errMsg}</Text>
                </View>;
            }
            return null;
        }, [errMsg]);

        const style = {
            backgroundColor: disabled ? COLORS.GRAY_2 : COLORS.WHITE
        };

        return (
            <View style={styles.containerInput}>
                <Text style={styles.title}>{Languages.profileAuth.birthDate}</Text>
                <Touchable style={[styles.inputContainer, style]} onPress={show} disabled={disabled}>
                    <Text style={[styles.content, {color: dateDisplayedColor}]}>{dateDisplayed}</Text>
                    {rightIcon && rightIcon}
                </Touchable>
                {errorMessage}
                <DatePicker
                    modal
                    mode="date"
                    open={visible}
                    locale={'vi'}
                    date={dateValue}
                    title={title}
                    onDateChange={onChange}
                    onCancel={hide}
                    onConfirm={onConfirm}
                    maximumDate={maximumDate}
                    minimumDate={minimumDate || new Date('1920-01-01')}
                    confirmText={Languages.common.agree}
                    cancelText={Languages.common.cancel}
                />
            </View>
        );
    }
);

export default MyDatePicker;

const styles = StyleSheet.create({
    itemPicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: (SCREEN_WIDTH - 70) / 2,
        borderWidth: 1,
        borderColor: COLORS.GRAY_4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: COLORS.WHITE
    },
    arrow: {
        paddingVertical: 6
    },
    placeholderDate: {
        color: COLORS.GRAY_9
    },
    input: {
        borderColor: COLORS.GRAY_2,
        height: Configs.FontSize.size45,
        fontSize: Configs.FontSize.size14,
        borderRadius: 50
    },
    inputContainer: {
        justifyContent: 'space-between',
        paddingLeft: 5,
        borderRadius: 50,
        height: Configs.FontSize.size45,
        borderColor: COLORS.GRAY_2,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 16
    },
    title: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_17,
        marginBottom: 8
    },
    content: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_13,
        marginLeft: 10
    },
    errorMessage: {
        fontSize: Configs.FontSize.size12,
        fontFamily: Configs.FontFamily.regular,
        color: COLORS.RED,
        marginLeft: 10
    },
    containerInput: {
        marginBottom: 12
    }
});
