import React, { useContext } from 'react';
import { UserContext } from '../../App';
import PlayerDashboard from '../../pages/PlayerDashboard/PlayerDasboard';
import TeamManagerDashboard from "../../pages/TeamManagerDashboard/TeamManagerDashboard"
import Events from '../../pages/Events/Events';
const Home = () => {
    const [user,setUser]=useContext(UserContext)
    return (
        <div>
            {/* {user.userType=='Team Manager'?<TeamManagerDashboard></TeamManagerDashboard>:user.userType=='Player'?<PlayerDashboard></PlayerDashboard>:<></>} */}
            <Events/>
        </div>
    );
};

export default Home;