import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Platform, Dimensions } from 'react-native';
import TaskList from './TaskList';
import ParticipantList from './ParticipantList';

const { width: screenWidth } = Dimensions.get('window');

const isMobileWeb = Platform.OS === 'web' && screenWidth < 768; // Check for mobile web view

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

interface DashboardProps {
    tasks: Task[];
    participants: Participant[];
    handleEditTask: (task: Task) => void;
    handleDeleteTask: (taskId: string) => void;
    handleDeleteParticipant: (participantId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
    tasks,
    participants,
    handleEditTask,
    handleDeleteTask,
    handleDeleteParticipant,
}) => {
    const [showTasks, setShowTasks] = useState(true); // Toggle between tasks and participants

    // Find the color of the assignee from the participants list
    const getAssigneeColor = (assigneeId: string) => {
        const participant = participants.find(p => p.id === assigneeId);
        return participant ? participant.color : '#ccc'; // Default to gray if no color is found
    };

    // Task List Header (only for non-mobile platforms)
    const renderTaskHeader = () => (
        <View style={styles.listHeader}>
            <Text style={[styles.listHeaderText, styles.column]}>Task Name</Text>
            <Text style={[styles.listHeaderText, styles.column]}>Start Date</Text>
            <Text style={[styles.listHeaderText, styles.column]}>End Date</Text>
            <Text style={[styles.listHeaderText, styles.column]}>Progress</Text>
            <Text style={[styles.listHeaderText, styles.column]}>Assignee</Text>
            <Text style={[styles.listHeaderText, styles.column]}>Color</Text>
            <Text style={[styles.listHeaderText, styles.column]}>Actions</Text>
        </View>
    );

    // Participant List Header (only for non-mobile platforms)
    const renderParticipantHeader = () => (
        <View style={styles.listHeader}>
            <Text style={[styles.listHeaderText, styles.column]}>Participant</Text>
            <Text style={[styles.listHeaderText, styles.column]}>Capacity</Text>
            <Text style={[styles.listHeaderText, styles.column]}>Color</Text>
            <Text style={[styles.listHeaderText, styles.column]}>Action</Text>
        </View>
    );

    return (
        <View style={styles.container}>

            <View style={styles.tabContainer}>
                <Pressable style={styles.tabButton} onPress={() => setShowTasks(true)}>
                    <Text style={[styles.tabText, showTasks && styles.activeTabText]}>Tasks</Text>
                </Pressable>
                <Pressable style={styles.tabButton} onPress={() => setShowTasks(false)}>
                    <Text style={[styles.tabText, !showTasks && styles.activeTabText]}>Participants</Text>
                </Pressable>
            </View>

            {showTasks && (
                <View style={styles.box}>
                    <FlatList
                        data={tasks}
                        ListHeaderComponent={!isMobileWeb ? renderTaskHeader : null} // Conditionally render header for non-mobile web
                        renderItem={({ item }) => (
                            <TaskList
                                task={{
                                    ...item,
                                    start: item.start, // Pass formatted date
                                    end: item.end, // Pass formatted date
                                }}
                                participants={participants}
                                taskColor={getAssigneeColor(item.assignee)} // Pass the color of the assignee to TaskList
                                handleEditTask={handleEditTask}
                                handleDeleteTask={handleDeleteTask}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                </View>
            )}

            {!showTasks && (
                <View style={styles.box}>
                    <FlatList
                        ListHeaderComponent={!isMobileWeb ? renderParticipantHeader : null} // Conditionally render header for non-mobile web
                        data={participants}
                        renderItem={({ item }) => (
                            <ParticipantList
                                participant={item}
                                handleDeleteParticipant={handleDeleteParticipant}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    box: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4,
        width: Platform.OS === 'web' ? '100%' : screenWidth * 0.9, // Take 90% of the screen width on mobile
        alignSelf: 'center', // Center the card on the screen
    },
    headerText: {
        fontSize: Platform.OS === 'ios' ? 12 : 18, // Smaller font size for iOS
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    tabButton: {
        padding: 10,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
        marginHorizontal: 5,
    },
    tabText: {
        fontSize: 16,
        color: '#666',
    },
    activeTabText: {
        color: '#007bff',
        fontWeight: 'bold',
        borderBottomColor: '#007bff',
    },
    listHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    listHeaderText: {
        fontSize: Platform.OS === 'ios' ? 12 : 14, // Smaller font size for iOS
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    column: {
        flex: 1,
    },
});

export default Dashboard;