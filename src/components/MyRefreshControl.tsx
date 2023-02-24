import React from 'react';
import {
    RefreshControl
} from 'react-native';

import { isIOS } from '@/commons/Configs';
import { COLORS } from '../theme';

export const attributeRefresh = {
    tintColor: isIOS ? COLORS.GREEN : undefined,
    colors: isIOS ? [COLORS.GREEN, COLORS.RED, COLORS.GRAY_1] : undefined
};

const MyRefreshControl = ({ isRefreshing, onRefresh }: { isRefreshing: boolean, onRefresh: () => any }) =>
    <RefreshControl
        {...attributeRefresh}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
    />;

export default MyRefreshControl;
