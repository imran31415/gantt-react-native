import React, { useState, useEffect } from 'react';
import Svg, { Rect, Text as SvgText, Line, G } from 'react-native-svg';
import { scaleTime, scaleBand, NumberValue } from 'd3-scale';
import { min, max } from 'd3-array';
import { timeDays, timeWeek } from 'd3-time';
import { timeFormat } from 'd3-time-format';
import { Dimensions, View, Platform, StyleSheet, Text, ScrollView, Switch, Pressable } from 'react-native';
import Tooltip from './Tooltip';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PieChart from './PieChart';

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

interface GanttChartProps {
  tasks: Task[];
  participants?: Participant[];
  selectedTasks: string[];
  setSelectedTasks: React.Dispatch<React.SetStateAction<string[]>>;
  handleEditTask: (task: Task) => void;
  setTaskModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  taskInput: Task;
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks, participants = [], selectedTasks, setSelectedTasks, handleEditTask, setTaskModalVisible, taskInput }) => {
  const [activeTab, setActiveTab] = useState<'gantt' | 'pie'>('gantt');
  const [initialLoad, setInitialLoad] = useState(true);
  const [userInteractedTasks, setUserInteractedTasks] = useState<string[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [width, setWidth] = useState(getInitialWidth());
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(participants.map(p => p.id));
  const [allowAutoSelect, setAllowAutoSelect] = useState(true);
  const [showParticipantFilters, setShowParticipantFilters] = useState(false);
  const [showTaskFilters, setShowTaskFilters] = useState(false);
  const isMobileWeb = Platform.OS === 'web' && Dimensions.get('window').width < 768;

  useEffect(() => {
    if (initialLoad && allowAutoSelect && tasks.length > 0) {
      setSelectedTasks(tasks.map(task => task.name));
      setInitialLoad(false);
    }
  }, [tasks, initialLoad, allowAutoSelect, setSelectedTasks]);

  useEffect(() => {
    setFilteredTasks(
      tasks.filter(
        (task) =>
          selectedTasks.includes(task.name) &&
          (selectedParticipants.includes(task.assignee) || !task.assignee)
      )
    );
  }, [tasks, selectedTasks, selectedParticipants]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    setSelectedParticipants(prevSelectedParticipants => {
      const newParticipantIds = participants.map(p => p.id).filter(id => !prevSelectedParticipants.includes(id));
      return [...prevSelectedParticipants, ...newParticipantIds];
    });
  }, [participants]);

  const handleResize = () => {
    setWidth(Dimensions.get('window').width);
  };

  const allDates = filteredTasks.flatMap(task => [task.start, task.end]);
  const minDate = min(allDates) || new Date();
  const maxDate = max(allDates) || new Date();

  const paddedMinDate = new Date(minDate);
  const paddedMaxDate = new Date(maxDate);
  paddedMinDate.setDate(minDate.getDate() - 3);
  paddedMaxDate.setDate(maxDate.getDate() + 3);
  const margin = { top: 70, right: 30, bottom: 100, left: 120 };
  const barHeight = 25;

  const xScale = scaleTime()
    .domain([paddedMinDate, paddedMaxDate])
    .range([margin.left, width - margin.right]);

  const yScale = scaleBand()
    .domain(filteredTasks.map(t => t.name))
    .range([margin.top, filteredTasks.length * (barHeight + 20)])
    .padding(0.4);

  const allDays = isMobileWeb
    ? (timeWeek?.every(1)?.range(paddedMinDate, paddedMaxDate) || [])
    : timeDays(paddedMinDate, paddedMaxDate); const dayFormat = isMobileWeb ? timeFormat('%b %d') : timeFormat('%Y-%m-%d');

  const shouldRenderDayLabel = (index: number) => {
    if (isMobileWeb) {
      return index % 1 === 0; // Render every week for mobile web
    }
    const dayInterval = allDays.length > 60 ? 7 : 1; // Render every week if more than 2 months
    return index % dayInterval === 0;
  };

  const today = new Date();
  const isTodayInRange = today >= paddedMinDate && today <= paddedMaxDate;

  const minChartHeight = 300;
  const dynamicHeight = Math.max(minChartHeight, margin.top + filteredTasks.length * (barHeight + 10) + margin.bottom + 150);

  const getOpacityForProgress = (progress: number) => {
    if (progress <= 50) {
      return 0.3;
    } else if (progress <= 75) {
      return 0.75;
    } else {
      return 1;
    }
  };

  const adjustTooltipPosition = (x: number, y: number, tooltipWidth: number, tooltipHeight: number) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    let adjustedX = isNaN(x) ? 0 : x;
    let adjustedY = isNaN(y) ? 0 : y;

    if (x + tooltipWidth > windowWidth) {
      adjustedX = windowWidth - tooltipWidth - 10;
    }

    if (y + tooltipHeight > windowHeight) {
      adjustedY = windowHeight - tooltipHeight - 10;
    }

    return { x: adjustedX, y: adjustedY };
  };

  const handlePress = (task: Task, event: any) => {
    const { locationX, locationY } = event.nativeEvent;

    if (isNaN(locationX) || isNaN(locationY)) {
      console.error('Invalid tooltip position values:', { locationX, locationY });
      return;
    }

    const tooltipX = locationX;
    const tooltipY = locationY - 200;

    const tooltipWidth = 200;
    const tooltipHeight = 100;

    const adjustedPosition = adjustTooltipPosition(tooltipX, tooltipY, tooltipWidth, tooltipHeight);

    setTooltipPosition(adjustedPosition);
    setSelectedTask(task);
    setTooltipVisible(true);
  };

  const handleMouseOver = (task: Task, event: any) => {
    let tooltipX, tooltipY;

    if (Platform.OS === 'web') {
      const { clientX, clientY } = event.nativeEvent;
      tooltipX = clientX;
      tooltipY = clientY - 200;
    } else {
      const { locationX, locationY } = event.nativeEvent;
      tooltipX = locationX;
      tooltipY = locationY - 200;
    }

    if (isNaN(tooltipX) || isNaN(tooltipY)) {
      console.error('Invalid tooltip position values:', { tooltipX, tooltipY });
      return;
    }

    const tooltipWidth = 200;
    const tooltipHeight = 100;

    const adjustedPosition = adjustTooltipPosition(tooltipX, tooltipY, tooltipWidth, tooltipHeight);

    setTooltipPosition(adjustedPosition);
    setSelectedTask(task);
    setTooltipVisible(true);
  };

  const hideTooltip = () => {
    setTooltipVisible(false);
  };

  function getInitialWidth() {
    return Platform.OS === 'web' ? Dimensions.get('window').width * .95 : Dimensions.get('window').width;
  }

  const getParticipantColor = (assigneeId: string) => {
    const participant = participants.find((p) => p.id === assigneeId);
    return participant && participant.color ? `${participant.color}80` : '#007bff80';
  };

  const zoomIn = () => {
    setWidth(prev => prev * 1.2);
  };

  const zoomOut = () => {
    setWidth(prev => prev * 0.8);
  };

  const resetZoom = () => {
    setWidth(getInitialWidth());
  };

  const handleTaskSelection = (taskId: string) => {
    setSelectedTasks((prevSelectedTasks) => {
      if (prevSelectedTasks.includes(taskId)) {
        return prevSelectedTasks.filter((t) => t !== taskId);
      } else {
        return [...prevSelectedTasks, taskId];
      }
    });
    setUserInteractedTasks((prev) => (prev.includes(taskId) ? prev : [...prev, taskId]));
    setAllowAutoSelect(false);
  };

  const handleParticipantSelection = (participantId: string) => {
    setSelectedParticipants(prev =>
      prev.includes(participantId) ? prev.filter(p => p !== participantId) : [...prev, participantId]
    );
  };

  const selectAllTasks = () => {
    setSelectedTasks(tasks.map((task) => task.name));
    setUserInteractedTasks([]);
    setAllowAutoSelect(false);
  };

  const deselectAllTasks = () => {
    setSelectedTasks([]);
    setUserInteractedTasks([]);
    setAllowAutoSelect(false);
  };

  const selectAllParticipants = () => {
    setSelectedParticipants(participants.map(p => p.id));
  };

  const deselectAllParticipants = () => {
    setSelectedParticipants([]);
  };

  return (
    <View style={styles.chartWrapper}>

      <View style={styles.tabHeader}>
        <Pressable
          style={[styles.tabButton, activeTab === 'gantt' && styles.activeTab]}
          onPress={() => setActiveTab('gantt')}
        >
          <Text style={styles.tabText}>Gantt Chart</Text>
        </Pressable>
        <Pressable
          style={[styles.tabButton, activeTab === 'pie' && styles.activeTab]}
          onPress={() => setActiveTab('pie')}
        >
          <Text style={styles.tabText}>Pie Chart</Text>
        </Pressable>
      </View>
      <View style={[styles.legendWrapper, Platform.OS === 'web' && styles.legendWrapperWeb]}>
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
                  <View key={participant.id} style={styles.legendItem}>
                    <Pressable
                      style={{ flexDirection: 'row', flex: 1 }}
                      onPress={() => handleParticipantSelection(participant.id)}
                    >
                      <View style={[styles.legendColorBox, { backgroundColor: participant.color }]} />
                      <Text style={styles.legendText}>{participant.name}</Text>
                    </Pressable>
                    <Switch
                      value={selectedParticipants.includes(participant.id)}
                      onValueChange={() => handleParticipantSelection(participant.id)}
                    />
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </View>


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
                {tasks.map((task) => (
                  <View key={task.name} style={styles.legendItem}>
                    <Pressable
                      style={{ flexDirection: 'row', flex: 1 }}
                      onPress={() => handleTaskSelection(task.name)}
                    >
                      <Text style={styles.legendText}>{task.name}</Text>
                    </Pressable>
                    <Switch
                      value={selectedTasks.includes(task.name)}
                      onValueChange={() => handleTaskSelection(task.name)}
                    />
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </View>
      {activeTab === 'gantt' && (
        <View style={styles.buttonContainer}>
          <Pressable onPress={zoomIn} style={styles.zoomButton}>
            <Text style={styles.zoomButtonText}>+</Text> {/* Replacing Icon with a plus symbol */}
          </Pressable>
          <Pressable onPress={zoomOut} style={styles.zoomButton}>
            <Text style={styles.zoomButtonText}>−</Text> {/* Replacing Icon with a minus symbol */}
          </Pressable>
          <Pressable onPress={resetZoom} style={styles.zoomButton}>
            <Text style={styles.zoomButtonText}>⤢</Text> {/* Replacing Icon with a reset symbol */}
          </Pressable>
        </View>
      )}

      {activeTab === 'gantt' && (
        <View>
          <Svg width={width} height={dynamicHeight} viewBox={`0 0 ${width} ${dynamicHeight}`}>
            {allDays.map((date: NumberValue, index: number) => {
              const xPos = xScale(date);
              return (
                !isNaN(xPos) && (
                  <React.Fragment key={`day-${index}`}>
                    <Line
                      x1={xPos}
                      x2={xPos}
                      y1={margin.top}
                      y2={dynamicHeight - margin.bottom}
                      stroke="#eee"
                      strokeWidth={1}
                    />
                    {shouldRenderDayLabel(index) && (
                      <SvgText
                        x={xPos}
                        y={dynamicHeight - margin.bottom + 15}
                        fontSize="10"
                        textAnchor="middle"
                        fill="#000"
                        transform={`rotate(90, ${xPos}, ${dynamicHeight - margin.bottom + 15})`}
                      >
                        {dayFormat(new Date(date.valueOf()))}
                      </SvgText>
                    )}
                  </React.Fragment>
                )
              );
            })}

            {isTodayInRange && (
              <Line
                x1={xScale(today)}
                x2={xScale(today)}
                y1={margin.top}
                y2={dynamicHeight - margin.bottom}
                stroke="red"
                strokeWidth={2}
              />
            )}

            {filteredTasks.map(task => {
              const xStart = xScale(task.start);
              const xEnd = xScale(task.end);
              const minBarWidth = 20;

              const barWidth = Math.max(xEnd - xStart, minBarWidth);
              const yPos = (yScale(task.name) || 0) + barHeight / 2;
              const opacity = getOpacityForProgress(task.progress);

              return (
                !isNaN(xStart) && !isNaN(xEnd) && (
                  Platform.OS === 'web' ? (
                    <G
                      key={task.id}

                      onClick={(e: any) => handleMouseOver(task, e)}
                    // onMouseEnter={(e: any) => handleMouseOver(task, e)} 
                    >
                      <Line
                        x1={margin.left - 10}
                        x2={xStart}
                        y1={yPos}
                        y2={yPos}
                        stroke="#aaa"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                      />
                      <Rect
                        x={xStart}
                        y={(yScale(task.name) || 0) + 5}
                        width={barWidth}
                        height={barHeight}
                        fill={getParticipantColor(task.assignee)}
                        stroke="#000"
                        strokeWidth={1}
                        fillOpacity={opacity}

                      />
                      <SvgText
                        x={xStart + barWidth / 2}
                        y={(yScale(task.name) || 0) + barHeight / 1.5 + 5}
                        fontSize="10"
                        textAnchor="middle"
                        stroke="#000"
                        strokeWidth={0.5}
                      >
                        {task.assignee ? task.assignee : task.name}
                      </SvgText>
                    </G>
                  ) : (
                    <G
                      key={task.id}
                      onPress={(e: any) => handlePress(task, e)}

                    >
                      <Line
                        x1={margin.left - 10}
                        x2={xStart}
                        y1={yPos}
                        y2={yPos}
                        stroke="#aaa"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                      />
                      <Rect
                        x={xStart}
                        y={(yScale(task.name) || 0) + 5}
                        width={barWidth}
                        height={barHeight}
                        fill={getParticipantColor(task.assignee)}
                        stroke="#000"
                        strokeWidth={1}
                      />
                      <SvgText
                        x={xStart + barWidth / 2}
                        y={(yScale(task.name) || 0) + barHeight / 1.5 + 5}
                        fontSize="10"
                        textAnchor="middle"
                        stroke="#000"
                        strokeWidth={0.5}
                      >
                        {task.assignee ? task.assignee : task.name || task.name}
                      </SvgText>
                    </G>
                  )
                )
              );
            })}

            {filteredTasks.map(task => (
              <SvgText
                key={`label-${task.id}`}
                x={margin.left - 10}
                y={(yScale(task.name) || 0) + barHeight}
                fontSize="12"
                fill="#000"
                textAnchor="end"
              >
                {task.name.substring(0, 16)}
              </SvgText>
            ))}
          </Svg>

          <Tooltip
            visible={tooltipVisible}
            task={selectedTask}
            onClose={hideTooltip}
            position={{ x: tooltipPosition.x || 0, y: tooltipPosition.y || 0 }}
            handleEditTask={handleEditTask}
          />
        </View>
      )}

      {activeTab === 'pie' && (
        <PieChart
          tasks={filteredTasks}
          selectedParticipants={participants.filter(p => selectedParticipants.includes(p.id))}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  zoomButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chartWrapper: {
    padding: 0,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    margin: 5,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 5,
    marginBottom: 5,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#007bff',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    top: 10,
    left: 20,
    flexDirection: 'row',
    zIndex: 0,
    marginLeft: 0,
  },
  zoomButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 5,
  },
  resetButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 5,
  },
  legendWrapperWeb: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  legendSection: {
    flex: 1,
    marginRight: 10,
  },
  legendTitle: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
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
  legendWrapper: {
    maxWidth: 1000,
    padding: 15,
    minWidth: 400,
    justifyContent: 'center',
    alignContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
    padding: 5,
    paddingHorizontal: 15,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
  },
  legendColorBox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    marginRight: 10,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  legendActionText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default GanttChart;