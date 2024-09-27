import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

// Define types for the props
interface SimpleColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

// Predefined color options
const colorOptions = ['#ff0000', '#00ff00', '#0000ff', '#ffcc00', '#ff66cc'];

const SimpleColorPicker: React.FC<SimpleColorPickerProps> = ({ selectedColor, onSelectColor }) => {
  return (
    <View style={styles.colorPickerContainer}>
      <Text style={styles.label}>Choose Color</Text>
      <View style={styles.colorOptionsContainer}>
        {colorOptions.map((color) => (
          <Pressable
            key={color}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              selectedColor === color && styles.selectedColor,
            ]}
            onPress={() => onSelectColor(color)}
          />
        ))}
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  colorPickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  selectedColor: {
    borderColor: '#000',
    borderWidth: 3,
  },
});

export default SimpleColorPicker;