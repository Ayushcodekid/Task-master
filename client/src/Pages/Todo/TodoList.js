import React, { useEffect, useState } from 'react';
import './Todo.css';

import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { RiLoaderFill } from "react-icons/ri";
import api from '../../api';
import Navbar from "../Navbar/Navbar";

function Todo() {
  const [isCompleteScreen, setisCompleteScreen] = useState(false);
  const [newTitle, setnewTitle] = useState("");
  const [newDescription, setnewDescription] = useState("");
  const [allTodos, setallTodos] = useState([]);
  const [completedTodo, setcompeltedTodo] = useState([]);
  const [currentEdit, setcurrentEdit] = useState("");
  const [currentEditedItem, setcurrentEditedItem] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        if (userId) {
           setLoading(true);
          const response = await api.get(`/todos/${userId}`);
          const incompleteTodos = response.data.filter(todo => !todo.completedOn);
          const completedTodos = response.data.filter(todo => todo.completedOn);
          
          setallTodos(incompleteTodos);
          setcompeltedTodo(completedTodos);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching todos:", err.response?.data?.message || err.message);
      }
    };

    fetchTodos();
  }, [userId]);


  const getTodos = async () => {
    try {
      if (userId) {
        setLoading(true);
        const response = await api.get(`/todos/${userId}`);
        const incompleteTodos = response.data.filter(todo => !todo.completedOn); // Filter incomplete todos
        setallTodos(incompleteTodos);      
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching todos:", err.response?.data?.message || err.message);
    }
  };

  // Add new todo function
  const handleAlltodos = async () => {
    if (newTitle.length === 0 || newDescription.length === 0) {
      alert("Both Title and Description are required!");
      return;
    }

    let newTodolist = {
      title: newTitle,
      description: newDescription,
      userId,
    };

    try {
      if (userId) {
         setLoading(true);
        const response = await api.post('/todos', newTodolist);

        // Refetch todos after adding a new one
        getTodos();

        // Clear input fields
        setnewTitle('');
        setnewDescription('');
        setLoading(false);
      }
    } catch (err) {
      console.error("Error creating todo:", err.response?.data?.message || err.message);
    }
  };

 
  
  const handleDeleteTodo = async (index, id) => {
    try {
      if (userId) {
        setLoading(true);
        await api.delete(`/todos/${userId}/${id}`);
        if (isCompleteScreen) {
          setcompeltedTodo((prevTodos) => prevTodos.filter((_, i) => i !== index));
        } else {
          setallTodos((prevTodos) => prevTodos.filter((_, i) => i !== index));
        }
        setLoading(false);
      }
    } catch (err) {
      console.error("Error deleting todo:", err.response?.data?.message || err.message);
    }
  };



  const handleCompletedTodo = async (index, id) => {
    const now = new Date();
    const completedOn = now.toLocaleDateString();

    const completedTodoItem = {
      ...allTodos[index],
      completedOn,
    };
    

    try {
      if (userId) {
        setLoading(true);
        await api.post(`/todos/complete/${userId}/${id}`, completedTodoItem);
        setallTodos((prevTodos) => prevTodos.filter((_, i) => i !== index));

        setcompeltedTodo((prevCompleted) => [...prevCompleted, completedTodoItem]);
        getCompletedTodo();
        // handleDeleteTodo(index, id); 
        setLoading(false);
      }
    } catch (err) {
      console.error("Error marking todo as completed:", err.response?.data?.message || err.message);
    }
  };



  const getCompletedTodo = async () =>{
    try{
      if(userId){
        
        const response = await api.get(`/todos/completed/${userId}`);
        setcompeltedTodo(response.data)
      }
    }

      catch (err) {
        console.error("Error fetching completed todos:", err.response?.data?.message || err.message);
      
    }
  }

  const handleEdit = (index, item) => {
    setcurrentEdit(index);
    setcurrentEditedItem(item);
  };

  const handleUpdatedTodo = async () => {
    try {
      setLoading(true);
      if (userId && currentEditedItem) {
        await api.put(`/todos/${userId}/${currentEditedItem.id}`, currentEditedItem);
        setallTodos(prev => {
          const updatedTodos = [...prev];
          updatedTodos[currentEdit] = currentEditedItem;
          return updatedTodos;
        });
        setcurrentEdit(null);
        setcurrentEditedItem(null);
      }
    } catch (err) {
      console.error("Error updating todo:", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Navbar />
      <h1>My Todos</h1>

      {loading && (
        <div className="loader">
          <RiLoaderFill className="spinner" />
        </div>
      )}

      <div className='todo-wrapper'>
        <div className='todo-input'>
          <div className='todo-input-item'>
            <label>Title</label>
            <input type="text" value={newTitle} onChange={(e) => setnewTitle(e.target.value)} placeholder='Whats the task title?' />
          </div>

          <div className='todo-input-item'>
            <label>Description</label>
            <input type="text" value={newDescription} onChange={(e) => setnewDescription(e.target.value)} placeholder='Whats the task description?' />
          </div>

          <div className='todo-input-item'>
            <button type="button" onClick={handleAlltodos} className='primaryBtn'>Add</button>
          </div>
        </div>

        <div className='btn-area'>
          <button className={`secondaryBtn ${isCompleteScreen === false && 'active'}`} onClick={() => setisCompleteScreen(false)} >Todo</button>
          <button className={`secondaryBtn ${isCompleteScreen === true && 'active'} `} onClick={() => setisCompleteScreen(true)}>Completed</button>
        </div>

        <div className='todo-list'>
          {isCompleteScreen === false &&
            allTodos.map((item, index) => {
              if (currentEdit === index) {
                return (
                  <div className='edit_wrapper' key={index}>
                    <input placeholder='Updated Title' value={currentEditedItem.title} onChange={(e) => setcurrentEditedItem({ ...currentEditedItem, title: e.target.value })} />
                    <textarea placeholder='Updated Description' value={currentEditedItem.description} onChange={(e) => setcurrentEditedItem({ ...currentEditedItem, description: e.target.value })} />
                    <button type="button" onClick={handleUpdatedTodo} className='primaryBtn'>Update</button>
                    {/* <button type="button" onClick={} className='primaryBtn'>Cancel</button> */}

                  </div>
                );
              }
              return (
                <div className='todo-list-item' key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div className='all-btn'>
                    <AiOutlineDelete className='delete-icon' onClick={() => handleDeleteTodo(index, item.id)} />
                    <FaCheck className='check-icon' onClick={() => handleCompletedTodo(index, allTodos[index].id)} />
                    <AiOutlineEdit className='edit-icon' onClick={() => handleEdit(index, item)} />
                  </div>
                </div>
              );
            })
          }

          {isCompleteScreen === true && completedTodo.map((item, index) => (
            <div className='todo-list-item' key={index}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p>Completed On: {item.completedOn}</p>
              </div>
              <div>
                <AiOutlineDelete className='delete-icon' onClick={() => handleDeleteTodo(index, item.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Todo;
