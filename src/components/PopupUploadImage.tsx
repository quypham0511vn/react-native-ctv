import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

import Languages from '@/commons/Languages';
import ImageUtils from '@/utils/ImageUtils';
import BottomSheetComponent from './BottomSheet';
import { PopupActions } from './popup/types';

export type PopupUploadImageProps = {
    onImageSelected: (data: any) => any;
    maxSelect: number;
    useFrontCamera?: boolean;
};

const PopupUploadImage = forwardRef<PopupActions, PopupUploadImageProps>(
    (props: PopupUploadImageProps, ref) => {
        const actionSheetRef = useRef<PopupActions>(null);

        const ACTIONS = [
            { value: Languages.image.camera, key: 0 },
            { value: Languages.image.library, key: 1 }
        ];

        const show = useCallback(() => {
            actionSheetRef.current?.show();
        }, []);

        useImperativeHandle(ref, () => ({
            show
        }));

        const onImageSelected = useCallback((data: any) => {
            if (data) {
                props.onImageSelected?.(data);
            }
        }, [props]);

        const onChangeValue = useCallback((item: any) => {
            actionSheetRef.current?.hide?.();

            setTimeout(() => {
                if (item.key === 0) { // camera
                    ImageUtils.openCamera(onImageSelected, props.useFrontCamera);
                } else if (item.key === 1) { // library
                    ImageUtils.openLibrary(onImageSelected, props.maxSelect);
                }
            }, 300);
        }, [onImageSelected, props.maxSelect, props.useFrontCamera]);

        return (
            <BottomSheetComponent
                ref={actionSheetRef}
                data={ACTIONS}
                onPressItem={onChangeValue}
                hasDash
            />
        );
    });

export default PopupUploadImage;
