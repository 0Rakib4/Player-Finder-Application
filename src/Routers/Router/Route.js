import {
    createBrowserRouter,
  } from "react-router-dom";
import Main from "../../components/Main/Main";
import Home from "../../components/Home/Home";
import Register from "../../pages/Registration/Register";
import Login from "../../pages/Login/Login";
import MyProfile from "../../pages/MyProfile/MyProfile";
import Chat from "../../pages/Chat/Chat";
import TeamManagerDashboard from "../../pages/TeamManagerDashboard/TeamManagerDashboard";
import Requests from "../../pages/Requests/Requests";
import TeamProfile from "../../pages/TeamProfile/TeamProfile";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
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
            path: "/MyProfile",
            element: <MyProfile></MyProfile>
          },
          {
            path: "/TeamProfile",
            element: <TeamProfile></TeamProfile>,
          },
          {
            path: "/Chat",
            element: <Chat></Chat>,
          },
          {
            path: "/Requests",
            element: <Requests></Requests>,
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