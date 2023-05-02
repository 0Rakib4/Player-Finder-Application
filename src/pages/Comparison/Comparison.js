import { collection, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';
import { db } from '../../firebase';

const Comparison = () => {
    const [player1,setPlayer1]=useState({})
    const [player2,setPlayer2]=useState({})
    const [players,setPlayers]=useState([])
    const [user,setUser]=useContext(UserContext)
    useEffect(()=>{
        const unsub = onSnapshot(
            collection(db, "users"),
            (snapshot) => {
                let list = [];
                snapshot.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() })
                });   
                setPlayers(list.filter(item=>item.gamesType===user.gamesType && item.userType=="Player"))
                
                
            }, (error) => {
                console.log(error);
            }
        );
        return () => {
            unsub();
        }
    },[])
    const searchPlayer=()=>{
        const playerOne=document.getElementById("search1").value;
        const filterPlayer=players.find(item=>item.email===playerOne)
        console.log(filterPlayer)
        setPlayer1(filterPlayer)
    }
    
    const searchPlayer2=()=>{
        const playerTwo=document.getElementById("search2").value;
        const filterPlayer=players.find(item=>item.email===playerTwo)
        console.log(filterPlayer)
        setPlayer2(filterPlayer)
    }
    return (
        <div className='mt-2'>
            <h1 className='text-4xl my-5'>Comparison</h1>
            <div className="flex flex-col w-full lg:flex-row">
                <div className="grid flex-grow card bg-base-300 rounded-box place-items-center">
                    <div className='flex'>
                        <input type="text" placeholder="Type here" className="input input-bordered input-primary w-full" id="search1" />
                        <button className="btn btn-success"  onClick={searchPlayer}>Search</button>
                    </div>
                    <div>
                        <h1 className='p-5 bg-red-200 rounded m-2'>Name: {player1.name?player1.name:""}</h1>
                        <h1 className='p-5 bg-red-300 rounded m-2'>Skills: {player1.skill?player1.skill:""}</h1>
                        <h1 className='p-5 bg-red-400 rounded m-2'>Scores: {player1.scores?player1.scores:""}</h1>
                        <h1 className='p-5 bg-red-500 rounded m-2'>Played Games: {player1.playedGames?player1.playedGames:""}</h1>
                    </div>
                    
                    <div className="radial-progress" style={{ "--value": ((player1.scores/player1.playedGames?player1.scores/player1.playedGames:0)*100).toFixed(2), "--size": "12rem", "--thickness": "2rem" }}>{((player1.scores/player1.playedGames?player1.scores/player1.playedGames:0)*100).toFixed(2)}%</div>
                </div> 
                <div className="divider lg:divider-horizontal">VS</div> 
                <div className="grid flex-grow card bg-base-300 rounded-box place-items-center">
                    <div className='flex'>
                        <input type="text" placeholder="Type here" className="input input-bordered input-primary w-full" id="search2"/>
                        <button className="btn btn-success" onClick={searchPlayer2}>Search</button>    
                    </div>                    
                    <div>
                        <h1 className='p-5 bg-blue-200 rounded m-2'>Name: {player2.name?player2.name:""}</h1>
                        <h1 className='p-5 bg-blue-300 rounded m-2'>Skills: {player2.skill?player2.skill:""}</h1>
                        <h1 className='p-5 bg-blue-400 rounded m-2'>Scores: {player2.scores?player2.scores:""}</h1>
                        <h1 className='p-5 bg-blue-500 rounded m-2'>Played Games: {player2.playedGames?player2.playedGames:""}</h1>
                    </div>
                    <div className="radial-progress" style={{ "--value": ((player2.scores/player2.playedGames?player2.scores/player2.playedGames:0)*100).toFixed(2), "--size": "12rem", "--thickness": "2rem","color":"blue" }}>{((player2.scores/player2.playedGames?player2.scores/player2.playedGames:0)*100).toFixed(2)}%</div>
                </div>
            </div>
        </div>
    );
};

export default Comparison;