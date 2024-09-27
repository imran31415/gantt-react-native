import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AppHeader: React.FC = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Plan Manager</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#007bff', // Use your preferred color
    paddingVertical: 10, // Padding for spacing
    paddingHorizontal: 20, // Horizontal padding
    justifyContent: 'center', // Center the text
    alignItems: 'center',
    shadowColor: '#000', // Optional shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
  headerText: {
    fontSize: 24, // Font size for the header
    fontWeight: 'bold',
    color: '#fff', // White text color
  },
});

export default AppHeader;