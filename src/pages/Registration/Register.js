import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../../firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';


const Register = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [gamesType, setGamesType] = useState('');
    const [userType, setUserType] = useState('');
    const [pic, setPic] = useState('');
    const [file, setFile] = useState('');
    const [data,setData]=useState();
    const [progress, setProgress] = useState(null);
    
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate=useNavigate();
    useEffect(() => {
        const uploadFile = () => {
            const name = new Date().getTime() + file.name;
            const storageRef = ref(storage, file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on("state_changed", (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setProgress(progress);
                switch (snapshot.state) {
                    case 'paused':
                        console.log('upload is paused');
                        break;
                    case 'running':
                        console.log('upload is running');
                        break;
                    default:
                        break;
                }
            }, (error) => {
                console.log(error)
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log(downloadURL);
                    setPic(()=> ({  photo: downloadURL }));
                });
            })

        }
        file && uploadFile()
    }, [file])
    const handleSubmit = async () => {
        // e.preventDefault();
        // let errors = validate();
        // if (Object.keys(errors).length) return setErrors(errors);
        
        setIsSubmit(true);
        if(!file){
            alert("please upload an image of profile");
            return '';
        }
        try{
            const {photo}=pic;
            await addDoc(collection(db, 'users'), {
                email, name, password,userType,gamesType,photoURL:photo,
                timeStamp: serverTimestamp(),
            });
            if(userType=='Team Manager'){
                await addDoc(collection(db, 'team'), {
                    "TeamManagerEmail":email,
                    gamesType, 
                    timeStamp: serverTimestamp(),
                });
            }
            // verifyEmail();
        }
        catch(err){
            console.log(err)
        }
        
        
    }
    function verifyEmail() {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                alert("please check your mail inbox or spam folder and click on verify button")
            });
    }
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
        console.log(e.target.name, e.target.value);
    }
    function createUser() {
        console.log(email,password)
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                handleSubmit();
                console.log(user);
                
            })
            .catch((error) => {

                const errorMessage = error.message;
                alert(errorMessage);
            });
    }
    return (
        <div>
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-500 to-green-400 opacity-75">
                <div className="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg md:w-1/3 lg:w-1/3 sm:w-1/3">
                    <div className="flex justify-center">
                    
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-48 h-48 text-blue-600" fill="none" viewBox="0 0 48 48"
                            stroke="currentColor">
                            <path d="m10.8 40-2.1-2.1 20.4-20.4H22v4h-3v-7h11.15q.7 0 1.35.25.65.25 1.15.75l6 5.95q1.45 1.45 3.35 2.2 1.9.75 4 .85v3q-2.6-.1-5-.975T36.8 23.8l-2.3-2.3-5.7 5.7 4.3 4.3-12.2 7.05-1.5-2.6 8.8-5.1-4.1-4.1ZM6 26v-3h10v3Zm-4-6.5v-3h10v3Zm37.5-4q-1.45 0-2.475-1.025Q36 13.45 36 12q0-1.45 1.025-2.475Q38.05 8.5 39.5 8.5q1.45 0 2.475 1.025Q43 10.55 43 12q0 1.45-1.025 2.475Q40.95 15.5 39.5 15.5ZM6 13v-3h10v3Z"/>
                            
                        </svg>
                    </div>
        
                    <h3 className="text-2xl font-bold text-center">Join us</h3>
                    <div>
                        <div className="mt-4">
                            <div>
                                <label className="block" htmlFor="Name">Name</label>
                                    <input type="text" placeholder="Name"
                                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                        onChange={event => setName(event.target.value)}/>
                            </div>
                            <div className="mt-4">
                                <label className="block" htmlFor="email">Email</label>
                                        <input type="text" placeholder="Email"
                                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                            onChange={event => setEmail(event.target.value)}/>
                            </div>
                            <div className="mt-4">
                                <label className="block" htmlFor="email">Photo</label>
                                        <input type="file" placeholder="Choose photo"
                                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                            onChange={(e) => setFile(e.target.files[0])}/>
                            </div>
                            <div className="mt-4">
                                <label className="block">Password</label>
                                        <input type="password" placeholder="Password"
                                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                            onChange={event => setPassword(event.target.value)}/>
                            </div>
                            <div className="mt-4">
                                <label className="block">Confirm Password</label>
                                        <input type="password" placeholder="Password"
                                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"/>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-center">
                                    <div className="mb-3 xl:w-full">
                                    <label className="block">Game Types</label>
                                        <select className="form-select appearance-none
                                        block
                                        w-full
                                        px-3
                                        py-1.5
                                        text-base
                                        font-normal
                                        text-gray-700
                                        bg-white bg-clip-padding bg-no-repeat
                                        border border-solid border-gray-300
                                        rounded
                                        transition
                                        ease-in-out
                                        m-0
                                        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example"
                                        onChange={event=>setGamesType(event.target.value)}>
                                            <option defaultValue>Select Games Type</option>
                                            <option value={'Cricket'}>Cricket</option>
                                            <option value={'Football'}>Football</option>
                                            <option value={'Hockey'}>Hockey</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                            <div className="flex justify-center">
                                    <div className="mb-3 xl:w-full">
                                    <label className="block">User Types</label>
                                        <select className="form-select appearance-none
                                        block
                                        w-full
                                        px-3
                                        py-1.5
                                        text-base
                                        font-normal
                                        text-gray-700
                                        bg-white bg-clip-padding bg-no-repeat
                                        border border-solid border-gray-300
                                        rounded
                                        transition
                                        ease-in-out
                                        m-0
                                        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example"
                                        onChange={event=>setUserType(event.target.value)}  name='userTypes'>
                                            <option defaultValue>Select User Type</option>
                                            <option value={'Team Manager'}>Team Manager</option>
                                            <option value={'Player'}>Player</option>
                                            
                                        </select>
                                    </div>
                                </div>
                        
                            </div>
                            <div className="flex">
                                <button className="w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900" 
                                onClick={createUser}>Create
                                    Account</button>
                            </div>
                            <div className="mt-6 text-grey-dark">
                                Already have an account?
                                <Link to={'/login'} className="text-blue-600 hover:underline" href="#">
                                    Log in
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;