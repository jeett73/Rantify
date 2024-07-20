import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Product from "./components/Product";
// import Test from "./components/Test";
import Login from "./components/Login";
import Register from "./components/Register";
import { ProtectedRouter } from "./ProtectedRoutes";
import Dashboard from "./components/Dashboard";
import Chat from "./components/Chat";
import config from './Config';

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);
  let loggedUserId = localStorage.getItem("user");
  loggedUserId = JSON.parse(loggedUserId);

  useEffect(() => {
    const socketConnection = io(`${config.ipAddress}:8080`);
    socketConnection.on('connect', () => {
      console.log('Connected to server');
    });

    socketConnection.on('disconnect', () => {
      console.log('Disconnected from server');
    });
    if(loggedUserId && loggedUserId.user && loggedUserId.user._id){
      socketConnection.emit('registerUser', loggedUserId.user._id);
    }
    // Example of sending a custom event
    // socket.emit('customEvent', { message: 'Hello from client!' });

    // console.log("@#@#@#@#@##@11111111112221");
    // // Listening for custom events from server
    // socket.on('customEvent', (data) => {
    //   console.log('Received custom event from server:', data);
    // });

    setSocket(socketConnection);
    return () => {
      // Cleanup on component unmount
      socketConnection.disconnect();
    };
  }, []);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {socket && <Route path="/chats/:userId" element={<Chat socket={socket} />} />}
          <Route index path="/dashboard" element={
            <ProtectedRouter>
              <Dashboard />
            </ProtectedRouter>
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
