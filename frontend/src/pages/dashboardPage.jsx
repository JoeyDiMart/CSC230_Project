import { useEffect, useState } from "react"
import Sidebar from "../components/Dashboard/sidebar"
import Navbar from "../components/Dashboard/dashboardNavbar"
import SectionCards from "../components/Dashboard/sectionCards"
import DataTable from "../components/Dashboard/dataTable"

export default function DashboardPage() {

  return (
    <div className="h-screen w-screen overflow-hidden bg-testingColorBlack">
      <div className="flex h-screen overflow-x-hidden">
        <Sidebar/>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <Navbar />
          <main className="w-full px-4 py-6 space-y-6">
            <SectionCards />
            <DataTable />
          </main>
        </div>
      </div>
    </div>
  )
}
