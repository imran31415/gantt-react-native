import React from 'react';
import {Text, Platform, StyleSheet, Pressable } from 'react-native';

interface CommonButtonProps {
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  title: string
}

const CommonButton: React.FC<CommonButtonProps> = ({ onPress, title, color = '#007bff', disabled = false }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, { backgroundColor: disabled ? '#d3d3d3' : color }, disabled && styles.disabled]}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4, // Add margin to separate buttons
    elevation: 2,
    shadowColor: Platform.OS === 'web' ? 'rgba(0,0,0,0.3)' : 'transparent',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: 14, // Smaller font size
    color: '#fff',
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default CommonButton;