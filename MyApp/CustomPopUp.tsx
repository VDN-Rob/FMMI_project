import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    FlatList,
} from 'react-native';

type PickerItem = {
    label: string;
    value: string | number;
};

type PopupPickerProps = {
    items: PickerItem[];
    selectedItem: string | number;
    onValueChange: (value: string | number) => void;
};

const PopupPicker: React.FC<PopupPickerProps> = ({
    items,
    selectedItem,
    onValueChange,
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleSelect = (value: string | number) => {
        onValueChange(value);
        setIsModalVisible(false); // Close the modal after selection
    };

    return (
        <View>
            {/* Selected Value */}
            <TouchableOpacity
                style={styles.selectedValueContainer}
                onPress={() => setIsModalVisible(true)}
            >
                <Text style={styles.selectedValueText}>
                    {items.find((item) => item.value === selectedItem)?.label ||
                        'Select an option'}
                </Text>
            </TouchableOpacity>

            {/* Modal */}
            <Modal
                transparent={true}
                animationType="slide"
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={items}
                            keyExtractor={(item) => String(item.value)}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => handleSelect(item.value)}
                                >
                                    <Text style={styles.modalItemText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                            keyboardShouldPersistTaps="handled"
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setIsModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
    },
    modalItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalItemText: {
        fontSize: 16,
    },
    closeButton: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#007BFF',
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default PopupPicker;
