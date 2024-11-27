
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DBUseData.css';  

const UserTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/getusers')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the users!', error);
      });
  }, []);

  return (
    <div className="user-table-container">
      <h1>User Details</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

