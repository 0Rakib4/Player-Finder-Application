import React, { useContext, useEffect, useState } from 'react';
import { onSnapshot, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import {  UserContext } from '../../App';
import { async } from '@firebase/util';
import { toast } from 'react-hot-toast';

const MyProfile = () => {
    const [loading, setLoading] = useState(false);
    const [players, setPlayers] = useState([]);
    const [team, setTeam] = useState([]);
    const [user,setUser] = useContext(UserContext)
    const [selectPlayer,setSelectedPlayer]=useState({})
    const [selectTeam,setSelectedTeam]=useState({})
    const [reviews,setReview]=useState([])
    useEffect(()=>{
        const unsub = onSnapshot(
            collection(db, "users"),
            (snapshot) => {
                let list = [];
                snapshot.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() })
                });
                list=list.filter(item=>item.userType!=='Team Manager' && item.gamesType===user.gamesType)
                setPlayers(list);
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
            collection(db, "reviews"),
            (snapshot) => {
                let list = [];
                snapshot.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() })
                });
                
                setReview(list);
                setLoading(false);
            }, (error) => {
                console.log(error);
            }
        );
        return () => {
            unsub();
            
        }
    },[reviews])

    const sentRequest=async()=>{
        var note=prompt("Please enter a request note")
        try{
           const request={
            FromEmail:user?.email,
            ToEmail: selectPlayer.email,
            note:note,
            status:"0"
           }
            await addDoc(collection(db, 'requests'), {
                ...request,
                timeStamp: serverTimestamp(),
            });
            toast('Successfully sent request')
        }
        catch(err){
            console.log(err)
        }
        
    }

    useEffect(()=>{
        const unsub = onSnapshot(
            collection(db, "team"),
            (snapshot) => {
                let list = [];
                snapshot.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() })
                });
                setTeam(list);
                
            }, (error) => {
                console.log(error);
            }
        );
        return () => {
            unsub();
            
        }
    },[])

    function addReview(){
        var r=prompt("add a review");    
        try{
            const rev={
                FromEmail:user?.email,
                ToEmail: selectPlayer.email,
                review:r
            }
            addDoc(collection(db, 'reviews'), {
                ...rev,
                timeStamp: serverTimestamp(),
            });
            toast('Successfully Review Added')
        }
        catch(err){
            console.log(err)
        }
        
        
    }
    function viewSelectPlayer(player){
        console.log(player)
        setSelectedPlayer(player)
       var temp=team.find(item=>item.TeamManagerEmail===player.TeamManagerEmail)
       setSelectedTeam(temp)
    }
    return (
        
        <div>
           <h1 className='text-4xl text-blue-500'>Team Manager Dashboard</h1>
            <div className='grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 lg:ms-28 lg:mt-28'>
                
                {players.length==0?<h1 className='text-2xl text-red-500'>Sorry!! No Players Available in {user.gamesType}</h1>:
                <>
                {
                    players.map(player=>{
                        return (
                            <div className="card card-compact w-96 bg-base-100 shadow-xl">
                                <figure><img src={player.photoURL} alt="Shoes" className='w-full h-96' /></figure>
                                <div className="card-body">
                                    <h2 className="card-title">Player Name: {player.name}</h2>
                                    <p className='text-left'>Games Types: {player.gamesType}</p>
                                    <div className="card-actions justify-end">
                                        <label  htmlFor="my-modal-3" className="btn btn-primary" onClick={()=>viewSelectPlayer(player)}>Show Details</label>
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
                    
                        <div className='flex justify-between'>
                            <div className="avatar">
                                <div className="w-28 mask mask-hexagon">
                                    <img src={selectPlayer.photoURL?selectPlayer.photoURL:""} alt="not found"/>
                                </div>
                            </div>
                            <div className='mr-12'>
                                <div className="avatar">
                                    <div className="w-16 mask mask-hexagon">
                                        <img src={selectTeam?.photoURL?selectTeam.photoURL:""} alt="not found"/>
                                    </div>
                                </div>
                                <p className='text-blue-500 text-xl'>{selectTeam?.TeamName?selectTeam.TeamName:""}</p>
                            </div>
                            
                        </div>
                        <h3 className="text-lg font-bold">Name: {selectPlayer.name}</h3>
                        <p className="py-4"><span className='font-semibold'>SKills:</span> {selectPlayer.skill}</p>
                        <p className="py-4"><span className='font-semibold'>Played Games:</span> {selectPlayer.playedGames}</p>
                        <p className="py-4"><span className='font-semibold'>Scores:</span> {selectPlayer.scores}</p>
                        <p className="py-4"><span className='font-semibold'>Expetected Price:</span> {selectPlayer.expectedPrice}</p>
                        <p className="py-4"><span className='font-semibold'>Contact:</span> {selectPlayer.contact}</p>
                        <p className="py-4"><span className='font-semibold'>Player email:</span> {selectPlayer.email}</p>
                        <p className="py-4"><span className='font-semibold'>Presend Address:</span> {selectPlayer.present_address}</p>
                        <div className='flex  '>
                            <button className='btn btn-success mr-5' onClick={addReview}>Review</button>
                            <button className='btn btn-warning' onClick={sentRequest}>Sent Request</button>
                        </div>
                    <br/>
                    <br/>
                    <br/>
                    <hr/>
                    <h1 style={{color:"red", fontSize:"30px"}}>Reviews</h1>
                    <div>
                    
                        {reviews.map(review=>{
                            return(
                                <div>
                                    
                                    <div style={{border:"2px solid black", margin:"20px 0px", borderRadius:"20px", padding:"20px",backgroundColor:"lightblue"}}>
                                        <h1 className='text-purple-900 font-bold'>From : {review.FromEmail}</h1>
                                        <p className='text-rose-800 font-semibold'>Review : {review.review}</p>   
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;