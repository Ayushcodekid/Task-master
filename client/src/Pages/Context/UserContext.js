// import React, { createContext, useState, useEffect } from "react";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//     const [user, setUser] = useState(() => {
//         // Initial state is fetched from localStorage if available
//         const storedUser = localStorage.getItem('user');
//         return storedUser ? JSON.parse(storedUser) : null;
//     });

//      // Dark mode state with initial value from localStorage
//      const [isDarkMode, setIsDarkMode] = useState(() => {
//         const storedMode = localStorage.getItem('darkMode');
//         return storedMode === 'true'; // Convert stored string to boolean
//     });

//     useEffect(() => {
//         // Update localStorage whenever user state changes
//         if (user) {
//             localStorage.setItem('user', JSON.stringify(user));
//         } else {
//             localStorage.removeItem('user');
//         }
//     }, [user]);


//     useEffect(() => {
//         // Update localStorage whenever dark mode state changes
//         localStorage.setItem('darkMode', isDarkMode);
//     }, [isDarkMode]);

//     // Toggle dark mode function
//     const toggleTheme = () => {
//         setIsDarkMode(prevMode => !prevMode);
//     };

//     return (
//         <UserContext.Provider value={{ user, setUser, isDarkMode, toggleTheme }}>
//             {children}
//         </UserContext.Provider>
//     );
// };



























import React, { createContext, useState, useEffect } from "react";

// Create UserContext to store user, theme, and selected project-related state
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Initialize 'user' state from localStorage or set it to null if not present
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Initialize 'isDarkMode' state from localStorage, default is false if not present
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const storedMode = localStorage.getItem('darkMode');
        return storedMode === 'true'; // Stored values are string, so we convert it to boolean
    });

    // Initialize 'projectId' state from localStorage
    const [projectId, setProjectId] = useState(() => {
        const storedProjectId = localStorage.getItem('selectedProjectId');
        return storedProjectId || ''; // If no projectId, return empty string
    });

    // Effect to update localStorage whenever 'user' changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user)); // Store user as string in localStorage
        } else {
            localStorage.removeItem('user'); // Remove user from localStorage if it's null
        }
    }, [user]);

    // Effect to update localStorage whenever 'isDarkMode' changes
    useEffect(() => {
        localStorage.setItem('darkMode', isDarkMode.toString()); // Store dark mode as string ('true' or 'false')
    }, [isDarkMode]);

    // Effect to update localStorage whenever 'projectId' changes
    useEffect(() => {
        if (projectId) {
            localStorage.setItem('selectedProjectId', projectId); // Store projectId in localStorage
        } else {
            localStorage.removeItem('selectedProjectId'); // Remove projectId from localStorage if it's empty
        }
    }, [projectId]);

    // Function to toggle dark mode state
    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode); // Toggle the dark mode state
    };

    // Function to set the selected project ID
    const selectProject = (id) => {
        setProjectId(id); // Update the projectId state
    };

    return (
        <UserContext.Provider value={{ user, setUser, isDarkMode, toggleTheme, projectId, selectProject }}>
            {children}
        </UserContext.Provider>
    );
};
