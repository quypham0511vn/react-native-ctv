import React, { useCallback, useMemo } from 'react';
import {
    StyleSheet, View
} from 'react-native';
import Carousel from 'react-native-snap-carousel';

import { SCREEN_WIDTH } from '@/utils/ScreenUtils';
import { IconSize } from '@/theme/iconsize';
import { BannerModel } from '@/models/banner';
import { Touchable } from '.';
import Utils from '@/utils/Utils';
import { MyImageView } from './image';

const Banner = ({ banners }: any) => {

    const renderBannerItem = useCallback(({ item, index }: { item: BannerModel, index: number }) => {

        const onOpenLink = () => {
            Utils.openURL(item?.link);
        };

        return (
            <Touchable onPress={item?.link ? onOpenLink : undefined}
            >
                <MyImageView
                    key={index}
                    imageUrl={item.image_mobile || item.image_mb}
                    resizeMode={'cover'}
                    style={styles.bannerImage} />
            </Touchable>
        );
    }, []);
    const renderBanner = useMemo(() => <View style={styles.bannerContainer}>
        {banners && <Carousel
            data={banners}
            renderItem={renderBannerItem}
            sliderWidth={SCREEN_WIDTH + 20}
            itemWidth={IconSize.sizeBanner.width}
            autoplay
            loop
            autoplayDelay={500}
        />}
    </View>, [banners, renderBannerItem]);

    return (
        renderBanner
    );
};

export default Banner;

const styles = StyleSheet.create({
    bannerContainer: {
        height: IconSize.sizeBanner.height,
        marginTop: 25,
        marginLeft: -20
    },
    bannerImage: {
        ...IconSize.sizeBanner,
        borderRadius: 10
    }
});
