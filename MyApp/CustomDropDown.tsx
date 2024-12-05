import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from 'react-native';

type PickerItem = {
    label: string;
    value: string | number;
};

type DropdownPickerProps = {
    items: PickerItem[];
    selectedItem: string | number;
    onValueChange: (value: string | number) => void;
};

const DropdownPicker: React.FC<DropdownPickerProps> = ({
    items,
    selectedItem,
    onValueChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (value: string | number) => {
        onValueChange(value);
        setIsOpen(false); // Close the dropdown after selection
    };

    return (
        <View style={styles.container}>
            {/* Selected Value */}
            <TouchableOpacity
                style={styles.selectedValueContainer}
                onPress={() => setIsOpen(!isOpen)}
            >
                <Text style={styles.selectedValueText}>
                    {items.find((item) => item.value === selectedItem)?.label ||
                        'Select an option'}
                </Text>
            </TouchableOpacity>

            {/* Dropdown Menu */}
            {isOpen && (
                <View>
                {items.map((item) => (
                    <TouchableOpacity
                        key={item.value}
                        style={styles.dropdownItem}
                        onPress={() => handleSelect(item.value)}
                    >
                        <Text style={styles.dropdownItemText}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '80%',
    },
    selectedValueContainer: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    selectedValueText: {
        fontSize: 16,
        color: '#333',
    },
    dropdown: {
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        maxHeight: 200,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dropdownItemText: {
        fontSize: 16,
    },
});

export default DropdownPicker;
