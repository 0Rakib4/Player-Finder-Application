import { collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { LoadingContext, UserContext } from '../../App';
import { db } from '../../firebase';

const Requests = () => {
    const [request,setRequest]=useState([]);
    const [user,setUser]=useContext(UserContext)
    const [loading,setLoading]=useContext(LoadingContext)
    useEffect(()=>{
        console.log(user)
        const unsub = onSnapshot(
            collection(db, "requests"),
            (snapshot) => {
                let req = [];
                snapshot.docs.forEach((doc) => {
                    req.push({ id: doc.id, ...doc.data() })
                });   
                setRequest(req.filter(item=>item.ToEmail===user.email))
                setLoading(false);
            }, (error) => {
                console.log(error);
            }
        );
        return () => {
            unsub();
        }
    },[])
    useEffect(()=>console.log(user),[user])
    const accept=async(fromEmail)=>{
        // alert(user.id)
        const docRef=doc(db,"users",user.id)
        const snapshot=await getDoc(docRef);
        if(snapshot.exists()){
            let newData={...snapshot.data(),TeamManagerEmail:fromEmail};
            try{
                await updateDoc(doc(db, 'users',user.id), {
                    ...newData,
                });
                alert("Congratulations..!!! your are in a team")
                setUser(newData)
            }
            catch(err){
                console.log(err);
            }
        }

    }
    return (
        <div style={{display:"flex", justifyContent:"center", alignContent:"start"}}>
            {request.map(reqt=>{
                return (
                <div className="card w-96 bg-base-100 shadow-xl mx-2">
                    <div className="card-body" style={{textAlign:"left"}}>
                        <p><b>From :</b> {reqt.FromEmail}</p>
                        <p><b>Message :</b> {reqt.note}</p>
                        <div style={{display:'flex', justifyContent:"end"}}>
                            <button className="btn btn-sm btn-success mr-2" onClick={()=>accept(reqt.FromEmail)}>Accept</button>   
                            <button className="btn btn-sm btn-warning">Reject</button>
                        </div>
                    </div>
                </div>
                )
            })}
        </div>
    );
};

export default Requests;