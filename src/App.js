import { createContext, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import './App.css';
import Main from './components/Main/Main';
import { Toaster } from 'react-hot-toast';
import { router } from './Routers/Router/Route';
export const UserContext =createContext();
export const LoadingContext=createContext();
function App() {
  const [user,setUser]=useState(JSON.parse(localStorage.getItem("user")))
  const [loading,setLoading]=useState(false);
    
  return ( 
    <UserContext.Provider value={[user,setUser]}>      
        <LoadingContext.Provider value={[loading,setLoading]}>
          <div className="App">
            <RouterProvider router={router}>
              <Main></Main>
            </RouterProvider>
            <Toaster></Toaster>
          </div>
        </LoadingContext.Provider>
    </UserContext.Provider>
  )
}

export default App;
