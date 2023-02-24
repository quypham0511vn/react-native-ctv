import { memo, MemoExoticComponent } from 'react';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';

import { ICONS } from './constant';

const IconTienngayBase = createIconSetFromIcoMoon(
    require('./selection.json'),
    'Tienngay',
    'tienngay.ttf'
);

export const IconTienngay = memo(IconTienngayBase) as MemoExoticComponent<
    typeof IconTienngayBase
> & {
    icons: typeof ICONS;
};

IconTienngay.icons = ICONS;
