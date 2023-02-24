import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useState
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import moment from 'moment';
import CalendarPicker from 'react-native-calendar-picker';
import Modal from 'react-native-modal';

import IcRightArrow from '@/assets/images/ic_right_arrow_date_picker.svg';
import IcLeftArrow from '@/assets/images/ic_left_arrow_date_picker.svg';
import { COLORS, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/ScreenUtils';
import { Touchable } from '.';
import Languages from '@/commons/Languages';
import { Configs } from '@/commons/Configs';
import { DayOfWeek, MonthName, TYPE_DATE } from '@/commons/constants';

interface MyDatePickerProps {
    title?: string;
    visibleModal?: boolean;
    maximumDate?: string;
    minimumDate?: string;
    backdropOpacity?: number;
    startDateValue?: string;
    endDateValue?: string;
    onCancel?: () => any;
    onConfirm?: (selectedStartDate?: any, selectedEndDate?: any) => void;
    onCancelDatePicker?: () => void;
    onDateChangeDatePicker?: (date: string, tag?: string) => void;
}

export type MyDatePickerActions = {
    show?: (content?: string) => any;
    hide?: (content?: string) => any;
    setError?: (message?: string) => void;
};

const MyRangeDatePicker = forwardRef<MyDatePickerActions, MyDatePickerProps>(
    (
        {
            title,
            maximumDate,
            minimumDate,
            backdropOpacity,
            startDateValue,
            endDateValue,
            onConfirm,
            onCancel
        }: MyDatePickerProps,
        ref
    ) => {
        const [visible, setVisible] = useState<boolean>(false);
        const [selectedStartDate, setSelectedStartDate] = useState<Date>();
        const [selectedEndDate, setSelectedEndDate] = useState<Date>();

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

        const onCancelBtn = useCallback(() => {
            hide?.();
            onCancel?.();
        }, [hide, onCancel]);

        const onSaveBtn = useCallback(() => {
            const beginDate = selectedStartDate ? moment.utc(selectedStartDate).format('DD/MM/YYYY') : '';
            const finishDate = selectedEndDate ? moment.utc(selectedEndDate).format('DD/MM/YYYY') : '';
            hide?.();
            onConfirm?.(beginDate, finishDate);
        }, [hide, onConfirm, selectedEndDate, selectedStartDate]);

        const onDateChange = (date: any, type: string) => {
            if (type === TYPE_DATE.END_DATE) {
                setSelectedEndDate(date);
            } else {
                setSelectedEndDate(undefined);
                setSelectedStartDate(date);
            }
        };

        return (
            <Modal
                isVisible={visible}
                animationIn='fadeIn'
                animationOut='fadeOut'
                useNativeDriver={true}
                onBackdropPress={hide}
                avoidKeyboard={true}
                onDismiss={hide}
                hideModalContentWhileAnimating
                backdropOpacity={backdropOpacity || 0.5}
            >
                <View style={styles.inputContainer}>
                    <Text style={styles.title}>{title || Languages.profileAuth.birthDate}</Text>
                    <CalendarPicker
                        startFromMonday={true}
                        // selectedStartDate={selectedStartDate && moment(selectedStartDate)}
                        // selectedEndDate={selectedEndDate && moment(selectedEndDate)}
                        selectMonthTitle={Languages.historyPayment.monthChoose}
                        selectYearTitle={Languages.historyPayment.yearChoose}
                        allowRangeSelection={true}
                        minDate={minimumDate}
                        maxDate={maximumDate || new Date()}
                        weekdays={DayOfWeek}
                        months={MonthName}
                        width={SCREEN_WIDTH * 0.7}
                        todayBackgroundColor={COLORS.BLUE}
                        selectedDayColor={COLORS.GREEN_2}
                        selectedDayTextColor={COLORS.GRAY_10}
                        scaleFactor={SCREEN_WIDTH * 0.8}
                        monthTitleStyle={styles.monthStyle}
                        yearTitleStyle={styles.yearStyle}
                        textStyle={styles.textStyle}
                        previousComponent={<IcLeftArrow />}
                        nextComponent={<IcRightArrow />}
                        disabledDatesTextStyle={styles.disableText}
                        onDateChange={onDateChange}
                    />
                    <View style={styles.wrapButton}>
                        <Touchable style={styles.confirmButton} onPress={onSaveBtn}>
                            <Text style={styles.txtVerify}>{Languages.common.save}</Text>
                        </Touchable>
                        <Touchable onPress={onCancelBtn} style={styles.cancelButton}>
                            <Text style={styles.txtCancel}>{Languages.common.cancel}</Text>
                        </Touchable>
                    </View>
                </View>

            </Modal>
        );
    }
);

export default MyRangeDatePicker;

const styles = StyleSheet.create({

    inputContainer: {
        justifyContent: 'center',
        paddingHorizontal: 5,
        borderRadius: 12,
        paddingVertical: 12,
        borderColor: COLORS.GRAY_2,
        borderWidth: 1,
        backgroundColor: COLORS.WHITE

    },
    title: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        marginBottom: 5,
        marginLeft: 16,
        color: COLORS.GRAY_13
    },

    errorMessage: {
        fontSize: Configs.FontSize.size12,
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.RED,
        marginLeft: 10
    },
    monthStyle: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_17
    },
    yearStyle: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_13
    },
    textStyle: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_13
    },
    disableText: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6
    },
    wrapButton: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        borderTopColor: COLORS.GRAY_14,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        paddingTop: 12
    },
    cancelButton: {
        paddingHorizontal: 12,
        backgroundColor: COLORS.WHITE,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderColor: COLORS.RED,
        borderWidth: 1
    },
    confirmButton: {
        backgroundColor: COLORS.GREEN_2,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginLeft: 8
    },
    txtVerify: {
        ...Styles.typography.regular,
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size14,
        paddingHorizontal: 12
    },
    txtCancel: {
        ...Styles.typography.regular,
        color: COLORS.RED,
        fontSize: Configs.FontSize.size14,
        paddingHorizontal: 12
    }
});
