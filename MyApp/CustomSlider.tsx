import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    PanResponder,
    Animated,
    Dimensions,
} from 'react-native';

type CustomSliderProps = {
    minimumValue?: number;
    maximumValue?: number;
    step?: number;
    value?: number;
    onValueChange?: (value: number) => void;
    trackColor?: string;
    thumbColor?: string;
    minimumTrackColor?: string;
};

const CustomSlider: React.FC<CustomSliderProps> = ({
    minimumValue = 0,
    maximumValue = 100,
    step = 1,
    value = 50,
    onValueChange,
    trackColor = '#d3d3d3',
    thumbColor = '#1FB28A',
    minimumTrackColor = '#1FB28A',
}) => {
    const sliderWidth = Dimensions.get('window').width * 0.8;

    // Calculate the initial thumb position based on `value`
    const initialPosition = ((value - minimumValue) / (maximumValue - minimumValue)) * sliderWidth;

    const pan = useRef(new Animated.Value(initialPosition)).current; // Animated value for thumb position
    const [currentValue, setCurrentValue] = useState(value); // Current value state
    const currentPanValue = useRef(initialPosition); // Track current thumb position

    // Ensure the thumb position updates when the `value` prop changes
    useEffect(() => {
        const newPosition = ((value - minimumValue) / (maximumValue - minimumValue)) * sliderWidth;
        pan.setValue(newPosition); // Update animated value
        setCurrentValue(value); // Update current value
    }, [value, minimumValue, maximumValue, sliderWidth]);

    useEffect(() => {
        const listenerId = pan.addListener(({ value }) => {
            currentPanValue.current = value; // Update current thumb position
            const ratio = value / sliderWidth;
            const calculatedValue = minimumValue + ratio * (maximumValue - minimumValue);
            setCurrentValue(Math.round(calculatedValue / step) * step); // Snap to step
        });

        return () => pan.removeListener(listenerId); // Cleanup listener on unmount
    }, [pan, sliderWidth, minimumValue, maximumValue, step]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                // Constrain the thumb position within bounds
                let newValue = currentPanValue.current + gestureState.dx / 2; // Reduce sensitivity
                newValue = Math.max(0, Math.min(sliderWidth, newValue)); // Constrain thumb position

                pan.setValue(newValue); // Update animated value
                if (onValueChange) {
                    const ratio = newValue / sliderWidth;
                    const calculatedValue = minimumValue + ratio * (maximumValue - minimumValue);
                    onValueChange(Math.round(calculatedValue / step) * step);
                }
            },
            onPanResponderRelease: () => {
                // Snap the thumb to the nearest step
                const valueRatio = currentPanValue.current / sliderWidth;
                const sliderValue = minimumValue + valueRatio * (maximumValue - minimumValue);
                const steppedValue = Math.round(sliderValue / step) * step;
                Animated.spring(pan, {
                    toValue: ((steppedValue - minimumValue) / (maximumValue - minimumValue)) * sliderWidth,
                    useNativeDriver: false,
                }).start();
            },
        })
    ).current;

    return (
        <View style={styles.container}>
            {/* Track */}
            <View style={[styles.track, { backgroundColor: trackColor, width: sliderWidth }]} />
            {/* Minimum Track */}
            <Animated.View
                style={[
                    styles.minimumTrack,
                    {
                        backgroundColor: minimumTrackColor,
                        width: pan.interpolate({
                            inputRange: [0, sliderWidth],
                            outputRange: [0, sliderWidth],
                        }),
                    },
                ]}
            />
            {/* Thumb */}
            <Animated.View
                {...panResponder.panHandlers}
                style={[
                    styles.thumb,
                    {
                        backgroundColor: thumbColor,
                        transform: [{ translateX: Animated.subtract(pan, new Animated.Value(sliderWidth/2)) }],
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
    },
    track: {
        height: 4,
        borderRadius: 2,
        position: 'absolute',
    },
    minimumTrack: {
        height: 4,
        borderRadius: 2,
        position: 'absolute',
        left: 0,
    },
    thumb: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    valueText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CustomSlider;
