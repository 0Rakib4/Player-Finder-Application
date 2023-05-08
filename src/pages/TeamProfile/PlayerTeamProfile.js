import { collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingContext, UserContext } from '../../App';
import { db } from '../../firebase';

const PlayerTeamProfile = () => {
    const [Team,setTeam]=useState({});
    const [TeamMember,setTeamMember]=useState([]);
    const [user,setUser]=useContext(UserContext);
    const [loading,setLoading]=useContext(LoadingContext);
    useEffect(()=>{
        console.log(user)
        const unsub = onSnapshot(
            collection(db, "team"),
            (snapshot) => {
                let list = [];
                snapshot.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() })
                });   
                console.log(user,list)
                setTeam(list.find(item=>item.TeamManagerEmail===user.TeamManagerEmail))
                setLoading(false);
            }, (error) => {
                console.log(error);
            }
        );
        return () => {
            unsub();
        }
    },[])

    useEffect(()=>{
        
        const unsub = onSnapshot(
            collection(db, "users"),
            (snapshot) => {
                let list = [];
                snapshot.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() })
                });   
                setTeamMember(list.filter(item=>item.TeamManagerEmail==user?.TeamManagerEmail))
                setLoading(false);
            }, (error) => {
                console.log(error);
            }
        );
        return () => {
            unsub();
        }
    },[Team])
    const leave=async()=>{
        if(window.confirm("Are you sure to leave your team?")){
            const docRef=doc(db,"users",user.id)
            const snapshot=await getDoc(docRef);
            if(snapshot.exists()){
                let newData={...snapshot.data(),TeamManagerEmail:""};
                try{
                    await updateDoc(doc(db, 'users',user.id), {
                        ...newData,
                    });
                    alert("You Left your team. Thank You...")
                    setUser(newData)
                    setTeam({})
                }
                catch(err){
                    console.log(err);
                }
            }
        }
    }
    return (
        <>
        {console.log(Team)}
            {Team?<>
                <div className='mt-10'>
                    <div className="flex flex-col w-full lg:flex-row">
                        <div className="grid flex-grow h-full py-10 card bg-base-300 rounded-box place-items-center">
                            <div className="avatar">
                                
                                
                                <div className="card w-96 bg-base-100 shadow-xl">
                                    <div className="mx-auto w-24 mask mask-hexagon">
                                        <img src={Team.photoURL} />
                                    </div>
                                    <div className="card-body">
                                        <h2 className="card-title">Team {Team.TeamName}!</h2>
                                        <p>Team Manager: {Team.TeamManagerEmail}</p>
                                        <div className="card-actions justify-end">
                                            <button className="btn btn-primary" onClick={leave}>Leave</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                        <div className="divider lg:divider-horizontal">  </div> 
                        <div className="grid flex-grow card bg-base-300 rounded-box place-items-center">
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
            </>:<>
            <div className="hero min-h-screen" style={{ backgroundImage: `url("/images/stock/photo-1507358522600-9f71e620c44e.jpg")` }}>
                <div className="hero-overlay bg-opacity-60"></div>
                    <div className="hero-content text-center text-neutral-content">
                        <div className="max-w-md">
                            <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
                            <p className="mb-5">You are not engaged with a Team</p>
                            <Link to='/'><button className="btn btn-primary">Join Team</button></Link>
                        </div>
                    </div>
                </div>
            </>}
        
        </>
        
    );
};

export default PlayerTeamProfile;