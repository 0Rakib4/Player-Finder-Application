import React, { useContext, useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from './../../firebase'
import { addDoc, serverTimestamp, collection, updateDoc, doc } from 'firebase/firestore'
import { UserContext } from '../../App';
const MyProfile = () => {
    const [user,setUser]=useContext(UserContext)
    const initialState = {
        displayName: "",
        email: user.email,
        present_address: "",
        permanent_address: "",
        nid: "",
        contact: "",
        password:"",
        id:user.id,
        photoURL: ""
    }
    const [data, setData] = useState(initialState);
    const { displayName, email, permanent_address, present_address, contact, nid ,password,id,photoURL} = data;
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(null);
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
                
                let updateUser={...user};
                updateUser.nid=data.nid;
                updateUser.contact=data.contact;
                updateUser.name=data.displayName;
                updateUser.present_address=data.present_address;
                updateUser.permanent_address=data.permanent_address;
                updateUser.photoURL=data.photoURL;
                localStorage.setItem('user',JSON.stringify(updateUser))
                setUser({...updateUser});
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
                             name='displayName'  required onChange={handleChange}/>
                        </label>
                        <label className="input-group m-2">
                            <span className='w-1/4'>NID No</span>
                            <input type="text" placeholder={ "Your National ID No"}
                             className="input input-bordered w-full" onChange={handleChange}  name='nid' required />
                        </label>
                        <label className="input-group m-2">
                            <span className='w-1/4'>present Address</span>
                            <input type="text" placeholder={ "Your Present Address"}  className="input input-bordered w-full" required name='present_address' onChange={handleChange} />
                        </label>
                        <label className="input-group m-2">
                            <span className='w-1/4'>Permanent Address</span>
                            <input type="text" placeholder={"Your Permanent Address"}  className="input input-bordered w-full" name='permanent_address' onChange={handleChange} required />
                        </label>
                        <label className="input-group m-2">
                            <span className='w-1/4'>Contact</span>
                            <input type="number" placeholder={ "Your Contact Number"} className="input input-bordered w-full"  name='contact'
                            onChange={handleChange} required />
                        </label>
                        <label className="input-group m-2">
                            <span className='w-1/4'>Change Profile Image</span>
                            <input type="file"  className="input w-full" name='photoURL'  onChange={(e) => setFile(e.target.files[0])} required />
                        </label>
                    </div>
                    <button className="btn btn-primary w-1/4" onClick={handleSubmit} disabled={progress !== null && progress < 100} >Update Profile</button>
                </>
            </div>

        </div>
    );
};

export default MyProfile;