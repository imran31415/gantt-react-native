import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform, Dimensions } from 'react-native';

interface Task {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  assignee: string; // Stores participant.id
  color?: string;
}

interface Participant {
  id: string;
  name: string;
  color: string;
}

interface TaskListProps {
  task: Task;
  participants: Participant[];
  taskColor: string;
  handleEditTask: (task: Task) => void;
  handleDeleteTask: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ task, participants, handleEditTask, handleDeleteTask }) => {
  const assignedParticipant = participants.find(p => p.id === task.assignee);

  const screenWidth = Dimensions.get('window').width;

  if (Platform.OS === 'web') {
    // For small screen sizes, switch to mobile-friendly layout
    if (screenWidth < 768) {
      // Mobile-friendly card layout on web
      return (
        <View style={styles.mobileCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.taskTitle}>{task.name}</Text>
            {assignedParticipant && (
              <View style={[styles.colorBox, { backgroundColor: assignedParticipant.color || '#ccc' }]} />
            )}
          </View>
          <View style={styles.cardBody}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Start: </Text>
              <Text style={styles.infoText}>{new Date(task.start).toLocaleDateString()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>End: </Text>
              <Text style={styles.infoText}>{new Date(task.end).toLocaleDateString()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Progress: </Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${task.progress}%` }]} />
              </View>
              <Text style={styles.infoText}>{task.progress}%</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Assignee: </Text>
              <Text style={styles.infoText}>
                {assignedParticipant ? assignedParticipant.name : 'No Assignee'}
              </Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Pressable onPress={() => handleEditTask(task)} style={styles.actionButton}>
              <Text style={styles.buttonText}>Edit</Text>
            </Pressable>
            <Pressable onPress={() => handleDeleteTask(task.name)} style={styles.actionButton}>
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    // Desktop layout: Excel-style row layout
    return (
      <View style={styles.row}>
        <Text style={styles.column}>{task.name}</Text>
        <Text style={styles.column}>{new Date(task.start).toLocaleDateString()}</Text>
        <Text style={styles.column}>{new Date(task.end).toLocaleDateString()}</Text>
        <View style={[styles.column, styles.progressContainer]}>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${task.progress}%` }]} />
          </View>
          <Text style={styles.columnText}>{task.progress}%</Text>
        </View>
        <Text style={styles.column}>
          {assignedParticipant ? assignedParticipant.name : 'No Assignee'}
        </Text>
        <View style={styles.column}>
          {assignedParticipant && (
            <View style={[styles.colorBox, { backgroundColor: assignedParticipant.color || '#ccc' }]} />
          )}
        </View>
        <View style={styles.column}>
          <Pressable onPress={() => handleEditTask(task)} style={styles.actionButton}>
            <Text style={styles.buttonText}>Edit</Text>
          </Pressable>
          <Pressable onPress={() => handleDeleteTask(task.name)} style={styles.actionButton}>
            <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Mobile layout: Card layout
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.taskTitle}>{task.name}</Text>
        {assignedParticipant && (
          <View style={[styles.colorBox, { backgroundColor: assignedParticipant.color || '#ccc' }]} />
        )}
      </View>
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Start: </Text>
          <Text style={styles.infoText}>{new Date(task.start).toLocaleDateString()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>End: </Text>
          <Text style={styles.infoText}>{new Date(task.end).toLocaleDateString()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Progress: </Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${task.progress}%` }]} />
          </View>
          <Text style={styles.infoText}>{task.progress}%</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Assignee: </Text>
          <Text style={styles.infoText}>
            {assignedParticipant ? assignedParticipant.name : 'No Assignee'}
          </Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Pressable onPress={() => handleEditTask(task)} style={styles.actionButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </Pressable>
        <Pressable onPress={() => handleDeleteTask(task.name)} style={styles.actionButton}>
          <Text style={styles.buttonText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Web styles: Excel-style row layout
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexWrap: 'wrap', // Allow columns to wrap on small screens
  },
  column: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 5,
    justifyContent: 'center',
    minWidth: 80, // Set a minimum width for columns
    maxWidth: 150, // Set a maximum width for columns
  },
  columnText: {
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ddd',
    marginLeft: 10,
  },
  progressBarContainer: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    height: 10, // Height of the progress bar
    marginHorizontal: 10, // Spacing between label and progress bar
  },
  progressBar: {
    backgroundColor: '#007bff',
    height: '100%',
    borderRadius: 5,
  },
  actionButton: {
    marginHorizontal: 5,
    paddingVertical: 5, // Adjust button padding for better spacing on mobile
  },
  buttonText: {
    color: '#007bff',
  },

  // Mobile styles: Card layout
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
    borderColor: '#ddd',
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  cardBody: {
    paddingBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  infoLabel: {
    fontWeight: '600',
    color: '#555',
  },
  infoText: {
    color: '#333',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 10,
  },
  // Mobile-friendly card layout for web view on small screens
  mobileCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
    borderColor: '#ddd',
    borderWidth: 1,
  },
});

export default TaskList;