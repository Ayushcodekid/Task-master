import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Initial state is fetched from localStorage if available
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

     // Dark mode state with initial value from localStorage
     const [isDarkMode, setIsDarkMode] = useState(() => {
        const storedMode = localStorage.getItem('darkMode');
        return storedMode === 'true'; // Convert stored string to boolean
    });

    useEffect(() => {
        // Update localStorage whenever user state changes
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);


    useEffect(() => {
        // Update localStorage whenever dark mode state changes
        localStorage.setItem('darkMode', isDarkMode);
    }, [isDarkMode]);

    // Toggle dark mode function
    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    return (
        <UserContext.Provider value={{ user, setUser, isDarkMode, toggleTheme }}>
            {children}
        </UserContext.Provider>
    );
};
