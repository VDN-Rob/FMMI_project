import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

type PickerItem = {
    label: string;
    value: string | number;
};

type CustomPickerProps = {
    items: PickerItem[]; // Define type for items array
    selectedItem: string | number; // Define type for selected item
    onValueChange: (value: string | number) => void; // Callback type for value change
};

const CustomPicker: React.FC<CustomPickerProps> = ({
    items,
    selectedItem,
    onValueChange,
}) => {
    const renderItem = ({ item }: { item: PickerItem }) => (
        <TouchableOpacity
            style={[
                styles.item,
                item.value === selectedItem ? styles.selectedItem : null,
            ]}
            onPress={() => onValueChange(item.value)}
        >
            <Text style={styles.itemText}>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => String(item.value)}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '80%',
        maxHeight: 300,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    item: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectedItem: {
        backgroundColor: '#e0f7fa',
    },
    itemText: {
        fontSize: 16,
    },
});

export default CustomPicker;
