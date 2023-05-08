import { collection, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { db } from '../../firebase';
import { UserContext } from '../../App';

const Events = () => {
    const [events,setEvents]=useState([]);
    const [user,setUser]=useContext(UserContext);
    useEffect(()=>{
        const unsub = onSnapshot(
            collection(db, "events"),
            (snapshot) => {
                let list = [];
                snapshot.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() })
                });   
                if(user.userType.toLowerCase()!=="Admin".toLowerCase()){
                    setEvents(list.filter(item=>item.GamesType.toLowerCase()===user.gamesType.toLowerCase()))                
                }
                else{
                    setEvents(list);
                }
            }, (error) => {
                console.log(error);
            }
        );
        return () => {
            unsub();
        }
    },[])
    return (
        <div className='grid m-24 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {events.map(item=>{
                return(
                    <div>
                        <div className="card w-96 bg-blue-500 text-white"> 
                            <div className="card-body">
                                <h2 className="text-3xl text-center">{item.EventName}</h2>
                                <p className='text-2xl'>{item.Team1} VS {item.Team2}</p>
                                <p className='text-xl'> Date: {item.Date}</p>
                                <p className='text-xl text-center'> Time: {item.Time}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default Events;