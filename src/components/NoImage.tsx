import React, { useRef } from 'react';

import IcDefaultAvatar from '@/assets/images/ic_default_avatar.svg';
import { SCREEN_WIDTH } from '@/utils/ScreenUtils';

const RATIO = 3.81;
interface Size {
    width: number,
    height: number,
}
const NoImage = ({ style }: any) => {
    const size = useRef<Size>({
        width: style.width ? style.width : SCREEN_WIDTH / 1.6,
        height: style ? style.height : SCREEN_WIDTH / 1.6 / RATIO
    });

    return <IcDefaultAvatar
        {...size.current}
    />;
};

export default NoImage;
