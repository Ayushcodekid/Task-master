import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Pages/Auth/Login"
import Register from "./Pages/Auth/Register"
import Todo from "./Pages/Todo/TodoList"
import { UserProvider } from "./Pages/Context/UserContext";


function App() {
  return (
  <>
    <UserProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/todo" element={<Todo />} />


      </Routes>
    </UserProvider>
    </>
  )
}

export default App