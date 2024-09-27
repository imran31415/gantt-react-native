import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Platform } from 'react-native';
import DatePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import FormSubmissionIndicator from './FormSubmissionIndicator';

interface Task {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  assignee: string;
}

interface TaskFormProps {
  taskInput: Task; // The input values for the task being edited or created
  handleInputChange: (field: keyof Omit<Task, 'id'>, value: any) => void;
  handleAddOrEditTask: () => void;
  participants?: { id: string; name: string }[];  // Optional participants prop
  isSubmitting: boolean;  // New prop for form submission status
}

const TaskForm: React.FC<TaskFormProps> = ({
  taskInput,
  handleInputChange,
  handleAddOrEditTask,
  participants = [], // Default participants to an empty array
  isSubmitting,      // Destructure the new isSubmitting prop
}) => {
  console.log("Form task input:", taskInput); // Debugging to see what task data is passed to the form

  // Fix Date Handling in handleDateChange
  const handleDateChange = (field: keyof Omit<Task, 'id'>, date: Date | undefined) => {
    if (date) {
      handleInputChange(field, date); // Pass the actual Date object, not a string
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Task Name</Text>
        <TextInput
          style={styles.input}
          value={taskInput.name || ''} // Ensure default value for task name
          onChangeText={(text) => handleInputChange('name', text)}
          placeholder="Enter Task Name"
          editable={!isSubmitting}
        />

        <Text style={styles.label}>Start Date</Text>
        {Platform.OS === 'web' ? (
          <input
            type="date"
            value={taskInput.start ? new Date(taskInput.start).toISOString().split('T')[0] : ''}
            onChange={(e) => handleInputChange('start', new Date(e.target.value))}
            style={styles.webInput}
            disabled={isSubmitting}
          />
        ) : (
          <DatePicker
            mode="date"
            display="default"
            value={taskInput.start || new Date()}
            onChange={(_event, date) => handleDateChange('start', date)}
            style={Platform.OS === 'ios' ? styles.iosPicker : undefined}
            disabled={isSubmitting}
          />
        )}

        <Text style={styles.label}>End Date</Text>
        {Platform.OS === 'web' ? (
          <input
            type="date"
            value={taskInput.end ? new Date(taskInput.end).toISOString().split('T')[0] : ''}
            onChange={(e) => handleInputChange('end', new Date(e.target.value))}
            style={styles.webInput}
            disabled={isSubmitting}
          />
        ) : (
          <DatePicker
            mode="date"
            display="default"
            value={taskInput.end || new Date()}
            onChange={(_event, date) => handleDateChange('end', date)}
            style={Platform.OS === 'ios' ? styles.iosPicker : undefined}
            disabled={isSubmitting}
          />
        )}

        <Text style={styles.label}>Progress (%)</Text>
        <Picker
          selectedValue={taskInput.progress?.toString() || '0'}
          onValueChange={(value) => handleInputChange('progress', parseInt(value))}
          style={styles.picker}
          enabled={!isSubmitting}
        >
          <Picker.Item label="0%" value="0" />
          <Picker.Item label="25%" value="25" />
          <Picker.Item label="50%" value="50" />
          <Picker.Item label="75%" value="75" />
          <Picker.Item label="100%" value="100" />
        </Picker>

        {participants.length > 0 ? (
          <>
            <Text style={styles.label}>Assignee</Text>
            <Picker
              selectedValue={taskInput.assignee || ''}
              onValueChange={(value) => handleInputChange('assignee', value)}
              style={styles.picker}
              enabled={!isSubmitting}
            >
              <Picker.Item label="Select Assignee" value="" />
              {participants.map((participant) => (
                <Picker.Item key={participant.id} label={participant.name} value={participant.id} />
              ))}
            </Picker>
          </>
        ) : (
          <View>
            <Text>No Participants Available</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button title="Save Task" onPress={handleAddOrEditTask} disabled={isSubmitting || !taskInput.name} />
        </View>

        {/* Submission Indicator */}
        <FormSubmissionIndicator isSubmitting={isSubmitting} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  webInput: {
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    fontSize: 14,
  },
  picker: {
    marginBottom: 20,
  },
  iosPicker: {
    backgroundColor: 'white',
    marginVertical: 10,
    width: '100%',
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 50, // Center button horizontally
    alignItems: 'center',
  },
});

export default TaskForm;