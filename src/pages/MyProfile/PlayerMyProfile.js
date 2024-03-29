import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useContext, useEffect, useState } from 'react';
import { db, storage } from './../../firebase'
import { addDoc, serverTimestamp, collection, updateDoc, doc } from 'firebase/firestore'
import { UserContext } from '../../App';

const PlayerMyProfile = () => {
    const [user,setUser]=useContext(UserContext)
    const initialState = {
        name: "",
        email: user.email,
        present_address: "",
        permanent_address: "",
        nid: "",
        contact: "",
        scores: "",
        assist: "",
        save: "",
        red_card: "",
        yellow_card: "",
        skill: "",
        playedGames:"",
        expectedPrice:"",
        password:"",
        id:user.id,
        photoURL: "",
        videoURL:"",
        gamesType: user.gamesType
    }
    const [data, setData] = useState(initialState);
    const { name, email, permanent_address, present_address, contact, nid ,password,id,photoURL,scores,assist,save,red_card,yellow_card,skill, playedGames,expectedPrice,gamesType} = data;
    const [file, setFile] = useState(null);
    const [file2,setFile2]=useState(null);
    const [progress, setProgress] = useState(null);
    const [progress2, setProgress2] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    
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
                    setData((prev) => ({ ...prev, photoURL: downloadURL }));
                });
            })

        }
        file && uploadFile()
    }, [file])

    useEffect(() => {
        const uploadFile = () => {
            const name = new Date().getTime() + file2.name;
            const storageRef = ref(storage, file2.name);
            const uploadTask = uploadBytesResumable(storageRef, file2);
            uploadTask.on("state_changed", (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setProgress2(progress);
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
                    setData((prev) => ({ ...prev, videoURL: downloadURL }));
                });
            })
        }
        file2 && uploadFile()
    }, [file2])

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // let errors = validate();
        // if (Object.keys(errors).length) return setErrors(errors);
        if(id){
        
            try{
                console.log(data,email)
                setIsSubmit(true);
                await updateDoc(doc(db, 'users',id), {
                    ...data
                });

                setUser({...data})
                localStorage.setItem("user",JSON.stringify({...data}))
                alert('saved successfully');
                
                
            }
            catch(err){
                console.log(err)
            }
        }   
    }

    return (
        <div>
            
            <div className='mx-auto w-3/4 mt-24'>
                <>
                    <br/>
                    
                    <div className="form-control">
                        <label className="input-group m-2">
                            <span className='w-1/4'>Full Name</span>
                            <input type="text" placeholder={"Name"} className="input input-bordered w-full"
                             name='name'  required onChange={handleChange}/>
                        </label>
                        <label className="input-group m-2">
                            <span className='w-1/4'>NID No</span>
                            <input type="text" placeholder={ "Your National ID No"}
                             className="input input-bordered w-full" onChange={handleChange}  name='nid' required />
                        </label>
                        <label className="input-group m-2">
                            <span className='w-1/4'>Present Address</span>
                            <input type="text" placeholder={ "Your Present Address"}  className="input input-bordered w-full" 
                            required name='present_address' onChange={handleChange}/>
                        </label>
                        <label className="input-group m-2">
                            <span className='w-1/4'>Permanent Address</span>
                            <input type="text" placeholder={"Your Permanent Address"}  className="input input-bordered w-full" name='permanent_address'
                            onChange={handleChange} required />
                        </label>
                        <label className="input-group m-2">
                            <span className='w-1/4'>Contact</span>
                            <input type="number" placeholder={ "Your Contact Number"} className="input input-bordered w-full"  name='contact'
                            onChange={handleChange} required />
                        </label>
                        
                        <label className="input-group m-2">
                            <span className='w-1/4'>Score</span>
                            <input type="number" placeholder={`Your ${user.gamesType=="Cricket"?"Run":"Goal "} Number`} className="input input-bordered w-full"  name='scores'
                            onChange={handleChange} required />
                        </label>
                        
                        {user.gamesType=="Football"?
                        <>
                        <label className="input-group m-2">
                            <span className='w-1/4'>Assist</span>
                            <input type="number" placeholder={`Your Assist Goal Number`} className="input input-bordered w-full"  name='assist'
                            onChange={handleChange} required />
                        </label>
                        <label className="input-group m-2">
                            <span className='w-1/4'>Save (only for Goalkeeper)</span>
                            <input type="number" placeholder={`Your Saved Goal Number`} className="input input-bordered w-full"  name='save'
                            onChange={handleChange} required />
                        </label>
                        <label className="input-group m-2">
                            <span className='w-1/4'>Red Card</span>
                            <input type="number" placeholder={`Your Red Card Number`} className="input input-bordered w-full"  name='red_card'
                            onChange={handleChange} required />
                        </label>
                        <label className="input-group m-2">
                            <span className='w-1/4'>Yellow Card</span>
                            <input type="number" placeholder={`Your Yellow Card Number`} className="input input-bordered w-full"  name='yellow_card'
                            onChange={handleChange} required />
                        </label>
                        </>
                        :<></>}
                        

                        <label className="input-group m-2">
                            <span className='w-1/4'>Skill</span>
                            <input type="text" placeholder={ "Describe your skills"} className="input input-bordered w-full"  name='skill'
                            onChange={handleChange} required />
                        </label>
                        
                        <label className="input-group m-2">
                            <span className='w-1/4'>Played Games</span>
                            <input type="number" placeholder={ "Please enter the number of how many games you have played?"} className="input input-bordered w-full"  name='playedGames'
                            onChange={handleChange} required />
                        </label>

                        
                        <label className="input-group m-2">
                            <span className='w-1/4'>Expected Price</span>
                            <input type="number" placeholder={ "Your Expected Price"} className="input input-bordered w-full"  name='expectedPrice'
                            onChange={handleChange} required />
                        </label>

                        
                        <label className="input-group m-2">
                            <span className='w-1/4'>Change Profile Image</span>
                            <input type="file"  className="input w-full" name='photoURL'  onChange={(e) => setFile(e.target.files[0])} required />
                        </label>
                        <label className="input-group m-2">
                            <span className='w-1/4'>Upload Video</span>
                            <input type="file"  className="input w-full" name='videoURL'  onChange={(e) => setFile2(e.target.files[0])} required />
                        </label>
                    </div>
                    <button className="btn btn-primary w-1/4 mt-4 mb-10" onClick={handleSubmit} disabled={progress !== null && progress < 100} >Update Profile</button>
                </>
            </div>

        </div>
    );
};

export default PlayerMyProfile;