import React from 'react';
import { View, Text, Pressable, ScrollView, Switch, StyleSheet } from 'react-native';

interface FilterLegendProps {
  participants: { id: string; name: string; color: string }[];
  tasks: { id: string; name: string }[];
  selectedParticipants: string[];
  selectedTasks: string[];
  handleParticipantSelection: (participantId: string) => void;
  handleTaskSelection: (taskId: string) => void;
  selectAllParticipants: () => void;
  deselectAllParticipants: () => void;
  selectAllTasks: () => void;
  deselectAllTasks: () => void;
  showParticipantFilters: boolean;
  setShowParticipantFilters: (val: boolean) => void;
  showTaskFilters: boolean;
  setShowTaskFilters: (val: boolean) => void;
}

const FilterLegend: React.FC<FilterLegendProps> = ({
  participants,
  tasks,
  selectedParticipants,
  selectedTasks,
  handleParticipantSelection,
  handleTaskSelection,
  selectAllParticipants,
  deselectAllParticipants,
  selectAllTasks,
  deselectAllTasks,
  showParticipantFilters,
  setShowParticipantFilters,
  showTaskFilters,
  setShowTaskFilters,
}) => {
  return (
    <View style={styles.legendWrapper}>
      {/* Filter by Participants */}
      <View style={styles.legendSection}>
        <Pressable onPress={() => setShowParticipantFilters(!showParticipantFilters)}>
          <Text style={styles.legendTitle}>Filter by Participants</Text>
        </Pressable>
        {showParticipantFilters && (
          <>
            <View style={styles.legendActionWrapper}>
              <Pressable style={styles.legendAction} onPress={selectAllParticipants}>
                <Text style={styles.legendActionText}>Select All</Text>
              </Pressable>
              <Pressable style={styles.legendAction} onPress={deselectAllParticipants}>
                <Text style={styles.legendActionText}>Deselect All</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.legendScroll}>
              {participants.map(participant => (
                <Pressable key={participant.id} onPress={() => handleParticipantSelection(participant.id)}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColorBox, { backgroundColor: participant.color }]} />
                    <Text style={styles.legendText}>{participant.name}</Text>
                    <Switch
                      value={selectedParticipants.includes(participant.id)}
                      onValueChange={() => handleParticipantSelection(participant.id)}
                    />
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}
      </View>

      {/* Filter by Tasks */}
      <View style={styles.legendSection}>
        <Pressable onPress={() => setShowTaskFilters(!showTaskFilters)}>
          <Text style={styles.legendTitle}>Filter by Tasks</Text>
        </Pressable>
        {showTaskFilters && (
          <>
            <View style={styles.legendActionWrapper}>
              <Pressable style={styles.legendAction} onPress={selectAllTasks}>
                <Text style={styles.legendActionText}>Select All</Text>
              </Pressable>
              <Pressable style={styles.legendAction} onPress={deselectAllTasks}>
                <Text style={styles.legendActionText}>Deselect All</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.legendScroll}>
              {tasks.map(task => (
                <Pressable key={task.name} onPress={() => handleTaskSelection(task.name)}>
                  <View style={styles.legendItem}>
                    <Text style={styles.legendText}>{task.name}</Text>
                    <Switch
                      value={selectedTasks.includes(task.name)}
                      onValueChange={() => handleTaskSelection(task.name)}
                    />
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  legendWrapper: {
    maxWidth: 1000,
    padding: 15,
    margin: 10,
    width: '90%',
    zIndex: 1,
  },
  legendSection: {
    flex: 1,
    marginRight: 10,
  },
  legendTitle: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    borderRadius: 5,
    fontSize: 10,
  },
  legendScroll: {
    maxHeight: 300,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
  },
  legendColorBox: {
    width: 18,
    height: 18,
    borderRadius: 5,
  },
  legendActionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  legendAction: {
    padding: 6,
    borderRadius: 5,
    backgroundColor: '#007bff',
    elevation: 3,
  },
  legendActionText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default FilterLegend;