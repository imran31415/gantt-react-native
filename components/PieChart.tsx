import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import Svg, { Path, Text as SvgText, G } from 'react-native-svg';
import * as d3Shape from 'd3-shape';

interface Task {
    id: string;
    name: string;
    start: Date;
    end: Date;
    progress: number;
    assignee: string;
    color?: string;
}

interface Participant {
    id: string;
    name: string;
    capacity: string;
    color: string;
}

// Define the PieChartData interface
interface PieChartData {
    label: string;
    value: number;
    color: string;
}

interface PieChartProps {
    tasks: Task[];
    selectedParticipants: Participant[];
}

const PieChart: React.FC<PieChartProps> = ({ tasks, selectedParticipants }) => {
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

    // Filter tasks based on selected participants. Show all tasks if no participants are selected.
    useEffect(() => {
        if (selectedParticipants.length === 0) {
            setFilteredTasks(tasks);
        } else {
            setFilteredTasks(
                tasks.filter(task =>
                    selectedParticipants.some(participant => participant.id === task.assignee)
                )
            );
        }
    }, [tasks, selectedParticipants]);

    // Calculate the completion percentages
    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(task => task.progress === 100).length;
    const completionRate = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

    // Calculate the pie chart data
    const pieData: PieChartData[] = [
        { label: 'Completed', value: completedTasks, color: '#28a745' },
        { label: 'Incomplete', value: totalTasks - completedTasks, color: '#dc3545' }
    ];

    // If there are no tasks, don't render the pie chart
    if (totalTasks === 0) {
        return (
            <View style={styles.noDataWrapper}>
                <Text style={styles.noDataText}>No tasks to display</Text>
            </View>
        );
    }

    // Create pie segments using d3
    const pieGenerator = d3Shape.pie<PieChartData>().value(d => d.value);
    const arcGenerator = d3Shape
        .arc<d3Shape.PieArcDatum<PieChartData>>()
        .innerRadius(0)
        .outerRadius(100); // Set radius to 100 for the pie chart

    const pieSegments = pieGenerator(pieData);

    // Handle segment click/press
    const handleSegmentPress = (segment: d3Shape.PieArcDatum<PieChartData>) => {
        console.log(`${segment.data.label} segment pressed`);
    };

    return (
        <View style={styles.chartWrapper}>
            <Svg width={250} height={250}>
                <G x={125} y={125}>
                    {pieSegments.map((segment, index) => {
                        const arcPath = arcGenerator(segment) as string;
                        return (
                            <Path
                                key={index}
                                d={arcPath}
                                fill={segment.data.color}
                                stroke="#fff"
                                strokeWidth={1}
                                {...(Platform.OS !== 'web' && {
                                    onPress: () => handleSegmentPress(segment), // For mobile platforms
                                })}
                                {...(Platform.OS === 'web' && {
                                    onClick: () => handleSegmentPress(segment), // For web platform
                                })}
                            />
                        );
                    })}
                </G>
            </Svg>
            <View style={styles.legendContainer}>
                {pieData.map((data, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View style={[styles.colorBox, { backgroundColor: data.color }]} />
                        <Text style={styles.legendText}>{`${data.label} (${data.value})`}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    chartWrapper: {
        alignItems: 'center',
        padding: 10,
        
        shadowColor: '#000',
        elevation: 8,
        margin: 10,
    },
    noDataWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 250,
    },
    noDataText: {
        fontSize: 16,
        color: '#666',
    },
    legendContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    colorBox: {
        width: 18,
        height: 18,
        borderRadius: 5,
        marginRight: 5,
    },
    legendText: {
        fontSize: 14,
        color: '#333',
    },
});

export default PieChart;