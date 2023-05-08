import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useContext, useEffect, useState } from 'react';
import { LoadingContext, UserContext } from '../../App';
import { db, storage } from '../../firebase';
import { toast } from 'react-hot-toast';

const TeamProfile = () => {
    const [user,setuser]=useContext(UserContext)
    const initialState = {
        TeamName: "",
        TeamManagerEmail: user.email,
        photoURL: "",
        TeamMemberNumber:0,
    }
    const [loading,setLoading]=useContext(LoadingContext)
    const [data, setData] = useState(initialState);
    const { TeamName,TeamManagerEmail,TeamMemberNumber,photoURL} = data;
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [team,setTeam]=useState();
    
    const [TeamMember,setTeamMember]=useState([]);
    useEffect(()=>{
        const unsub = onSnapshot(
            collection(db, "team"),
            (snapshot) => {
                let list = [];
                snapshot.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() })
                });   
                setTeam(list.find(item=>item.TeamManagerEmail==user.email))
                setLoading(false);
            }, (error) => {
                console.log(error);
            }
        );
        return () => {
            unsub();
        }
    },[])

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


    useEffect(()=>{
        
        const unsub = onSnapshot(
            collection(db, "users"),
            (snapshot) => {
                let list = [];
                snapshot.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() })
                });   
                setTeamMember(list.filter(item=>item.TeamManagerEmail==user?.email))
                setLoading(false);
            }, (error) => {
                console.log(error);
            }
        );
        return () => {
            unsub();
        }
    },[team])
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // let errors = validate();
        // if (Object.keys(errors).length) return setErrors(errors);
        if(team){
            try{
                console.log(data,team)
                setIsSubmit(true);
                await updateDoc(doc(db, 'team',team.id), {
                    ...data
                });
                
                toast("saved Successfully",{style: {
                    background: 'green',
                    color: 'white'
                }});          
            }
            catch(err){
                console.log(err)
            }
        }   
    }
    return (
        <div>
            <div className="flex flex-col w-full lg:flex-row">
                <div className='mx-10 w-1/2 mt-24'>
                    <>                    
                        <div className="form-control">
                            <label className="input-group m-2">
                                <span className='w-1/4'>Team Name</span>
                                <input type="text" placeholder={"Enter your team name"} className="input input-bordered w-full"
                                name='TeamName'  required onChange={handleChange}/>
                            </label>
                            <label className="input-group m-2">
                                <span className='w-1/4'>Team Member Number</span>
                                <input type="number" placeholder={"Enter the number of your team"}
                                className="input input-bordered w-full" onChange={handleChange}  name='TeamMemberNumber' required />
                            </label>
                            <label className="input-group m-2">
                                <span className='w-1/4'>Team Logo</span>
                                <input type="file"  className="input w-full" name='photoURL'  onChange={(e) => setFile(e.target.files[0])} required />
                            </label>
                        </div>
                        <button className="btn btn-primary w-1/4" onClick={handleSubmit} disabled={progress !== null && progress < 100} >Save</button>
                    </>
                </div>
                <div className="divider lg:divider-horizontal">  </div> 
                <div className="grid flex-grow card bg-base-300 rounded-box place-items-center w-1/2 mt-24 mx-10">
                    <div className="overflow-x-auto w-full">
                        <table className="table w-full">    
                            <thead>
                                <tr>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {TeamMember.map(tm=>{
                                    return(
                                        <tr>            
                                            <td>
                                            <div className="flex items-center space-x-3">
                                                <div>
                                                    <div className="font-bold">{tm.name}</div>
                                                    <div className="text-sm opacity-50">{tm.contact}</div>
                                                </div>
                                            </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamProfile;