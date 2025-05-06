// User Information in Sidebar
import React, { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";


const UserInfo = ({ user, isCollapsed, handleLogout }) => {
    //const [click, setClick] = useState(false)

  return (
    <div className="py-1 pl-2">
        <div className=" flex items-center justify-start p-4 pb-2 pt-4 rounded-lg transition-all duration-300  hover:bg-testingColorHover ">
            <div>
                <img className="w-8 h-8 rounded-full object-cover flex justify-center" src={"/UTampa_mark.png"} />
            </div>
            {!isCollapsed &&
            <>           
             <div className="flex flex-col items-start">
                <h1 className=" text-[16px] m-0 p-0 text-testingColorWhite">{user?.name}</h1>
                <p className="text-[12px] m-0 p-0 text-testingColorSubtitle">{user?.email}</p>
            </div>
            <div>
                {/* <button className="bg-transparent border-none flex"> <HiDotsVertical/> </button> */}
            </div>
            </>
            }
        </div>
    </div>
  );
};

export default UserInfo;
