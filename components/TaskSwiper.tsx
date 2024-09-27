import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Swiper from 'react-native-deck-swiper';

interface Task {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  assignee: string;
  color?: string;
}

interface TaskSwiperProps {
  tasks: Task[];
  onEditTask: (task: Task) => void; 
}

const TaskSwiper: React.FC<TaskSwiperProps> = ({ tasks, onEditTask }) => {
  return (
    <View style={styles.container}>
      <Swiper
        cards={tasks}
        renderCard={(task: Task) => (
          <Pressable
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: pressed ? '#e0e0e0' : '#fff' }  
            ]}
            onPress={() => {
              console.log('Card Pressed:', task); 
              onEditTask(task);
            }}
          >
            <Text style={styles.title}>{task.name}</Text>
            <Text style={styles.dates}>
              {task.start.toLocaleDateString()} - {task.end.toLocaleDateString()}
            </Text>
            <Text style={styles.progress}>Progress: {task.progress}%</Text>
            <Text style={styles.assignee}>Assigned to: {task.assignee}</Text>
          </Pressable>
        )}
        onSwipedLeft={(cardIndex) => console.log('Swiped Left on Task', tasks[cardIndex].name)}
        onSwipedRight={(cardIndex) => console.log('Swiped Right on Task', tasks[cardIndex].name)}
        stackSize={3}
        backgroundColor={'#f0f0f0'}
        cardIndex={0}
        stackSeparation={15}
        overlayLabels={{
          left: {
            title: <Text style={styles.overlayLabelText}>DISMISS</Text>,
            style: {
              label: {
                backgroundColor: 'red',
                color: 'white',
                fontSize: 24,
              },
              wrapper: {
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                marginTop: 20,
                marginLeft: -20,
              },
            },
          },
          right: {
            title: <Text style={styles.overlayLabelText}>REVIEW</Text>,
            style: {
              label: {
                backgroundColor: 'green',
                color: 'white',
                fontSize: 24,
              },
              wrapper: {
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                marginTop: 20,
                marginLeft: 20,
              },
            },
          },
        }}
        animateCardOpacity
        swipeBackCard
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e8e8e8',
    padding: 20,
    marginTop: 50,
    marginBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,  
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dates: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  progress: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  assignee: {
    fontSize: 14,
    color: '#555',
  },
  overlayLabelText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TaskSwiper;