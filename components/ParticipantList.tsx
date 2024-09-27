import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface Participant {
  id: string;
  name: string;
  capacity: string;
  color: string;
}

interface ParticipantListProps {
  participant: Participant; // Accept a single participant
  handleDeleteParticipant: (participantId: string, name: string) => void;

}

const ParticipantList: React.FC<ParticipantListProps> = ({ participant, handleDeleteParticipant }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.column}>{participant.name}</Text>
      <Text style={styles.column}>{participant.capacity}</Text>

      {/* Render color box */}
      <View style={[styles.column, styles.colorBoxWrapper]}>
        <View style={[styles.colorBox, { backgroundColor: participant.color || '#ccc' }]} />
      </View>

      <Pressable onPress={() => handleDeleteParticipant(participant.id, participant.name)} style={styles.actionButton}>
        <Text style={styles.buttonText}>Delete</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center', // Ensures the color box aligns vertically with text
  },
  column: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  colorBoxWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  actionButton: {
    paddingHorizontal: 10,
  },
  buttonText: {
    color: '#007bff',
  },
});

export default ParticipantList;