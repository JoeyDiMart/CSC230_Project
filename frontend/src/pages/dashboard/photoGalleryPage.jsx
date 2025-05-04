import React from "react";
import Navbar from "../../components/Dashboard/dashboardNavbar";
import Sidebar from "../../components/Dashboard/sidebar";
import PhotoGalleryUpload from "../../components/Dashboard/photoGalleryUpload"

const PhotoGallery = () => {
    return (
        <div className="h-screen w-screen overflow-hidden bg-testingColorGrey">
            <div className="flex h-screen overflow-x-hidden">
                <Sidebar/>
            <div className="flex flex-col flex-1 overflow-y-auto p-2">
                <main className=" bg-testingColorBlack rounded-xl px-4 py-6 space-y-6">
                    <div>
                        <Navbar/>
                    </div>
                    <div className="flex">
                        <PhotoGalleryUpload/>
                    </div>
                </main>
          </div>
        </div>
      </div>
    )
}
export default PhotoGallery