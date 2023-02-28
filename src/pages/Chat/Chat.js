import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { db } from '../../firebase';
import forwardArrow from '../../assests/forward_arrow.png'
import { UserContext } from '../../App';
const Chat = () => {
    const [user,setUser] = useContext(UserContext)
    const [messages,setMessage]=useState([])
    const [messageUser,setMessageUser]=useState([])
    const [activeUser,setActiveUser]=useState('');
    const [activeUserMsg,setActiveUserMsg]=useState([]);
    const [lastID,setLastID]=useState(0);
    useEffect(()=>{
        const unsub = onSnapshot(
            collection(db, "messages"),
            (snapshot) => {
                let list = [];
                
                snapshot.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() })
                });
                var lid= Math.max.apply(Math, list.map(function(o) { return o.id }))
                setLastID(lid+1)
                list=list.filter(item=>item.FromEmail===user.email || item.ToEmail===user.email)    
                list.sort((a, b) => {
                    const nameA = a.id; // ignore upper and lowercase
                    const nameB = b.id; // ignore upper and lowercase
                    if (nameA < nameB) {
                      return -1;
                    }
                    if (nameA > nameB) {
                      return 1;
                    }
                    return 0;
                  });
                var mesuser=[];
                list.forEach((item)=>{
                    if(item.FromEmail!=user.email){
                        mesuser.push(item.FromEmail)
                    }
                    else{
                        mesuser.push(item.ToEmail)
                    }
                })
                console.log(mesuser.concat)
                mesuser = mesuser.filter(function(item, pos) {
                    return mesuser.indexOf(item) == pos;
                })
                setMessageUser(mesuser);
                
                setMessage(list);
                setActiveUser(mesuser[0]);
                setActiveUserMsg(()=>messages.filter(item=>item.FromEmail===activeUser || item.ToEmail===activeUser))
                
            }, (error) => {
                console.log(error);
            }
        );
    },[])

    const insertMessage=async()=>{
        try{
            const request={
             FromEmail:user?.email,
             ToEmail: activeUser,
             message:document.getElementById("message").value,
             id:lastID
            }
            console.log(request)
             await addDoc(collection(db, 'messages'), {
                 ...request
             });
             const newMessage=[...activeUserMsg,request]
             console.log(newMessage)
             setActiveUserMsg(newMessage);
             document.getElementById("message").value=""
         }
         
         catch(err){
             console.log(err)
         }
    }


    const createMessage=async(item)=>{
        try{
            const request={
             FromEmail:user?.email,
             ToEmail: item,
             message:"hello...",
             id:lastID
            }
            console.log(request)
             await addDoc(collection(db, 'messages'), {
                 ...request
             });
             const newMessage=[item,request]
             console.log(newMessage)
             setActiveUserMsg(newMessage);
             document.getElementById("message").value=""
         }
         
         catch(err){
             console.log(err)
         }
    }

    function loadMessage(messageId){
        setActiveUser(messageId);
        setActiveUserMsg(()=>messages.filter(item=>item.FromEmail===activeUser || item.ToEmail===activeUser))
    }
    return (
        <div className="drawer drawer-mobile">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-start justify-end m-10 ">
                {activeUserMsg.map(item=>{
                    return (
                        <div style={{marginBottom:"20px"}} className="grid w-full">
                            {item.FromEmail!=user.email?
                            <> <div className="chat chat-start justify-self-start">
                                <div className="chat-bubble">{item.message}</div>
                            </div></>:<></>}
                            {item.FromEmail==user.email? 
                            <>
                                <div className="chat chat-end justify-self-end">
                                    <div className="chat-bubble">{item.message}</div>
                                </div>
                            </>:<></>}
                        </div>
                    )
                })}
                <div className='flex w-full'>
                    <input type="text" id="message" placeholder="Type here" className="input input-primary w-full mr-2" />
                    <button className="btn btn-info" onClick={insertMessage}>Send</button>
                </div>
                
            </div> 
            <div className="drawer-side drop-shadow-xl">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label> 
                <ul className="menu p-4 w-80 bg-base-100 text-base-content  bg-sky-200 ">
                {console.log(messageUser)}
                    {messageUser.map(item=>{
                        return(
                            <li>
                                <div className='w-full bg-sky-500 mb-4'>
                                    <div className='flex'>
                                        <div className='text-lg'>
                                            {item}
                                        </div>
                                        <div className='transition ease-in-out delay-150 hover:translate-y-1 duration-300'>
                                            <img src={forwardArrow} className="w-8" onClick={()=>loadMessage(item)}/>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                    <li>
                        <div className='w-full bg-sky-500 mb-4'>
                            <div className='flex'>
                                <div className='text-lg' onClick={()=>{
                                    var item=prompt("enter the email id");
                                    createMessage(item)
                                }}>
                                    Create New Message
                                </div>
                                
                            </div>
                        </div>
                    </li>
                </ul>
            
            </div>
        </div>
    );
};

export default Chat;