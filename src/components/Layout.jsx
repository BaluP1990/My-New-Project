// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import TopBar from './TopBar';
// import './Layout.css'; 

// const Layout = () => {
//   return (
//     <div className="layout">
//       <TopBar />
//       <Sidebar />
//       <TopBar />
//       <div className="scrollable-container">
//         <Outlet /> 
//       </div>
//     </div>
//   );
// };

// export default Layout;


import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import './Layout.css'; 

const Layout = ({ user, onLogout }) => {
 
  return (
    <div className="layout">
      <TopBar user={user} onLogout={onLogout} notificationCount={5} /> 
      <Sidebar user={user} onLogout={onLogout} />
      <div className="scrollable-container">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

