import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Task {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  assignee: string | null;
}

interface Participant {
  id: string;
  name: string;
  capacity: string;
  color: string;
}

interface ScoreboardProps {
  tasks: Task[];
  participants: Participant[];
}

const Scoreboard: React.FC<ScoreboardProps> = ({ tasks, participants }) => {
  const totalTasks = tasks.length;

  // Calculate Number of Unassigned Tasks
  const unassignedTasks = tasks.filter(task => !task.assignee).length;

  // Helper function to calculate total capacity
  const getTotalCapacity = (participants: Participant[]): number => {
    return participants.reduce((total, participant) => {
      const capacityNumber = parseFloat(participant.capacity);
      return total + (isNaN(capacityNumber) ? 0 : capacityNumber);
    }, 0);
  };

  // Calculate Number of Blocked Tasks
  const blockedTasks = tasks.filter(task => task.assignee == null || task.assignee == '').length;

  // Calculate Hours Over Capacity
  const totalTaskHours = tasks.reduce((total, task) => {
    const taskDuration = (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60); // in hours
    return total + taskDuration;
  }, 0);
  const hoursOverCapacity = Math.max(totalTaskHours - getTotalCapacity(participants), 0);

  // Calculate % Progress Complete
  const totalProgress = tasks.reduce((total, task) => total + task.progress, 0);
  const percentComplete = totalTasks > 0 ? totalProgress / totalTasks : 0;

  return (
    <View style={styles.scoreboardContainer}>
      {/* Header */}
      <Text style={styles.header}>Tasks Overview</Text>
      
      <View style={styles.scoreCard}>
        <View style={styles.row}>
          <View style={styles.statItem}>
            <Text style={styles.label}>Total</Text>
            <Text style={styles.value}>{totalTasks}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.label}>Hours</Text>
            <Text style={styles.value}>{totalTaskHours.toFixed(1)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.label}>Complete</Text>
            <Text style={styles.value}>{percentComplete.toFixed(1)}%</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.statItem}>
            <Text style={styles.label}>Unassigned</Text>
            <Text style={styles.value}>{unassignedTasks}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.label}>Blocked</Text>
            <Text style={styles.value}>{blockedTasks}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.label}>Over Capacity</Text>
            <Text style={styles.value}>{hoursOverCapacity.toFixed(1)}h</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Scoreboard;

const styles = StyleSheet.create({
  scoreboardContainer: {
    padding: 12,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    marginVertical: 16,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    textAlign: 'center',
    marginBottom: 12,
  },
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 6,
  },
  statItem: {
    flex: 1,
    padding: 6,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 0.5,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    color: '#555',
    textAlign: 'center',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
    textAlign: 'center',
  },
});