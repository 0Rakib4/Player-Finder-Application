import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';

const ManageAccount = () => {
    const [searchUser,setSearchUser]=useState({});
    const [list,setList]=useState([]);
    useEffect(()=>{
        const unsub = onSnapshot(
            collection(db, "users"),
            (snapshot) => {
                let list = [];
                snapshot.docs.forEach((doc) => {
                    list.push({id:doc.id,...doc.data() })
                });
                setList(list);
            }, (error) => {
                console.log(error);
            }
        )
    },[])
    const searchedUser=()=>{
        let search=document.getElementById('search').value;
        if(search){
            setSearchUser(list.find(item=>item.email===search));
        }
    }
    const action=async (id,status)=>{
        if(id){
            let updateUser={...searchUser};
            updateUser.status=status
            await updateDoc(doc(db, 'users',id), {
                ...updateUser
            });
            
        }
    }
    return (
        <div>
            <div className="mockup-code bg-blue-400 text-primary-content m-20">
                <div className="form-control mx-auto w-1/2">
                    <div className="input-group">
                        <input type="text" placeholder="Search…" className="input input-bordered w-full" id="search" />
                        <button className="btn btn-square" onClick={searchedUser}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </button>
                    </div>
                </div>
                <div className="artboard artboard-horizontal phone-1 bg-primary text-white mx-auto rounded rounded-lg my-20 p-20">
                    <label className='block text-left text-2xl text-red-900'>Name:  {searchUser?.name?searchUser.name:""} </label>
                    <label className='block text-left text-lg'>Account Type:  {searchUser?.userType?searchUser.userType:""}</label>
                    <label className='block text-left text-lg'>Email Account:  {searchUser?.email?searchUser.email:""}</label>
                    <label className='block text-left text-lg'>Contact:  {searchUser?.contact?searchUser.contact:""}</label>
                    <label className='block text-left text-lg'>Games Type:  {searchUser?.gamesType?searchUser.gamesType:""}</label>
                    
                    
                    <br/>
                    <button className="btn btn-wide" onClick={()=>action(searchUser.id,searchUser.status=="Block"?"UnBlock":"Block")}>{searchUser?.status=="Block"?"UnBlock":"Block"}</button>
                    
                </div>
            </div>
            
        </div>
    );
};

export default ManageAccount;