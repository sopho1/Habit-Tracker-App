# Habit Tracker App

A multilingual habit tracking web application that helps users build and maintain positive habits. Users can add, edit, and manage habits, track daily progress, and view performance statistics. The app supports multiple languages and provides a user-friendly interface.

## Features

- **Add, Edit, and Delete Habits:** Create new habits, update existing ones, and remove habits you no longer want to track.
- **Customizable Frequency:** Choose which days of the week each habit should be tracked.
- **Progress Tracking:** Mark habits as completed for each day and view your progress over time.
- **Performance Badges:** Earn badges and rewards for consistency and goal achievement.
- **Multilingual Support:** Available in English, Amharic, and Afaan Oromo.
- **Responsive Design:** Works well on both desktop and mobile devices.
- **User Authentication:** Secure login and registration.
- **Forum:** Community forum for sharing tips and motivation.
- **Notifications:** Get reminders and notifications for your habits.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ``sh
   git clone https://github.com/sopho1/habit-tracker-app.git
   cd habit-tracker-app/Habit-Tracker-App

 2. Install dependencies:

    npm install
    # or
    yarn install

 3. Set up Firebase:

  Create a .env file in the root directory.
  Add your Firebase configuration (see .env.example if available).
  
 4. Start the development server:

    npm start
    # or
    yarn start

  5. Open http://localhost:3000 to view the app in your browser.

  ## Project Structure
  
src/ - Main source code
api/ - API calls and hooks (e.g., habits, authentication)
components/ - Reusable UI components
screens/ - Page-level components (e.g., Add Habit, Edit Habit)
data/ - Data schemas and mock data
localization/ - Locale and language helpers
translations/ - Translation files
context/ - React context providers (e.g., Auth, Snackbar)
utils/ - Utility functions
public/ - Static assets and HTML template

  ## Technologies Used
  
React
Material-UI
Firebase (Authentication & Realtime Database)
React Query
React Router
Yup (form validation)
i18n (custom translation system)

  ##Contributing
  
Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

