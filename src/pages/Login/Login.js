import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { LoadingContext, UserContext } from '../../App';
import { auth, db } from '../../firebase';
const Login = () => {
    const [user,setUser]=useContext(UserContext);
    const [loading,setLoading]=useContext(LoadingContext);
    const navigate=useNavigate()
    const [email,setEmail]=useState();
    const [password,setPassword]=useState()
    useEffect(()=>{
        if(user?.email){
            navigate('/')
        }
        else{
            navigate('/login')
        }
    },[user])
    
    function login() 
    {
        
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            user.photoURL="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-512.png";
            console.log(email);

            const unsub = onSnapshot(
                collection(db, "users"),
                (snapshot) => {
                    let list = [];
                    snapshot.docs.forEach((doc) => {
                        list.push({id:doc.id,...doc.data() })
                    });
                    console.log(list)
                    const up_user=list.find(item=>item.email==email)
                    const do_up_user={
                        emailVerified:true,...up_user
                    }
                    console.log(do_up_user.emailVerified)
                    setUser(do_up_user)
                    localStorage.setItem('user', JSON.stringify(do_up_user));
                    
                }, (error) => {
                    console.log(error);
                }
            )}
        )
        .catch((error) => {
            // const errorCode = error.code;
            // const errorMessage = error.message;
            navigate('/login')
            alert('Invalid user and password')
        });
    
    }
    return (
        <div>
            <div className="bg-no-repeat bg-cover bg-center relative">
                <div className="absolute bg-gradient-to-b from-green-500 to-green-400 opacity-75 inset-0 z-0"></div>
                    <div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
                        <div className="flex-col flex  self-center p-10 sm:max-w-5xl xl:max-w-2xl  z-10">
                            <div className="self-start hidden lg:flex flex-col  text-white">
                                <img src="" className="mb-3" alt=""/>
                                <h1 className="mb-3 font-bold text-5xl">Hi !! Welcome Back </h1>
                            </div>
                        </div>
                        <div className="flex justify-center self-center  z-10">
                            <div className="p-12 bg-white mx-auto rounded-2xl w-100 ">
                                <div className="mb-4">
                                    <h3 className="font-semibold text-2xl text-gray-800">Sign In </h3>
                                    <p className="text-gray-500">Please sign in to your account.</p>
                                </div>
                                <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 tracking-wide">Email</label>
                                    <input type="email" className="w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400" 
                                    placeholder="mail@gmail.com" onChange={event=>setEmail(event.target.value)}/>
                                </div>
                                <div className="space-y-2">
                                    <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                                        Password
                                    </label>
                                    <input type="password" className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400" 
                                    placeholder="Enter your password" onChange={event=>setPassword(event.target.value)}/>
                                </div>
                                <div className="flex items-center justify-between">
                                
                                <div className="text-sm">
                                    <Link to={"/register"} className="text-green-400 hover:text-green-500">
                                        Don't have an account? Create one...
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <button type="button" className="w-full flex justify-center bg-green-400  hover:bg-green-500 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500" 
                                onClick={login}>
                                    Sign in
                                </button>
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Login;