import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetFlatList,
    BottomSheetModal,
    BottomSheetTextInput
} from '@gorhom/bottom-sheet';
import CheckBox from '@react-native-community/checkbox';
import { debounce } from 'lodash';
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import Dash from 'react-native-dash';

import { COLORS } from '@/theme';
import Languages from '@/commons/Languages';
import IcFindingContract from '@/assets/images/ic_search.svg';
import { Configs, PADDING_BOTTOM } from '@/commons/Configs';
import { SCREEN_HEIGHT } from '@/utils/ScreenUtils';
import { Touchable } from './elements';

export type ItemProps = {
    value?: string;
    id?: string | number;
    selected?: boolean;
    price?: string;
    text?: string;
    icon?: any;
};

type BottomSheetProps = {
    data?: ItemProps[];
    onPressItem?: (item: any) => void;
    onPressBackDrop?: () => any;
    onClose?: () => any;
    isCheckboxList?: boolean;
    hasDash?: boolean;
    rightIcon?: any;
    placeholderSearch?: string;
    title?: string;
    leftIcon?: any;
};

export type BottomSheetAction = {
    show: (content?: string) => any;
    hide?: (content?: string) => any;
    setContent?: (message: string) => void;
};


const BottomSheetComponent = forwardRef<BottomSheetAction, BottomSheetProps>(
    ({ title, data, leftIcon, onPressItem, isCheckboxList, hasDash, rightIcon, placeholderSearch, onPressBackDrop, onClose }: BottomSheetProps, ref) => {
        const bottomSheetModalRef = useRef<BottomSheetModal>(null);
        const [textSearch, setTextSearch] = useState('');
        const [dataFilter, setDataFilter] = useState<ItemProps[]>();
        const [focus, setFocus] = useState<boolean>(false);

        const CustomBackdrop = useCallback((props: BottomSheetBackdropProps) =>
            <BottomSheetBackdrop {...props} pressBehavior='close' onPress={onPressBackDrop} />
        , [onPressBackDrop]);

        useEffect(() => {
            setDataFilter(data);
        }, [data]);

        const snapPoints = useMemo(() => {
            const num = data?.length as number;
            const contentHeight = num * ITEM_HEIGHT + PADDING_BOTTOM + (num > MIN_SIZE_HAS_INPUT ? HEADER_HEIGHT : 0);  // + input height
            let ratio = contentHeight * 100 / SCREEN_HEIGHT;
            ratio = Math.max(ratio, 15);
            ratio = Math.min(ratio, 70);

            return [`${ratio}%`, `${ratio}%`];
        }, [data]);

        const show = useCallback(() => {
            bottomSheetModalRef.current?.present();
        }, []);

        const hide = useCallback(() => {
            bottomSheetModalRef.current?.dismiss();
        }, []);

        useImperativeHandle(ref, () => ({
            show,
            hide
        }));

        const handleSheetChanges = useCallback(() => { }, []);

        const searchItem = useCallback(
            (text: string) => {
                if (text) {
                    setDataFilter(
                        data?.filter((item) =>
                            (item.text ? item.text : item.value)?.toUpperCase().includes(text.toUpperCase())
                        )
                    );
                }
                if (text === '') {
                    setDataFilter(data);
                }
            },
            [data]
        );

        const debounceSearchItem = useCallback(
            debounce((text: string) => searchItem(text), 0),
            [searchItem]
        );
        const handleInputOnchange = useCallback(
            (value: string) => {
                setTextSearch(value);
                debounceSearchItem(value);
            },
            [debounceSearchItem]
        );

        const renderItem = useCallback(
            ({ item }: any) => {
                const onPressCheckbox = () => {
                    onPressItem?.(item);
                };
                const onPress = () => {
                    onPressItem?.(item);
                    hide();
                };
                if (isCheckboxList === true) {
                    return (
                        <TouchableOpacity
                            style={styles.wrapCheckbox}
                            onPress={onPressCheckbox}
                        >
                            <CheckBox
                                boxType="square"
                                value={item?.selected}
                                style={styles.checkbox}
                                onCheckColor={COLORS.GREEN}
                                onTintColor={COLORS.GREEN}
                                animationDuration={0.2}
                                onAnimationType="fade"
                                offAnimationType="fade"
                                lineWidth={1}
                                tintColors={{ true: COLORS.GREEN, false: COLORS.BLACK }}
                            />
                            <Text style={styles.txt}>{item?.text ? item?.text : item.value}</Text>
                        </TouchableOpacity>
                    );
                }
                return (
                    <TouchableOpacity onPress={onPress}>
                        <View style={styles.item}>
                            {item?.icon && <Image source={{ uri: item?.icon }} style={styles.iconStyle} />}
                            <Text style={styles.txt}>{item?.text ? item?.text : item.value}</Text>
                            {rightIcon}
                        </View>
                        {hasDash && <Dash
                            dashThickness={1}
                            dashLength={6}
                            dashGap={6}
                            dashColor={COLORS.GRAY_16}
                        />}
                    </TouchableOpacity>
                );
            }, [hasDash, hide, isCheckboxList, onPressItem, rightIcon]);

        const keyExtractor = useCallback((item: any, index: number) => `${index}`, []);
        const onFocus = useCallback(() => {
            setFocus(true);
        }, []);

        const renderTextInput = useMemo(() => {
            const num = data?.length as number;
            if (num > MIN_SIZE_HAS_INPUT) {
                return (
                    <View style={styles.searchContainer}>
                        <Touchable
                            onPress={() => handleInputOnchange(textSearch)}
                            style={styles.wrapIcon}
                        >
                            <IcFindingContract />
                        </Touchable>
                        <BottomSheetTextInput
                            value={textSearch}
                            style={[
                                styles.input,
                                { borderColor: focus ? COLORS.GREEN : COLORS.GRAY }
                            ]}
                            onChangeText={handleInputOnchange}
                            onFocus={onFocus}
                            placeholder={placeholderSearch || Languages.common.search}
                            placeholderTextColor={COLORS.BACKDROP}
                        />
                    </View>
                );
            }
            return null;
        }, [data?.length, focus, handleInputOnchange, onFocus, placeholderSearch, textSearch]);

        return (
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                backdropComponent={CustomBackdrop}
                keyboardBehavior={'interactive'}
                onDismiss={onClose}
                enablePanDownToClose={true}
                enableOverDrag={true}
            >
                <View style={styles.contentContainer}>
                    {renderTextInput}
                    <BottomSheetFlatList
                        testID={title}
                        data={dataFilter}
                        renderItem={renderItem}
                        style={styles.flatList}
                        contentContainerStyle={styles.flatListContainer}
                        keyExtractor={keyExtractor}
                    />
                </View>
            </BottomSheetModal>
        );
    }
);

export default BottomSheetComponent;

const ITEM_HEIGHT = Configs.FontSize.size40;
const HEADER_HEIGHT = Configs.FontSize.size40 + 30;
const MIN_SIZE_HAS_INPUT = 10;

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1
    },
    flatList: {
        flex: 1,
        borderTopColor: COLORS.GRAY_6,
        paddingHorizontal: 5
    },
    flatListContainer: {
        paddingHorizontal: 15,
        paddingBottom: PADDING_BOTTOM
    },
    input: {
        justifyContent: 'center',
        paddingHorizontal: 5,
        height: 40,
        width: '90%',
        color: COLORS.BACKDROP
    },
    item: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchContainer: {
        height: ITEM_HEIGHT,
        marginBottom: 10,
        marginHorizontal: 15,
        paddingHorizontal: 15,
        flexDirection: 'row',
        borderRadius: 10,
        backgroundColor: COLORS.GRAY_2
    },
    checkbox: {
        width: 20,
        height: 20,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    wrapCheckbox: {
        flexDirection: 'row',
        height: ITEM_HEIGHT,
        alignItems: 'center'
    },
    txt: {
        justifyContent: 'center',
        color: COLORS.BLACK,
        flex: 1
    },
    wrapIcon: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconStyle: {
        width: 30,
        height: 30,
        marginRight: 16,
        flex: 0.3
    }
});

