import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import {
    StyleSheet, View
} from 'react-native';

import IcSearch from '@/assets/images/ic_black_search.svg';
import Languages from '@/commons/Languages';
import { COLORS } from '@/theme';
import { MyTextInput } from './elements/textfield';
import { TextFieldActions } from './elements/textfield/types';
import { Touchable } from './elements';

type InputSearchProps = {
    value: string, placeHolder?: string, onChangeText: (text: string) => void, onPressSearch: (text?: string) => void
};

const InputSearchComponent = forwardRef<TextFieldActions, InputSearchProps>((
    { value, onChangeText, placeHolder, onPressSearch }: InputSearchProps, ref: any) => {

    const inputSearchRef = useRef<TextFieldActions>(null);

    useImperativeHandle(ref, () => ({
        setValue
    }));

    const setValue = useCallback((text: string) => {
        inputSearchRef.current?.setValue(text);
    }, []);

    const handlePressSearch = useCallback(() => {
        onPressSearch?.(value);
    }, [onPressSearch, value]);

    const renderInput = useCallback((_value: string, _placeHolder: string, _maxLength: number) => {
        const handleChangeText = (text: string) => {
            onChangeText(text || '');
        };
        return (
            <MyTextInput ref={inputSearchRef} value={_value} placeHolder={_placeHolder || Languages.common.search} customerRightIcon={<IcSearch />}
                onChangeText={handleChangeText} maxLength={_maxLength} containerInput={styles.containerInput} onClickRightIcon={handlePressSearch}
            />
        );
    }, [handlePressSearch, onChangeText]);
    return (
        <View style={styles.allContainer}>
            {renderInput(value || '', placeHolder || '', 30)}
        </View>
    );
});

export default InputSearchComponent;

const styles = StyleSheet.create({
    allContainer: {
        flex: 1
    },
    containerInput: {
        width: '100%',
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.GRAY_16
    }
});
