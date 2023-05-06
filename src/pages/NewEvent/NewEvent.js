import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../../firebase';



const NewEvent = () => {
    const initialState = {
        EventName: "",
        GamesType:"",
        Team1:"",
        Team2:"",
        Date:"",
        Time:""
    }
    const [data, setData] = useState(initialState);
    const { EventName,GamesType,Team1,Team2,Date,Time} = data;
    
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    
    const handleSubmit = async (e) => {
        try{
            
            await addDoc(collection(db, 'events'), {
                Date,EventName,GamesType,Team1,Team2,Time
            });
            alert("Successfully event launced");
        }
        catch(err){
            console.log(err)
        }
                
    }
    return (
        <div>
            <div className='mx-auto w-3/4 mt-24'>
                <>
                    <br/>
                    
                    <div className="form-control" >
                        <label className="input-group m-2">
                            <span className='w-1/4'>Event Name</span>
                            <input type="text" placeholder={"Event Name"} className="input input-bordered w-full"
                             name='EventName'  required onChange={handleChange}/>
                        </label>
                        <label className="input-group m-2">
                            <span className='w-1/4'>Team Name</span>
                            <input type="text" placeholder={ "Team one name"}
                             className="input input-bordered w-full" onChange={handleChange}  name='Team1' required />
                        </label>
                        <label className="input-group m-2">
                            <span className='w-1/4'>Opponent Team Name</span>
                            <input type="text" placeholder={ "Team Two Name"}  className="input input-bordered w-full" required name='Team2' onChange={handleChange} />
                        </label>
                        <label className="input-group m-2">
                            <span className='w-1/4'>Date</span>
                            <input type="text" placeholder={"Enter the Date"}  className="input input-bordered w-full" name='Date' onChange={handleChange} required />
                        </label>
                        <label className="input-group m-2">
                            <span className='w-1/4'>Time</span>
                            <input type="text" placeholder={ "Enter the Time"} className="input input-bordered w-full"  name='Time'
                            onChange={handleChange} required />
                        </label>
                        <div className="mt-4">
                            <div className="flex justify-center">
                                <div className="mb-3 xl:w-full">
                                <label className="inline">Game Types</label>
                                    <select className="form-select appearance-none
                                    mx-2
                                    w-4/5
                                    px-3
                                    py-1.5
                                    text-base
                                    font-normal
                                    text-gray-700
                                    bg-white bg-clip-padding bg-no-repeat
                                    border border-solid border-gray-300
                                    rounded
                                    transition
                                    ease-in-out
                                    m-0
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example"
                                    onChange={handleChange} name='GamesType'>
                                        <option defaultValue>Select Games Type</option>
                                        <option value={'Cricket'}>Cricket</option>
                                        <option value={'Football'}>Football</option>
                                        <option value={'Hockey'}>Hockey</option>
                                    </select>
                                </div>
                            </div>
                        </div>  
                        <div className="flex">
                                <button className="w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900" onClick={handleSubmit} >Submit</button>
                        </div>  
                    </div>
                    
                </>
            </div>
            
        </div>
    );
};

export default NewEvent;