import { useEffect, useState } from "react"
import SectionCards from "../../components/Dashboard/sectionCards"
import DataTable from "../../components/Dashboard/dataTable"
import { useNavigate } from "react-router-dom"


export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] =useState(true); //Wait for the session check
  const [isAuthenticated, setIsAuthenticated] =useState(false)


  // useEffect (() => {
  //   fetch("check-session", {credentials : "include"})
  //   .then(res => {
  //     if(!res.ok) throw new Error("Not authenticated");
  //     return res.json();
  //   })
  //   .then(data => {
  //     setIsAuthenticated(true);
  //     setLoading(false);
  //     })
  //     .catch(err => {
  //       navigate("/login");
  //       });
  // }, []);

  // if (loading) return <div>Loading...</div>;
  // if (!isAuthenticated) return <div>Not authenticated</div>;

  return (
    <div className="bg-testingColorBlack">
      <SectionCards />
      <DataTable />
    </div>
  )
}
