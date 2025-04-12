import { useEffect, useState } from "react"
import Sidebar from "../../components/Dashboard/sidebar"
import Navbar from "../../components/Dashboard/dashboardNavbar"
import SectionCards from "../../components/Dashboard/sectionCards"
import DataTable from "../../components/Dashboard/dataTable"


export default function DashboardPage() {

  return (
    <div className="h-screen w-screen overflow-hidden bg-testingColorGrey">
      <div className="flex h-screen overflow-x-hidden">
        <Sidebar/>
        <div className="flex flex-col flex-1 overflow-y-auto p-2">
          <main className=" bg-testingColorBlack w-full h-full rounded-xl px-4 py-6 space-y-6">
            <Navbar  />
            <SectionCards />
            <DataTable />
          </main>
        </div>
      </div>
    </div>
  )
}
