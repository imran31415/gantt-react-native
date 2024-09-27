import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, Modal, Pressable, Platform } from 'react-native';
import TaskForm from './TaskForm';
import ParticipantForm from './ParticipantForm';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TaskParticipantDashboard from './TaskParticipantDashboard';
import FormSubmissionIndicator from './FormSubmissionIndicator'; // Import the indicator

interface Participant {
  id: string;
  name: string;
  capacity: string;
  color: string;
}

interface Task {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  assignee: string;
}

interface ParticipantManagerProps {
  participants: Participant[];
  tasks: Task[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  handleEditTask: (task: Task) => void;
  setSelectedTasks: React.Dispatch<React.SetStateAction<string[]>>; // New prop for updating selected tasks
  taskModalVisible: boolean; // Add prop to manage modal visibility state
  setTaskModalVisible: React.Dispatch<React.SetStateAction<boolean>>; // Add setter for modal visibility
  taskInput: Task,
  setTaskInput: React.Dispatch<React.SetStateAction<Task>>;
  handleAddOrEditTask: () => void;




}

const ParticipantManager: React.FC<ParticipantManagerProps> = ({
  participants,
  setParticipants,
  tasks,
  setTasks,
  handleEditTask,
  setSelectedTasks, // Receive setSelectedTasks from HomeScreen
  taskModalVisible,
  setTaskModalVisible,
  taskInput,
  setTaskInput,
  handleAddOrEditTask

}) => {
  const [currentTask, setCurrentTask] = useState<Task | null>(null); // Track the task being edited
  const [participantModalVisible, setParticipantModalVisible] = useState<boolean>(false);
  const [editingParticipant, setEditingParticipant] = useState<boolean>(false);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(participants.map(p => p.id));
  const [participantInput, setParticipantInput] = useState({

    id: '',
    name: '',
    capacity: '',
    color: '#000000',
  });


  // New submission state for form submission feedback
  // Initialize isSubmitting state as false
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // When opening task modal, reset the isSubmitting state to false
  const openTaskModal = () => {
    // Reset taskInput to default values when adding a new task
    setTaskInput({
      name: '',
      start: new Date(),
      end: new Date(),
      progress: 0,
      assignee: '',
      id: '',
    });
    setCurrentTask(null); // Ensure no task is selected (we are adding a new one)
    setIsSubmitting(false); // Reset the submission state
    setTaskModalVisible(true);
  };

  // When opening participant modal, reset the isSubmitting state to false
  const openParticipantModal = () => {
    setIsSubmitting(false); // Reset the submission state
    setParticipantModalVisible(true);
  };

  // Handle input change for task fields
  const handleInputChange = (field: keyof Omit<Task, 'id'>, value: string) => {
    setTaskInput({ ...taskInput, [field]: value });
  };



  // Handle input change for participant fields
  const handleParticipantChange = (field: keyof Omit<Participant, 'id'>, value: string) => {
    setParticipantInput({ ...participantInput, [field]: value });
  };



  // Handle editing an existing participant
  const handleEditParticipant = (participant: Participant) => {
    setParticipantInput({
      id: participant.id,
      name: participant.name,
      capacity: participant.capacity,
      color: participant.color,
    });
    setEditingParticipant(true);
    setParticipantModalVisible(true);
  };


  // Handle deleting a task
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.name !== taskId));

    // Remove task from the selectedTasks list
    setSelectedTasks(prevSelectedTasks =>
      prevSelectedTasks.filter(name => name !== taskId)
    );
  };
  // Handle adding or editing a participant
  const handleAddOrEditParticipant = () => {
    setIsSubmitting(true);

    if (editingParticipant) {
      setParticipants(prevParticipants =>
        prevParticipants.map(participant =>
          participant.id === participantInput.id ? { ...participant, ...participantInput } : participant
        )
      );
    } else {
      // Adding a new participant
      const newParticipant = {
        ...participantInput,
        id: `${participantInput.name}`,
      };
      setParticipants(prevParticipants => [...prevParticipants, newParticipant]);

      // Add the new participant to selectedParticipants
      setSelectedParticipants(prevSelectedParticipants => [
        ...prevSelectedParticipants,
        newParticipant.id,
      ]);
    }

    setParticipantModalVisible(false);
    setEditingParticipant(false);
    setIsSubmitting(false);
  };

  // Handle deleting a participant
  const handleDeleteParticipant = (participantId: string) => {
    setParticipants(participants.filter((participant) => participant.id !== participantId));
    // Update tasks to remove the deleted participant's ID from the assignee field
    setTasks(tasks.map(task =>
      task.assignee === participantId ? { ...task, assignee: '' } : task
    ));
  };

  return (
    <View style={styles.container}>
      {/* Modal for Task Form */}
      <Modal
        visible={taskModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setTaskModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, Platform.OS === 'ios' && styles.modalContainerIOS, Platform.OS === 'web' && styles.modalContainerWeb]}>
            <TaskForm
              taskInput={taskInput}
              handleInputChange={handleInputChange}
              handleAddOrEditTask={handleAddOrEditTask}
              participants={participants}
              isSubmitting={isSubmitting}
            />
            <Pressable style={styles.closeButton} onPress={() => setTaskModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal for Participant Form */}
      <Modal
        visible={participantModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setParticipantModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, Platform.OS === 'ios' && styles.modalContainerIOS, Platform.OS === 'web' && styles.modalContainerWeb]}>
            <ParticipantForm
              participantInput={participantInput}
              handleParticipantChange={handleParticipantChange}
              handleAddParticipant={handleAddOrEditParticipant}
              editingParticipant={editingParticipant}
              isSubmitting={isSubmitting}
            />
            <Pressable style={styles.closeButton} onPress={() => setParticipantModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Buttons */}
      <View style={styles.actionButtonsContainer}>
        <Pressable style={styles.actionButton} onPress={openTaskModal}>
          <Icon name="playlist-add" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Add Task</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={openParticipantModal}>
          <Icon name="person-add" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Add Participant</Text>
        </Pressable>
      </View>

      {/* Dashboard Section */}
      <View style={{ marginVertical: 5 }}>
        <TaskParticipantDashboard
          tasks={tasks}
          participants={participants}
          handleEditTask={handleEditTask}
          handleDeleteTask={handleDeleteTask}
          handleDeleteParticipant={handleDeleteParticipant}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalContainerIOS: {
    width: '80%',  // Adjust the modal width for iOS
    maxHeight: '60%',  // Adjust the modal height for iOS
  },
  modalContainerWeb: {
    maxWidth: 500,  // Limit the width of the modal to 700px on web
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: 25,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  icon: {
    marginRight: 5,
  },
});

export default ParticipantManager;