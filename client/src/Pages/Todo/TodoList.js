import './Todo.css';
import React, { useEffect, useState } from 'react';

import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import Navbar from "../Navbar/Navbar"



function Todo() {

  const [isCompleteScreen, setisCompleteScreen] = useState(false)
  const [newTitle, setnewTitle] = useState("");
  const [newDescription, setnewDescription] = useState("");
  const [allTodos, setallTodos] = useState([]);
  const [completedTodo, setcompeltedTodo] = useState([]);
  const [currentEdit, setcurrentEdit] = useState("");
  const [currentEditedItem, setcurrentEditedItem] = useState("");



  const handleAlltodos = () => {

    if (newTitle.length=== 0 || newDescription.length===0) {
      // Alert or display a message if either field is empty
      alert("Both Title and Description are required!");
      return;
    }

    let newTodolist = {
      title: newTitle,
      Description: newDescription
    }

    let updatedTodoArr = [...allTodos]
    updatedTodoArr.push(newTodolist);
    setallTodos(updatedTodoArr);
    localStorage.setItem('Todolist', JSON.stringify(updatedTodoArr))
    setnewTitle('')
    setnewDescription('')
  }


  const handleDeleteTodo = (index) => {
    let reducedTodo = [...allTodos]
    reducedTodo.splice(index, 1);

    localStorage.setItem('Todolist', JSON.stringify(reducedTodo))
    setallTodos(reducedTodo)

  }


  const handleDeleteCompletedTodo = (index) => {
    let reducedCompleteTodo = [...completedTodo]
    reducedCompleteTodo.splice(index, 1)

    localStorage.setItem('completedTodo', JSON.stringify(reducedCompleteTodo))
    setcompeltedTodo(reducedCompleteTodo)
  }







  const handleCompletedTodo = (index) => {
    let now = new Date();
    let dd = now.getDay();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();

    let completedOn = dd + '-' + mm + '-' + yyyy


    let filteredTodo = {
      ...allTodos[index],
      CompletedOn: completedOn
    }

    let updatedCompleteTodoArr = [...completedTodo];
    updatedCompleteTodoArr.push(filteredTodo)
    setcompeltedTodo(updatedCompleteTodoArr)
    handleDeleteTodo(index);
    localStorage.setItem('completedTodo', JSON.stringify(updatedCompleteTodoArr))
  }


  const handleEdit = (index, item) => {
    setcurrentEdit(index);
    setcurrentEditedItem(item)

  }

  const handleUpatedTitle = (value) => {
    setcurrentEditedItem((prev)=>{
      return {...prev , title: value}
    })

  }

  const handleUpatedDescription = (value) => {
    setcurrentEditedItem((prev)=>{
      return {...prev , Description: value}
    })
  }


  const handleUpdatedTodo= () =>{
      let newTodo = [...allTodos]
      newTodo[currentEdit]= currentEditedItem;
      setallTodos(newTodo);
      setcurrentEdit("");
      localStorage.setItem('Todolist', JSON.stringify(newTodo))
  }

  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem('Todolist'));
    let savedCompletedtodo = JSON.parse(localStorage.getItem('completedTodo'))
    if (savedTodo) {
      setallTodos(savedTodo)
    }

    if (savedCompletedtodo) {
      setcompeltedTodo(savedCompletedtodo)
    }
  }, [])

  return (
    <div className="App">
      <Navbar/>
      <h1>My toddos</h1>

      <div className='todo-wrapper'>
        <div className='todo-input'>
          <div className='todo-input-item'>
            <label>Title</label>
            <input type="text" value={newTitle} onChange={(e) => setnewTitle(e.target.value)} placeholder='whats the task title?' />
          </div>

          <div className='todo-input-item'>
            <label>Description</label>
            <input type="text" value={newDescription} onChange={(e) => setnewDescription(e.target.value)} placeholder='whats the task description?' />
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
                    <input placeholder='Updated Title' value={currentEditedItem.title} onChange={(e) => handleUpatedTitle(e.target.value)} />
                    <textarea placeholder='Updated Description' value={currentEditedItem.Description} onChange={(e) => handleUpatedDescription(e.target.value)} />
                    <button type="button" onClick={() => handleUpdatedTodo()} className='primaryBtn'>Update</button>

                  </div>
                )
              }
              return (
                <div className='todo-list-item' key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.Description}</p>
                  </div>

                  <div className='all-btn'>
                    <AiOutlineDelete className='delete-icon' onClick={() => handleDeleteTodo(index)} />
                    <FaCheck className='check-icon' onClick={() => handleCompletedTodo(index)} />
                    <AiOutlineEdit className='edit-icon' onClick={() => handleEdit(index,item)} />
                  </div>
                </div>
              )
            })}

          {isCompleteScreen === true && completedTodo.map((item, index) => {
            return (
              <div className='todo-list-item' key={index}>
                <div >
                  <h3>{item.title}</h3>
                  <p>{item.Description}</p>
                  <p>Completed On: {item.CompletedOn}</p>
                </div>

                <div>
                  <AiOutlineDelete className='delete-icon' onClick={() => handleDeleteCompletedTodo(index)} />
                </div>
              </div>
            )
          })}
        </div>



      </div>


    </div>
  );
}

export default Todo;





