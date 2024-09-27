import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface Task {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  assignee: string;
}

interface TooltipProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  position: { x: number; y: number }; // Position for tooltip
  handleEditTask: (task: Task) => void; // Trigger task edit
}

const formatDate = (date: Date | undefined) => {
  if (!date) return 'No date provided';
  return date.toDateString();
};

const Tooltip: React.FC<TooltipProps> = ({ visible, task, onClose, position, handleEditTask}) => {
  if (!visible || !task) return null;

  // Internal handler to ensure the correct task data is passed
  const handleEditTaskInternal = () => {
    if (task) {
      handleEditTask(task); // Pass the task to the parent handler
      onClose(); // Close the tooltip after triggering the edit
    }
  };

  return (
    <View style={[styles.tooltipContainer, { top: position.y, left: position.x }]}>
      <View style={styles.tooltipBox}>
        {/* Task Name */}
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{task.name}</Text>
        </View>

        {/* Task Start Date */}
        <View style={styles.row}>
          <Text style={styles.label}>Start:</Text>
          <Text style={styles.value}>{formatDate(task.start)}</Text>
        </View>

        {/* Task End Date */}
        <View style={styles.row}>
          <Text style={styles.label}>End:</Text>
          <Text style={styles.value}>{formatDate(task.end)}</Text>
        </View>

        {/* Task Progress */}
        <View style={styles.row}>
          <Text style={styles.label}>Progress:</Text>
          <Text style={styles.value}>{task.progress}%</Text>
        </View>

        {/* Task Assignee */}
        <View style={styles.row}>
          <Text style={styles.label}>Assignee:</Text>
          <Text style={styles.value}>{task.assignee}</Text>
        </View>

        {/* Edit Button */}
        <Pressable onPress={handleEditTaskInternal} style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Task</Text>
        </Pressable>

        {/* Close Button */}
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tooltipContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    maxWidth: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000,
    elevation: 10,
  },
  tooltipBox: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    zIndex: 1000,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  value: {
    fontSize: 14,
    color: '#007bff',
  },
  editButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default Tooltip;