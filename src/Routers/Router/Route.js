import {
    createBrowserRouter,
  } from "react-router-dom";
import Main from "../../components/Main/Main";
import Home from "../../components/Home/Home";
import Register from "../../pages/Registration/Register";
import Login from "../../pages/Login/Login";
import MyProfile from "../../pages/MyProfile/MyProfile";
import Chat from "../../pages/Chat/Chat";

import Requests from "../../pages/Requests/Requests";
import TeamProfile from "../../pages/TeamProfile/TeamProfile";
import PlayerTeamProfile from "../../pages/TeamProfile/PlayerTeamProfile";
import PlayerMyProfile from "../../pages/MyProfile/PlayerMyProfile";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import Comparison from "../../pages/Comparison/Comparison";
import PlayerDashboard from "../../pages/PlayerDashboard/PlayerDasboard";
import TeamManagerDashboard from "../../pages/TeamManagerDashboard/TeamManagerDashboard";
import NewEvent from "../../pages/NewEvent/NewEvent";
import ManageAccount from "../../pages/ManageAccount/ManageAccount";
  export const router = createBrowserRouter([
      {
        path: "/",
        element: <PrivateRoute><Main/></PrivateRoute>,
        children: [
          {
            path: "/",
            element: <Home></Home>,
          },
          {
            path: "/players",
            element: <TeamManagerDashboard></TeamManagerDashboard>
          },
          {
            path: "/ManageAccount",
            element: <ManageAccount></ManageAccount>
          },
          {
            path: "/createEvent",
            element: <NewEvent></NewEvent>
          },
          {
            path: "/teamManager",
            element: <PlayerDashboard></PlayerDashboard>
          },  
          {
            path: "/MyProfile",
            element: <MyProfile></MyProfile>
          },
          {
            path: "/PlayerMyProfile",
            element: <PlayerMyProfile></PlayerMyProfile>
          },
          {
            path: "/TeamProfile",
            element: <TeamProfile></TeamProfile>,
          },
          {
            path: "/PlayerTeamProfile",
            element: <PlayerTeamProfile></PlayerTeamProfile>,
          },
          {
            path: "/Chat",
            element: <Chat></Chat>,
          },
          {
            path: "/Requests",
            element: <Requests></Requests>,
          },
          {
            path: "/Comparison",
            element: <Comparison></Comparison>,
          },
        ],
      },
      {
          path:"/login",
          element:<Login></Login>,
      },
      {
          path:"/register",
          element:<Register></Register>
      },
      {
        path:'/*', element:<div><h1 className="text-7xl">ERROR:404::Not Found</h1><p className="text-4xl">please go back...</p></div>
      }
    ]);