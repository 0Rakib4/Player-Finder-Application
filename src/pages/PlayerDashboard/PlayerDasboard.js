import { collection, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';
import { db } from '../../firebase';

const PlayerDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [Team, setTeam] = useState([]);
    const [user,setUser] = useContext(UserContext)
    const [selectTeam,setSelectedTeam]=useState({})
    useEffect(()=>{
        const unsub = onSnapshot(
            collection(db, "team"),
            (snapshot) => {
                let list = [];
                snapshot.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() })
                });
                list=list.filter(item=>item.TeamManagerEmail!==user.TeamManagerEmail && item.gamesType===user.gamesType)
                setTeam(list);
                setLoading(false);
            }, (error) => {
                console.log(error);
            }
        );
        return () => {
            unsub();
            
        }
    },[])
    function viewSelectTeamManager(teamManager){
        setSelectedTeam(teamManager)
       var temp=Team.find(item=>item.TeamManagerEmail===teamManager.TeamManagerEmail)
       setSelectedTeam(temp)
    }
    return (
        
        <div>
            {/* {console.log(Team)} */}
            <div className='grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 lg:ms-28 lg:mt-28'>
                {Team.length==0?<h1 className='text-2xl text-red-500'>Sorry!! No Team Available in {user.gamesType}</h1>:
                <>
                {
                    Team.map(team=>{
                        return (
                            <div className="card card-compact w-96 bg-base-100 shadow-xl">
                                <figure><img src={team.photoURL} alt="Image" className='w-full h-96' /></figure>
                                <div className="card-body">
                                    <h2 className="card-title">Team Name: {team.TeamName}</h2>
                                    <p className='text-blue-800'>Team Manager Email: {team.TeamManagerEmail}</p>
                                    <div className="card-actions justify-end">
                                        <label htmlFor="my-modal-3" className="btn btn-primary" onClick={()=>viewSelectTeamManager(team)}>Show Details</label>
                                    </div>
                                </div>
                            </div>   
                        );
                    })}
                </>
                }
            </div>
            <input type="checkbox" id="my-modal-3" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative text-left">
                    <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                        
                        <h3 className="text-lg font-bold">Name: {selectTeam?.TeamName?selectTeam.TeamName:" "}</h3>
                        <p className="py-4"><span className='font-semibold'>Team Size:</span> {selectTeam?.TeamMemberNumber?selectTeam.TeamMemberNumber:" "}</p>
                        
                    <br/>
                </div>
            </div>
        </div>  
        
    );
};

export default PlayerDashboard;