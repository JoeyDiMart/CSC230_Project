import { useEffect, useState } from "react"
import Sidebar from "../../components/Dashboard/sidebar"
import Navbar from "../../components/Dashboard/dashboardNavbar"
import SectionCards from "../../components/Dashboard/sectionCards"
import DataTable from "../../components/Dashboard/dataTable"
import { useNavigate } from "react-router-dom"


export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] =useState(true); //Wait for the session check
  const [isAuthenticated, setIsAuthenticated] =useState(false)

  useEffect (() => {
    fetch("http://localhost:8081/check-session", {credentials : "include"})
    .then(res => {
      if(!res.ok) throw new Error("Not authenticated");
      return res.json();
    })
    .then(data => {
      setIsAuthenticated(true);
      setLoading(false);
      })
      .catch(err => {
        navigate("/login");
        });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not authenticated</div>;

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
