import { TextStyle, ViewStyle } from 'react-native';

import { BUTTON_STYLES } from './constants';

export type ButtonProps = {
    label: string | number;
    style?: TextStyle;
    textStyleValue?: TextStyle;
    buttonStyle?: keyof typeof BUTTON_STYLES;
    fontSize?: number;
    buttonContainer?: ViewStyle;
    textColor?: string;
    icon?: any;
    isLoading?: boolean;
    leftIcon?: any;
    onPress?: (tag?: string) => any;
    disabled?: boolean;
    hasRightIcon?: boolean,
    isIconFont?: boolean,
    isLowerCase?: boolean,
    tag?: any,
    radius?:any,
    rightIcon?: any;
    textStyle?: any;
    value?: string;
    loading?: boolean;

};
