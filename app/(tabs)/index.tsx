// HomeScreen.tsx

import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,

  SafeAreaView,
  Platform,
  ScrollView,
} from 'react-native';
import GanttChart from '@/components/GantChart';
import ParticipantManager from '@/components/ParticipantManager';
import AppHeader from '@/components/AppHeader';
import RNPickerSelect from 'react-native-picker-select';
import templatesData from '../templates/templates.json';
import Scoreboard from '@/components/Scoreboard';


interface Task {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  assignee: string;
}

interface Participant {
  id: string;
  name: string;
  capacity: string;
  color: string;
}

interface TemplateData {
  label: string;
  participants: Participant[];
  tasks: TaskData[];
}
interface Templates {
  [key: string]: TemplateData;
}

interface TaskData {
  id: string;
  name: string;
  start: string; // Dates are stored as strings in JSON
  end: string;
  progress: number;
  assignee: string;
}


// --- Component Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Light background color
  },
  headerContainer: {
    padding: 10,
  },
  pickerContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    borderWidth: Platform.OS === 'ios' ? 1 : 0, // Add border on iOS for better visibility
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#fff',
    paddingHorizontal: 10, // Add padding for better spacing
  },
  pickerLabel: { // New style for the label
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  ganttChartContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  participantManagerContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});


const HomeScreen: React.FC = () => {
  const [taskModalVisible, setTaskModalVisible] = useState<boolean>(false);

  // State to manage show/hide of filter sections
  const [showParticipantFilters, setShowParticipantFilters] = useState(true);
  const [showTaskFilters, setShowTaskFilters] = useState(true);


  // Extract templates from the JSON data
  const templates: Templates = templatesData.templates as Templates;  // Get the list of template keys
  const templateKeys = Object.keys(templates);

  // Set initial template key
  const defaultTemplateKey = 'software';

  const [selectedTemplate, setSelectedTemplate] = useState<string>(defaultTemplateKey);

  // Helper function to parse tasks
  const parseTasks = (tasksData: any[]): Task[] => {
    return tasksData.map((task) => ({
      ...task,
      start: new Date(task.start),
      end: new Date(task.end),
    }));
  };

  // Get the initial template data
  const initialTemplateData = templates[selectedTemplate];

  // Initialize tasks and participants
  const [tasks, setTasks] = useState<Task[]>(parseTasks(initialTemplateData.tasks));
  const [participants, setParticipants] = useState<Participant[]>(
    initialTemplateData.participants
  );
  const [selectedTasks, setSelectedTasks] = useState<string[]>(
    initialTemplateData.tasks.map((task: any) => task.name)
  );
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  // New submission state for form submission feedback
  // Initialize isSubmitting state as false
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(participants.map(p => p.id));


  // Get the list of template keys


  const [taskInput, setTaskInput] = useState<Task>({
    name: '',
    start: new Date(),
    end: new Date(),
    progress: 0,
    assignee: '',
    id: '',
  });



  // Handle editing an existing task
  const handleEditTask = (task: Task) => {
    console.log('handleEditTask received task:', task); // Debug: Check task passed to handleEditTask

    setTaskInput({
      name: task.name,
      start: new Date(task.start), // Ensure it's a Date object
      end: new Date(task.end),     // Ensure it's a Date object
      progress: task.progress,
      assignee: task.assignee,
      id: task.id,  // Add the task ID so the form knows which task to update
    });
    setCurrentTask(task);  // Set the current task being edited
    console.log('Task Input after setTaskInput:', taskInput); // Debug: See if taskInput updates correctly

    setTaskModalVisible(true);  // Open the modal for editing
  };


  // Handle adding a new task or editing an existing task
  // Handle adding a new task or editing an existing task
  // Handle adding a new task or editing an existing task
  const handleAddOrEditTask = () => {
    setIsSubmitting(true); // Show submission indicator

    // Ensure that start and end are properly formatted as Date objects
    const updatedTaskInput = {
      ...taskInput,
      start: new Date(taskInput.start),
      end: new Date(taskInput.end),
    };

    if (currentTask) {
      // Editing an existing task
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === currentTask.id ? { ...task, ...updatedTaskInput } : task
        )
      );

      // If the task name or assignee has changed, update selectedTasks and selectedParticipants
      if (currentTask.name !== taskInput.name) {
        setSelectedTasks((prevSelectedTasks) =>
          prevSelectedTasks.map((name) =>
            name === currentTask.name ? taskInput.name : name
          )
        );
      }

      // Check if the assignee has changed
      if (currentTask.assignee !== taskInput.assignee) {
        setSelectedParticipants((prevSelectedParticipants) => {
          // Add new assignee if not in selectedParticipants
          const updatedParticipants = new Set(prevSelectedParticipants);
          if (taskInput.assignee && !updatedParticipants.has(taskInput.assignee)) {
            updatedParticipants.add(taskInput.assignee);
          }

          // Return the updated list
          return Array.from(updatedParticipants);
        });
      }
    } else {
      // Adding a new task
      const newTask = {
        ...updatedTaskInput,
        id: `${taskInput.name}-${Date.now()}`, // Generate a unique ID using the task name and timestamp
      };

      setTasks((prevTasks) => [...prevTasks, newTask]); // Add the new task

      // Add the new task to the selectedTasks list so it's not filtered out
      setSelectedTasks((prevSelectedTasks) => [
        ...prevSelectedTasks,
        newTask.name,
      ]);

      // If the new task has an assignee, add them to selectedParticipants
      if (taskInput.assignee) {
        setSelectedParticipants((prevSelectedParticipants) => {
          const updatedParticipants = new Set(prevSelectedParticipants);
          updatedParticipants.add(taskInput.assignee);
          return Array.from(updatedParticipants);
        });
      }
    }

    // Close modal and reset state
    setTaskModalVisible(false);
    setCurrentTask(null); // Reset the current task after save
    setIsSubmitting(false); // Hide submission indicator
    setTaskInput({ name: '', start: new Date(), end: new Date(), progress: 0, assignee: '', id: '' }); // Reset task input fields
  };

  // Initialize state with Software Development Project data


  // Template Switching Function
  const switchTemplate = (templateKey: string) => {
    setSelectedTemplate(templateKey || defaultTemplateKey);

    const selectedTemplateData = templates[templateKey] || templates[defaultTemplateKey];

    const newTasks = parseTasks(selectedTemplateData.tasks);

    setTasks(newTasks);
    setParticipants(selectedTemplateData.participants);
    setSelectedTasks(newTasks.map((task) => task.name));
  };

  const pickerItems = templateKeys.map((key) => ({
    label: templates[key].label,
    value: key,
  }));

  // Data for FlatList
  const data = [
    {
      key: 'gantt',
      component: (
        <View style={styles.ganttChartContainer}>
          <Scoreboard tasks={tasks} participants={participants} />
          <ScrollView horizontal>
            <GanttChart
              key={selectedTemplate} // Ensure GanttChart re-renders on template change
              tasks={tasks}
              participants={participants}
              selectedTasks={selectedTasks}
              setSelectedTasks={setSelectedTasks} // Pass state handler
              handleEditTask={handleEditTask}
              setTaskModalVisible={setTaskModalVisible}
              taskInput={taskInput}
            />
          </ScrollView>

        </View>
      ),
    },
    {
      key: 'participants',
      component: (
        <View style={styles.participantManagerContainer}>

          <ParticipantManager
            participants={participants}
            setParticipants={setParticipants}
            tasks={tasks}
            setTasks={setTasks}
            handleEditTask={handleEditTask}
            setSelectedTasks={setSelectedTasks} // Pass state handler
            taskModalVisible={taskModalVisible}
            setTaskModalVisible={setTaskModalVisible}
            taskInput={taskInput}
            setTaskInput={setTaskInput}
            handleAddOrEditTask={handleAddOrEditTask}
          />
        </View>
      ),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <AppHeader />
      </View>

      {/* Template Picker with Label */}
      <View style={styles.pickerContainer}>

        {/* Replace native Picker with RNPickerSelect */}
        <RNPickerSelect
          value={selectedTemplate || ''} // Use an empty string if the value is null or undefined
          onValueChange={(value) => {
            // Check if the value is not null or placeholder
            if (value !== null && value !== 'Select an item...') {
              switchTemplate(value);
            } else {
              // Default to the "empty" template when placeholder is selected
              switchTemplate('empty');
            }
          }}
          items={[
            { label: 'Select an item...', value: 'Select an item...' }, // Placeholder item
            ...pickerItems,
          ]}
          style={{
            inputIOS: styles.picker, // iOS-specific style for RNPickerSelect
            inputAndroid: styles.picker, // Android-specific style
            inputWeb: styles.picker, // Web-specific style
          }}
          useNativeAndroidPickerStyle={false} // Disable native picker styling for consistency
          placeholder={{}} // Empty placeholder to remove native placeholder text
        />
      </View>

      

      

      {/* Main Content Area as FlatList */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => item.component}
        contentContainerStyle={{ flexGrow: 1 }}
        ListFooterComponent={<View style={{ height: 20 }} />} // Optional: Add some spacing at the bottom
      />



    </SafeAreaView>
  );
};

export default HomeScreen;