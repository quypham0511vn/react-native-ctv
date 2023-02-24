import React from 'react';
import {
    StyleSheet, View, Image
} from 'react-native';


const Thumbnail = ({image}:any) => (
    <View style={styles.container}>
        <Image source={image} />
    </View>
);

export default Thumbnail;

const styles = StyleSheet.create({
    container:{

    }
});
