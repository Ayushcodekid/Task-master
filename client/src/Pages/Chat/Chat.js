import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { UserContext } from '../Context/UserContext';

const socket = io('http://localhost:9000');

const Chat = () => { 
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);  // Ensure messages is initialized as an empty array
  const [isChatOpen, setIsChatOpen] = useState(true); // Controls popup visibility
  const [projectName, setProjectName] = useState(''); // New state to store project name

  const { user, setUser } = useContext(UserContext); // Access user from context

  const username = user?.username;
  const userId = user?.userId;
  const email = user?.email;

  const projectId = localStorage.getItem('selectedProjectId'); // Get projectId from localStorage

  useEffect(() => {
    if (projectId) {
      // Reset messages when project changes
      setMessages([]);
      setMessage('');

      // Fetch project and chat history in a single API call
      axios
        .get(`http://localhost:9000/api/projects/chat/${projectId}`) // Assuming the new backend endpoint
        .then((response) => {
          const { data } = response.data;  // Data contains both messages and project name

          if (data && data.length > 0) {
            setProjectName(data[0].projectname);  // Set project name from the response
            console.log("Project Name:", data[0].projectname);

            setMessages(data);  // Set all chat messages
            console.log("Messages:", data);

          } else {
            console.error('No data found for this project.');
          }
        })
        .catch((err) => console.error('Error fetching project and chat data:', err));

      // Join the new project's chat room
      socket.emit('joinProject', { projectId });
      console.log("Joined project:", projectId);
    } else {
      console.error('ProjectId is undefined or missing!');
    }

    // Cleanup the socket listener to prevent duplicate handling
    return () => {
      socket.off('receiveMessage');
    };
  }, [projectId]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    const newMessage = {
      projectId,
      senderEmail: email,
      senderName: username,
      message,
    };

    // Emit the new message via Socket.IO to notify other users in the project
    socket.emit('sendMessage', newMessage);

    // Immediately append the new message to the chat without waiting for the backend
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Save the message to the backend
    axios
      .post('http://localhost:9000/api/projects/messages', newMessage)
      .then((response) => {
        console.log('Message saved:', response.data);

        // Fetch updated chat history after sending the message
        axios
          .get(`http://localhost:9000/api/projects/chat/${projectId}`)
          .then((response) => {
            const chatHistory = response.data.data;
            if (Array.isArray(chatHistory)) {
              setMessages(chatHistory);
            } else {
              setMessages([chatHistory]);
            }
          })
          .catch((err) => console.error('Error fetching chat history:', err));
      })
      .catch((err) => console.error('Error sending message:', err));

    // Clear the message input field after sending
    setMessage('');
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '5.2%',
        width: isChatOpen ? '20%' : '20%',
        height: isChatOpen ? '400px' : '50px',
        backgroundImage: 'radial-gradient(circle 1300px at 58% 90%, #243447, #0f0f14 70%)',
        borderRadius: '10px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        transition: '0.3s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: 'black',
          color: '#FFF',
          padding: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <h3 style={{ margin: 0, fontSize: '1rem' }}> {projectName}</h3>
        <span>{isChatOpen ? '▼' : '▲'}</span>
      </div>

      {/* Messages Area */}
      {isChatOpen && (
        <div className='chat-body'
          style={{
            flex: 1,
            padding: '10px',
            overflowY: 'auto',
           backgroundColor: '#02486e'
          }}
        >
          {Array.isArray(messages) && messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: msg.senderemail === email ? 'flex-end' : 'flex-start',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '10px',
                    backgroundColor: msg.senderemail === email ? '#01796F' : '#013E3E',
                    color: '#FFF',
                    borderRadius: '10px',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.8rem',
                      opacity: 0.8,
                    }}
                  >
                    {msg.senderemail}
                  </p>
                  <p style={{ margin: '5px 0' }}>{msg.message}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No messages available</p>
          )}
        </div>
      )}

      {/* Input Area */}
      {isChatOpen && (
        <form
          onSubmit={handleSendMessage}
          style={{
            display: 'flex',
            padding: '5px',
            backgroundColor: 'white',
            borderTop: '1px solid #025E4C',
          }}
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '5px',
              marginRight: '10px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px',
              backgroundColor: '#01796F',
              border: 'none',
              color: '#FFF',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            ➤
          </button>
        </form>
      )}
    </div>
  );
};

export default Chat;

























// import React, { useState, useEffect, useContext } from 'react';
// import io from 'socket.io-client';
// import axios from 'axios';
// import { UserContext } from '../Context/UserContext';

// const socket = io('http://localhost:9000');

// const Chat = () => {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [isChatOpen, setIsChatOpen] = useState(true); // Controls popup visibility
//   const [projectName, setProjectName] = useState(''); // New state to store project name

//   const { user } = useContext(UserContext); // Access user from context

//   const projectId = localStorage.getItem('selectedProjectId');
//   const username = user?.username;
//   const userId = user?.userId;
//   const email = user?.email;

//   useEffect(() => {
//     if (projectId) {
//       // Reset messages when project changes
//       setMessages([]);
//       setMessage('');

//       // Fetch project and chat history in a single API call
//       axios
//         .get(`http://localhost:9000/api/projects/chat/${projectId}`) // Assuming the new backend endpoint
//         .then((response) => {
//           const { data } = response.data;  // Data contains both messages and project name

//           if (data && data.length > 0) {
//             setProjectName(data[0].projectname);  // Set project name from the response
//             console.log("Project Name:", data[0].projectname);

//             setMessages(data);  // Set all chat messages
//             console.log("Messages:", data);

//           } else {
//             console.error('No data found for this project.');
//           }
//         })
//         .catch((err) => console.error('Error fetching project and chat data:', err));

//       // Join the new project's chat room
//       socket.emit('joinProject', { projectId });
//       console.log("Joined project:", projectId);
//     } else {
//       console.error('ProjectId is undefined or missing!');
//     }

//     // Cleanup the socket listener to prevent duplicate handling
//     return () => {
//       socket.off('receiveMessage');
//     };
//   }, [projectId]);

//   const handleSendMessage = (e) => {
//     e.preventDefault();

//     const newMessage = {
//       projectId,
//       senderEmail: email,
//       senderName: username,
//       message,
//     };

//     // Emit message via Socket.IO
//     socket.emit('sendMessage', newMessage);

//     // Save message to backend
//     axios
//       .post('http://localhost:9000/api/projects/messages', newMessage)
//       .then((response) => {
//         console.log('Message saved:', response.data);
//       })
//       .catch((err) => console.error('Error sending message:', err));

//     setMessage('');
//   };

//   return (
//     <div
//       style={{
//         position: 'fixed',
//         bottom: '20px',
//         right: '20px',
//         width: isChatOpen ? '20%' : '20%',
//         height: isChatOpen ? '400px' : '50px',
//         backgroundColor: '#003534',
//         borderRadius: '10px',
//         overflow: 'hidden',
//         display: 'flex',
//         flexDirection: 'column',
//         boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//         transition: '0.3s ease',
//       }}
//     >
//       {/* Header */}
//       <div
//         style={{
//           backgroundColor: '#025E4C',
//           color: '#FFF',
//           padding: '10px',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           cursor: 'pointer',
//         }}
//         onClick={() => setIsChatOpen(!isChatOpen)}
//       >
//         <h3 style={{ margin: 0, fontSize: '1rem' }}>{projectName}</h3>
//         <span>{isChatOpen ? '▼' : '▲'}</span>
//       </div>

//       {/* Messages Area */}
//       {isChatOpen && (
//         <div
//           style={{
//             flex: 1,
//             padding: '10px',
//             overflowY: 'auto',
//             backgroundColor: '#002D2B',
//           }}
//         >
//           {messages.map((msg, index) => (
//             <div
//               key={index}
//               style={{
//                 display: 'flex',
//                 justifyContent: msg.senderId === userId ? 'flex-end' : 'flex-start',
//                 marginBottom: '10px',
//               }}
//             >
//               <div
//                 style={{
//                   maxWidth: '70%',
//                   padding: '10px',
//                   backgroundColor: msg.senderId === userId ? '#01796F' : '#013E3E',
//                   color: '#FFF',
//                   borderRadius: '10px',
//                 }}
//               >
//                 <p
//                   style={{
//                     margin: 0,
//                     fontSize: '0.8rem',
//                     opacity: 0.8,
//                   }}
//                 >
//                   {username}
//                 </p>
//                 <p style={{ margin: '5px 0' }}>{msg.message}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Input Area */}
//       {isChatOpen && (
//         <form
//           onSubmit={handleSendMessage}
//           style={{
//             display: 'flex',
//             padding: '10px',
//             backgroundColor: '#013E3E',
//             borderTop: '1px solid #025E4C',
//           }}
//         >
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Type your message here..."
//             style={{
//               flex: 1,
//               padding: '10px',
//               border: 'none',
//               borderRadius: '5px',
//               marginRight: '10px',
//               outline: 'none',
//             }}
//           />
//           <button
//             type="submit"
//             style={{
//               padding: '10px',
//               backgroundColor: '#01796F',
//               border: 'none',
//               color: '#FFF',
//               borderRadius: '5px',
//               cursor: 'pointer',
//             }}
//           >
//             ➤
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default Chat;
