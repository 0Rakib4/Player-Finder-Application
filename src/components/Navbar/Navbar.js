import React, { useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { LoadingContext, UserContext } from '../../App';

const Navbar = () => {
    const [user,setUser]=useContext(UserContext);
    const [loading,setLoading]=useContext(LoadingContext);
    const navigate=useNavigate();
    return (
        <div>
            <div className="navbar bg-base-100" data-theme="night">
                <div className="navbar-start">
                    <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link to='/'>Home</Link></li>
                        <li tabIndex={0}>
                        <a className="justify-between">
                            Profile
                            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg>
                        </a>
                        <ul className="p-2">                        
                            <li><Link to={user.userType=='Team Manager'?'/TeamProfile':'/PlayerTeamProfile'}>Team Profile</Link></li>
                            <li><Link to={user.userType=='Team Manager'?'/MyProfile':'/PlayerMyProfile'}>My Profile</Link></li>
                        </ul>
                        </li>
                        <li><Link to='/Chat'>Chat</Link></li>
                        {console.log(user.userType)}
                        {user.userType=='Player' && <li><Link to='/requests'>Requests</Link></li>}
                    </ul>
                    </div>
                    <a className="btn btn-ghost normal-case text-xl">Player Finder Application</a>
                </div>
                <div className="navbar-end hidden lg:flex">
                    <ul className="menu menu-horizontal">
                    <li><Link to='/'>Home</Link></li>
                    <li tabIndex={0}>
                        <a>
                        Profile
                        <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                        </a>
                        <ul className="p-2" data-theme="">
                        
                            <li><Link to={user.userType=='Team Manager'?'/TeamProfile':'/PlayerTeamProfile'}>Team Profile</Link></li>
                            <li><Link to={user.userType=='Team Manager'?'/MyProfile':'/PlayerMyProfile'}>My Profile</Link></li>
                        </ul>
                    </li>
                    <li><Link to='/Chat'>Chat</Link></li>
                    {user.userType=='Player' && <li><Link to='/requests'>Requests</Link></li>}
                    </ul>
                    <div className="avatar online mx-2">
                        <div className="w-12 rounded-full">
                            <img src={user?.photoURL?user.photoURL:"https://placeimg.com/192/192/people"} />
                        </div>
                    </div>
                    <button className="btn" 
                    onClick={()=>{
                        setUser({})
                        localStorage.clear()
                        navigate('/login')
                    }}>Logout</button>
                </div>
               
            </div>
        </div>
    );
};

export default Navbar;