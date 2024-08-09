import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Landing from "./Pages/Landing/landing";
import Login from "./Pages/Auth/Login"
import Register from "./Pages/Auth/Register"
import Todo from "./Pages/Todo/TodoList"
import { isLoggedIn } from "./auth";


function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Landing />}/> */}
      <Route path="/" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/todo" element={<Todo />}/>


    </Routes>
  )
}

export default App