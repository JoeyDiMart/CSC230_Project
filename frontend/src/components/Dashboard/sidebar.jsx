import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUserPlus, FaCamera, FaChevronCircleLeft, FaChevronCircleRight, FaSignOutAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import UserInfo from "../Dashboard/Sidebar/UserInfo"
import SidebarItems from "../Dashboard/Sidebar/SidebarItem";
import Header from "../Dashboard/Sidebar/Header";
// import Logout from "../Dashboard/Sidebar/Logout";



const links = [
  { link: "/dashboard", label: "Dashboard", icon: <MdSpaceDashboard size={20} /> },
  { link: "/dashboard/addUser", label: "Add User", icon: <FaUserPlus size={20} /> },
  { link: "/dashboard/photoGalleryUpload", label: "Photo Gallery", icon: <FaCamera size={20} /> },
];



const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const [user, setUser] = useState(false)


  // Sample Test for User info 
  // const [user, setUser] = useState({
  //   name: "Admin",
  //   email: "admin@example.com",
  // });

  // Authentication Section Dashboard, Uncomment before testing
  useEffect(() => {
    fetch("/check-session")
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        console.log("Session Data: !!!", data)


        setUser({
          name: data.user.name,
          email: data.user.email,
          avatar: "/UTampa_mark.png", // Need to add avatar if we want to
        });
      })
      .catch((err) => {
        console.log("Session error:", err);
        setUser(null);
      });
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    navigate("/"); // Navigate to the home page after logout
  };



  return (
    <aside className={`h-screen overflow-hidden transition-all duration-200 ease-in-out ${isCollapsed ? "w-16" : "w-48"} `}>
      <nav className="h-full flex flex-col bg-testingColorOutline">
        {/* Sidebar Header */}
        <Header isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        {/* Navigation Links */}
        <SidebarItems isCollapsed={isCollapsed} />

        <div className="flex h-[580px] p-2 pt-0 list-none space-y-3">  
          {/* LOGOUT TBD */}
          {/* <div className="flex items-end w-full ">    
            <button onClick={handleLogout} className={`w-full bg-transparent flex items-center gap-4 rounded-lg transition-all duration-300 whitespace-nowrap hover:bg-testingColorHover 
              ${isCollapsed ? "justify-center" : "justify-start"}`}> 
              <div className="flex w-full">
                <span className="text-lg flex items-center "> 
                  <FaSignOutAlt size={20} />
                </span>
                <span className={`ml-3 text-[16px] whitespace-nowrap flex items-center`}>
                  {!isCollapsed && "Logout"}
                </span>
              </div>
            </button> */}
          </div>  
        {/* </div> */}

        {/* User Information */}
        {user && (
          <UserInfo user={user} isCollapsed={isCollapsed} handleLogout={handleLogout}/>
          )}
        
      </nav>
    </aside>
  );
};

export default Sidebar;
