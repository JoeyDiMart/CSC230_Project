import React from "react";
import { HiDotsVertical } from "react-icons/hi";

const UserInfo = ({ user, isCollapsed, handleLogout }) => {
  return (
    <div className="mt-auto py-4 w-full">
        <div className=" flex items-center justify-start gap-2 p-2 ">
            <div>
                <img  className="w-8 h-8 rounded-full object-cover flex justify-center" src={user.avatar} alt="User Avatar" />
            </div>
            {!isCollapsed &&
            <>           
             <div className="flex flex-col items-start">
                <h1 className=" text-[16px] m-0 p-0 text-testingColorWhite">{user.name}</h1>
                <p className="text-[12px] m-0 p-0 text-testingColorSubtitle">{user.email}</p>
            </div>
            <div>
                <HiDotsVertical className="text-testingColorWhite"/>
            </div>
            </>

            }
        </div>
    </div>
  );
};

export default UserInfo;
