// // App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { UserProvider } from './context/UserContext'; 
// import Layout from './components/Layout';
// import HomePage from './pages/HomePage';
// import TasksPage from './pages/TasksPage';
// import ReportsPage from './pages/ReportsPage';
// import CalendarView from './pages/CalendarView';
// import TaskManager from './components/TaskManager';
// import TaskStatistics from './components/TaskStatistics';
// import Login from './components/Login';
// import ProtectedRoute from './components/ProtectedRoute';

// function App() {
//   return (
//     <UserProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<Layout />}>
//             <Route index element={<Login />} />
//             <Route
//               path="home"
//               element={
//                 <ProtectedRoute allowedRoles={['admin', 'user']}>
//                   <HomePage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="tasks"
//               element={
//                 <ProtectedRoute allowedRoles={['admin', 'user']}>
//                   <TasksPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="reports"
//               element={
//                 <ProtectedRoute allowedRoles={['user']}>
//                   <ReportsPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="calendarview" element={<CalendarView />} />
//             <Route
//               path="TaskManager"
//               element={
//                 <ProtectedRoute allowedRoles={['admin', 'manager']}>
//                   <TaskManager />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="TaskStatistics"
//               element={
//                 <ProtectedRoute allowedRoles={['admin', 'analyst']}>
//                   <TaskStatistics />
//                 </ProtectedRoute>
//               }
//             />
//           </Route>
//         </Routes>
//       </Router>
//     </UserProvider>
//   );
// }

// export default App;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Layout from './components/Layout';
// import HomePage from './pages/HomePage';
// import TasksPage from './pages/TasksPage';
// import ReportsPage from './pages/ReportsPage';
// import CalendarView from './pages/CalendarView';
// import TaskManager from './components/TaskManager';
// import TaskStatistics from './components/TaskStatistics';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Layout />}>
//           <Route index element={<HomePage />} /> 
//           <Route path="home" element={<HomePage />} />
//           <Route path="tasks" element={<TasksPage />} />
//           <Route path="reports" element={<ReportsPage />} />
//           <Route path="calendarview" element={<CalendarView />} />
//           <Route path="TaskManager" element={<TaskManager />} />
//           <Route path="TaskStatistics" element={<TaskStatistics />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import ReportsPage from './pages/ReportsPage';
import CalendarView from './pages/CalendarView';
import TaskManager from './components/TaskManager';
import TaskStatistics from './components/TaskStatistics';
import Login from './components/Login'; 
import HvacDashboard from './components/HvacDashboard';
import TicketBooking from './components/TicketBooking';
import Admin from './components/Admin';
import PDFRedact from './components/PDFRedact';
import PDFMerge from './components/PDFMerge';
import PDFManagement from './components/PDFManagement';
import GoogleMapSearch from './components/GoogleMapSearch';

function App() {
  const [user, setUser] = useState(null); 

  const handleLogin = (role) => {
    setUser({ role }); 
  };

  const handleLogout = () => {
    setUser(null); 
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
      
        {user ? (
          <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
            <Route index element={<HomePage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="Tasks" element={<TasksPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="calendarview" element={<CalendarView />} />
            <Route path="TaskManager" element={<TaskManager />} />
            <Route path="TaskStatistics" element={<TaskStatistics />} />
            <Route path="HvacDashboard" element={<HvacDashboard />} />
            <Route path="TicketBooking" element={<TicketBooking />} />
            <Route path="TicketAdmin" element={<Admin />} />
            {/* <Route path="PDFRedact" element={<PDFRedact />} />
            <Route path="PDFMerge" element={<PDFMerge />} /> */}
            <Route path="PDFManagement" element={<PDFManagement />} />
            <Route path="GoogleMapSearch" element={<GoogleMapSearch />} />
           
            <Route path="*" element={user.role !== 'user' ? <Navigate to="/home" /> : <Navigate to="/tasks" />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" />} /> 
        )}
      </Routes>
    </Router>
  );
}

export default App;

