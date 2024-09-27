
# Gantt Task Manager

A React Native and Web-based Gantt Chart Task Manager application built with TypeScript, Expo, and D3. This project enables users to visually manage tasks and their timelines, providing a user-friendly interface for tracking progress, assigning participants, and adjusting schedules.

## Demo:
[https://www.deep-plan.com](https://www.deep-plan.com)

## Screenshot:
![www deep-plan com_](https://github.com/user-attachments/assets/a6b0d1b5-71b9-40b4-b098-df76e65f5419)


## Features

- **Interactive Gantt Chart:** Visual representation of tasks with smooth animations and adjustable start and end dates.
- **Task Management:** Create, edit, and delete tasks with fields for name, start date, end date, progress, and assignee.
- **Participant Management:** Add and manage participants, each with customizable capacity and assigned task colors.
- **Responsive Design:** Compatible with both web and mobile platforms, using SVG rendering for a consistent experience across devices.
- **Dynamic Coloring:** Tasks are color-coded based on the assigned participant for clear visual distinction.
- **Horizontal Scrolling:** Scrollable Gantt chart to accommodate a large number of tasks and timeframes.
- **Planning Templates** Selectable templates

## Technologies Used

- **React Native & Expo:** Framework for building mobile and web applications.
- **TypeScript:** Strongly typed programming language for building robust and error-free applications.
- **D3.js:** JavaScript library for creating dynamic and interactive data visualizations.
- **react-native-svg:** A library for rendering SVG elements in React Native applications.
- **Ant Design:** UI library for building user interfaces with pre-styled components (used in the web version).

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- **Node.js**: Ensure that you have Node.js installed on your machine. You can download it from [Node.js official website](https://nodejs.org/).
- **Expo CLI:** Install Expo CLI globally by running:
  ```bash
  npm install -g @expo/cli
  ```

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/gantt-task-manager.git
   cd gantt-task-manager
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo Development Server:**
   For mobile (React Native):
   ```bash
   expo start
   ```
   For web:
   ```bash
   expo start --web
   ```

### Usage

1. Open the app in the Expo Go app on your mobile device (iOS or Android) using the QR code provided by the Expo CLI.
2. For the web version, the app will open in your default browser, or you can navigate to the URL provided by the CLI.

### Code Overview

The project structure is as follows:

```
gantt-task-manager/
├── assets/
│   └── (images, icons, etc.)
├── components/
│   ├── GanttChart.tsx           # Main Gantt chart component using react-native-svg
│   ├── TaskForm.tsx             # Form component for adding and editing tasks
│   ├── ParticipantForm.tsx      # Form component for adding and editing participants
│   └── (other reusable components)
├── screens/
│   ├── HomeScreen.tsx           # Main screen displaying the Gantt chart and task management interface
│   └── (additional screens)
├── App.tsx                      # Main entry point of the application
├── app.json                     # Expo configuration file
├── package.json                 # Project dependencies and scripts
└── README.md                    # Project documentation
```

#### Key Components

- **GanttChart.tsx:** 
  - Renders the Gantt chart using `react-native-svg` and D3 for mobile.
  - Manages task rendering, scaling, and dynamic updates.
  - Includes horizontal scrolling and zooming functionality for large datasets.

- **TaskForm.tsx:**
  - Form for creating and editing tasks, including fields for task name, start date, end date, progress, and assignee.
  - Uses Ant Design components for styling and validation.

- **ParticipantForm.tsx:**
  - Form for managing participants, allowing users to add, edit, and assign colors to participants.
  - Includes capacity and tag management for better task distribution.

- **HomeScreen.tsx:**
  - The main screen of the app, displaying the Gantt chart and task/participant management panels.
  - Contains the state and logic for handling task and participant data.

### Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request on the main repository.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Contact

For questions or feedback, please contact [Your Name](mailto:your.email@example.com).
