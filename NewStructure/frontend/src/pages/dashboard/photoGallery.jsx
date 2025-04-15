import React from "react";
import Navbar from "../../components/Dashboard/dashboardNavbar";
import Sidebar from "../../components/Dashboard/sidebar";

const PhotoGallery = () => {
    return (
        <div className="h-screen w-screen overflow-hidden bg-testingColorGrey">
            <div className="flex h-screen overflow-x-hidden">
                <Sidebar/>
            <div className="flex flex-col flex-1 overflow-y-auto p-2">
            <main className=" bg-testingColorBlack w-full h-full rounded-xl px-4 py-6 space-y-6">
                <Navbar/>
            </main>
          </div>
        </div>
      </div>
    )
}
export default PhotoGallery