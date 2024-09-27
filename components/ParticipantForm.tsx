import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import SimpleColorPicker from './ColorPicker';
import FormSubmissionIndicator from './FormSubmissionIndicator';


interface Participant {
  id: string;
  name: string;
  capacity: string;
  color: string;
}

interface ParticipantFormProps {
  participantInput: { name: string; capacity: string; color: string };
  handleParticipantChange: (field: keyof Omit<Participant, 'id'>, value: string) => void;
  handleAddParticipant: () => void;
  editingParticipant: boolean; // Include editingParticipant to check if it's in edit mode
  isSubmitting: boolean;




}

const ParticipantForm: React.FC<ParticipantFormProps> = ({
  participantInput,
  editingParticipant,
  handleParticipantChange,
  handleAddParticipant,
  isSubmitting,
  
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Participant Name</Text>
      <TextInput
        style={styles.input}
        value={participantInput.name}
        onChangeText={(text) => handleParticipantChange('name', text)}
      />
      <Text style={styles.label}>Capacity</Text>
      <TextInput
        style={styles.input}
        value={participantInput.capacity}
        keyboardType="numeric"
        onChangeText={(text) => handleParticipantChange('capacity', text)}
      />
      <Text style={styles.label}>Color</Text>
      <SimpleColorPicker
        selectedColor={participantInput.color}
        onSelectColor={(color: string) => handleParticipantChange('color', color)}
      />
      <Button
        title={editingParticipant ? 'Save Changes' : 'Add Participant'}
        onPress={handleAddParticipant}

      />
      <FormSubmissionIndicator isSubmitting={isSubmitting} />

    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 20,

  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default ParticipantForm;