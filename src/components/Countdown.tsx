import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet } from 'react-native';

import { COLORS } from '@/theme';

interface CountdownProps {
    seconds: number;
  }
const Countdown = ({ seconds }: CountdownProps) => {

    const [timeLeft, setTimeLeft] = useState<number>(seconds);
    const intervalRef = useRef<any>();

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTimeLeft((t) => t - 1);
        }, 1000);
        return () => clearInterval(intervalRef.current);
    }, []);
    
    useEffect(() => {
        if (timeLeft <= 0) {
            clearInterval(intervalRef.current);
        }
    }, [timeLeft]);

    return (<Text style={styles.color}>{timeLeft}s</Text>);
};

export default Countdown;
const styles = StyleSheet.create({
    color: {
        color: COLORS.RED_1
    }
});
