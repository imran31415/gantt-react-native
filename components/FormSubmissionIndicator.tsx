import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface FormSubmissionIndicatorProps {
  isSubmitting: boolean;
}

const FormSubmissionIndicator: React.FC<FormSubmissionIndicatorProps> = ({ isSubmitting }) => {
  return (
    <View style={styles.indicatorContainer}>
      {isSubmitting ? (
        Platform.OS === 'web' ? (
          <Text style={styles.indicatorText}>Submitting...</Text>
        ) : (
          <ActivityIndicator size="large" color="#007bff" />
        )
      ) : (
        <Icon name="check-circle" size={40} color="#28a745" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  indicatorText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default FormSubmissionIndicator;