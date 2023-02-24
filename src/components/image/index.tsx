import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import Lightbox from 'react-native-lightbox';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@gorhom/bottom-sheet';

import { COLORS } from '@/theme';
import NoImage from '../NoImage';
import { MyImageViewProps } from './type';

export const MyImageView = React.memo(({ imageUrl, style, resizeMode, underlayColor }: MyImageViewProps) => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [url, setUrl] = useState<string | undefined>(imageUrl);

    useEffect(() => {
        setUrl(imageUrl);
    }, [imageUrl]);

    const _onLoadFailed = useCallback(() => {
        setLoading(false);
        setUrl('');
    }, []);

    const onLoadEnd = useCallback(() => {
        setLoading(false);
    }, []);

    const _onLoadStart = useCallback(() => {
        setLoading(true);
    }, []);

    const indicatorSize = useMemo(() => {
        if (style?.height > 200) {
            return 'large';
        }
        return 'small';
    }, [style?.height]);

    const renderContent = useCallback(() => <Image
        resizeMode={'contain'}
        source={{ uri: url }}
        style={styles.lightBoxImage}
    />, [url]);

    const renderImage = useMemo(() => (
        url ?
            <Lightbox
                renderContent={renderContent}
                springConfig={{
                    overshootClamping: true
                }}
                backgroundColor={COLORS.BACKDROP_3}
                underlayColor={underlayColor}
            >
                <FastImage
                    style={[styles.img, style]}
                    resizeMode={resizeMode || 'cover'}
                    source={{ uri: url }}
                    onLoadStart={_onLoadStart}
                    onError={_onLoadFailed}
                    onLoadEnd={onLoadEnd}
                >
                    <ActivityIndicator
                        style={styles.activityIndicator}
                        size={indicatorSize}
                        animating={isLoading}
                        color={COLORS.BLUE}
                    />
                </FastImage>
            </Lightbox> :
            <NoImage style={{ ...styles.img, ...style }} />
    ), [url, renderContent, underlayColor, style, resizeMode, _onLoadStart, _onLoadFailed, onLoadEnd, indicatorSize, isLoading]);

    return renderImage;
});

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    img: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    activityIndicator: {
        alignSelf: 'center'
    },
    lightBoxImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT / 2
    }
});
