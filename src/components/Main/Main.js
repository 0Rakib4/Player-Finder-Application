import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const Main = () => {
    
    return (
        <div className='relative'>
            <div  className='fixed top-0 left-0 right-0 z-10'><Navbar></Navbar></div>
            <div><Outlet></Outlet></div>
            
        </div>
    );
};

export default Main;